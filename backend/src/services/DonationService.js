const Donation = require('../models/Donation');
const Organization = require('../models/Organization');
const { getProvider, isTokenSupported } = require('../config/blockchain');
const { getExplorerUrl, normalizeAddress } = require('../utils/blockchainUtils');
const CryptoPriceService = require('./CryptoPriceService');
const { calculateUsdValue, formatDateToISO } = require('../utils/priceUtils');
const logger = require('../utils/logger');

async function initiateDonation(walletAddress, orgId, amount, token, blockchain) {
  // Validate org
  const org = await Organization.findById(orgId);
  if (!org) throw Object.assign(new Error('Organization not found'), { code: 'ORG_NOT_FOUND', status: 404 });

  // Validate token+blockchain combo
  if (!isTokenSupported(blockchain, token)) {
    throw Object.assign(
      new Error(`Token ${token} not supported on ${blockchain}`),
      { code: 'UNSUPPORTED_TOKEN', status: 400 }
    );
  }

  // Find recipient address
  const addresses = org.blockchain_addresses || [];
  const addrEntry = (org.blockchain_addresses || []).find(
    b => b.blockchain === blockchain
  );

  // If no blockchain_addresses loaded, query DB
  let recipientAddress;
  if (addrEntry) {
    recipientAddress = addrEntry.address;
  } else {
    const { query } = require('../config/database');
    const res = await query(
      `SELECT address FROM org_blockchain_addresses WHERE org_id = $1 AND blockchain = $2 AND is_active = true LIMIT 1`,
      [orgId, blockchain]
    );
    if (!res.rows.length) {
      throw Object.assign(
        new Error(`Organization does not accept ${blockchain} donations`),
        { code: 'BLOCKCHAIN_NOT_SUPPORTED', status: 400 }
      );
    }
    recipientAddress = res.rows[0].address;
  }

  // Get current price
  const today = formatDateToISO(new Date());
  const priceUsd = await CryptoPriceService.getPriceAtDate(token, today);
  const amountUsd = priceUsd ? calculateUsdValue(amount, priceUsd) : null;

  const donationId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  return {
    donationId,
    orgName: org.name,
    orgId: org.id,
    recipientAddress,
    amount: amount.toString(),
    token,
    blockchain,
    amountUsd,
    priceAsOf: new Date().toISOString(),
    message: `Send ${amount} ${token} to the address shown. Keep your transaction hash for verification.`,
    expiresAt,
  };
}

async function confirmDonation(walletAddress, txHash, orgId, blockchain, token, amount) {
  // Check if already exists
  const existing = await Donation.findByTxHash(txHash);
  if (existing) {
    return { id: existing.id, txHash, status: existing.tx_status };
  }

  // Find org address to use as to_address
  const { query } = require('../config/database');
  const res = await query(
    `SELECT address FROM org_blockchain_addresses WHERE org_id = $1 AND blockchain = $2 AND is_active = true LIMIT 1`,
    [orgId, blockchain]
  );
  const toAddress = res.rows[0]?.address || '0x0000000000000000000000000000000000000000';

  const donation = await Donation.create({
    donor_wallet_address: walletAddress,
    org_id: orgId,
    blockchain,
    token,
    amount,
    tx_hash: txHash,
    from_address: walletAddress,
    to_address: toAddress,
  });

  logger.info(`Donation created: id=${donation.id} tx=${txHash}`);
  return { id: donation.id, txHash, status: 'pending' };
}

async function getDonationsByWallet(walletAddress, filters = {}) {
  const donations = await Donation.findByWallet(walletAddress, filters);

  const formatted = donations.map(d => ({
    id: d.id,
    date: d.created_at,
    organization: d.org_name,
    amount: d.amount,
    token: d.token,
    amountUsd: d.amount_usd ? parseFloat(d.amount_usd) : null,
    blockchain: d.blockchain,
    txHash: d.tx_hash,
    txLink: getExplorerUrl(d.blockchain, d.tx_hash),
    status: d.tx_status,
    confirmedAt: d.confirmed_at,
    blockNumber: d.block_number,
  }));

  const totalUsd = formatted
    .filter(d => d.status === 'confirmed')
    .reduce((sum, d) => sum + (d.amountUsd || 0), 0);

  return {
    wallet: walletAddress,
    totalDonations: Math.round(totalUsd * 100) / 100,
    totalCount: formatted.length,
    donations: formatted,
  };
}

async function verifyAndUpdateDonation(donationId, blockchain) {
  const donation = await Donation.findByTxHash(donationId);
  if (!donation) return null;

  try {
    const provider = getProvider(blockchain);
    const tx = await provider.getTransaction(donation.tx_hash);
    if (!tx) return donation;

    const receipt = await provider.getTransactionReceipt(donation.tx_hash);
    if (!receipt) return donation;

    const currentBlock = await provider.getBlockNumber();
    const confirmations = currentBlock - Number(receipt.blockNumber);

    const REQUIRED = blockchain === 'ethereum' ? 12 : 128;
    const isConfirmed = receipt.status === 1 && confirmations >= REQUIRED;

    if (isConfirmed && donation.tx_status !== 'confirmed') {
      const block = await provider.getBlock(receipt.blockNumber);
      const txDate = formatDateToISO(new Date(Number(block.timestamp) * 1000));
      const price = await CryptoPriceService.getPriceAtDate(donation.token, txDate);
      const amountUsd = price ? calculateUsdValue(donation.amount, price) : null;

      await Donation.updateFromBlockchain(donation.id, {
        block_number: Number(receipt.blockNumber),
        tx_index: receipt.index,
        gas_used: receipt.gasUsed.toString(),
        confirmation_count: confirmations,
        tx_status: 'confirmed',
        confirmed_at: new Date(Number(block.timestamp) * 1000),
      });

      if (amountUsd !== null) {
        await Donation.updateUsdValue(donation.id, amountUsd, new Date());
      }
    } else if (receipt.status === 0) {
      await Donation.updateStatus(donation.id, 'failed');
    }
  } catch (err) {
    logger.error(`Failed to verify donation ${donation.id}: ${err.message}`);
  }

  return donation;
}

module.exports = {
  initiateDonation,
  confirmDonation,
  getDonationsByWallet,
  verifyAndUpdateDonation,
};
