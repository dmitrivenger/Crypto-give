const { getProvider, CONFIRMATIONS_REQUIRED } = require('../config/blockchain');
const Organization = require('../models/Organization');
const Donation = require('../models/Donation');
const CryptoPriceService = require('./CryptoPriceService');
const { calculateUsdValue, formatDateToISO } = require('../utils/priceUtils');
const { normalizeAddress } = require('../utils/blockchainUtils');
const logger = require('../utils/logger');

const lastCheckedBlocks = {};

async function checkPendingDonations() {
  try {
    const pending = await Donation.findPending();
    if (!pending.length) return;

    logger.debug(`Checking ${pending.length} pending donation(s)`);

    for (const donation of pending) {
      await verifyDonation(donation);
    }
  } catch (err) {
    logger.error(`Error checking pending donations: ${err.message}`);
  }
}

async function verifyDonation(donation) {
  try {
    const provider = getProvider(donation.blockchain);
    const receipt = await provider.getTransactionReceipt(donation.tx_hash);
    if (!receipt) {
      logger.debug(`TX ${donation.tx_hash} not yet mined`);
      return;
    }

    const currentBlock = await provider.getBlockNumber();
    const txBlock = Number(receipt.blockNumber);
    const confirmations = currentBlock - txBlock;
    const required = CONFIRMATIONS_REQUIRED[donation.blockchain] || 12;

    logger.debug(`TX ${donation.tx_hash}: ${confirmations}/${required} confirmations`);

    if (receipt.status === 0) {
      await Donation.updateStatus(donation.id, 'failed');
      logger.info(`Donation ${donation.id} failed (reverted)`);
      return;
    }

    if (confirmations >= required) {
      const block = await provider.getBlock(txBlock);
      const txDate = formatDateToISO(new Date(Number(block.timestamp) * 1000));
      const price = await CryptoPriceService.getPriceAtDate(donation.token, txDate);
      const amountUsd = price ? calculateUsdValue(donation.amount, price) : null;

      await Donation.updateFromBlockchain(donation.id, {
        block_number: txBlock,
        tx_index: receipt.index,
        gas_used: receipt.gasUsed.toString(),
        confirmation_count: confirmations,
        tx_status: 'confirmed',
        confirmed_at: new Date(Number(block.timestamp) * 1000),
      });

      if (amountUsd !== null) {
        await Donation.updateUsdValue(donation.id, amountUsd, new Date());
      }

      logger.info(`Donation ${donation.id} confirmed! USD value: $${amountUsd}`);
    }
  } catch (err) {
    logger.error(`Error verifying donation ${donation.id}: ${err.message}`);
  }
}

async function scanNewTransactions() {
  try {
    const activeAddresses = await Organization.getAllActiveAddresses();

    for (const addrRecord of activeAddresses) {
      const { blockchain, address } = addrRecord;
      await scanAddressForNewTx(blockchain, address, addrRecord);
    }
  } catch (err) {
    logger.error(`Error scanning new transactions: ${err.message}`);
  }
}

async function scanAddressForNewTx(blockchain, address, orgRecord) {
  try {
    const provider = getProvider(blockchain);
    const currentBlock = await provider.getBlockNumber();
    const key = `${blockchain}:${address}`;
    const lastBlock = lastCheckedBlocks[key] || currentBlock - 100;

    if (currentBlock <= lastBlock) return;

    // Look for donations already in DB from this address
    const knownTxs = await Donation.findByOrgAddress(address, blockchain, lastBlock);
    const knownHashes = new Set(knownTxs.map(d => d.tx_hash.toLowerCase()));

    // Query provider for recent txs to this address (via getLogs for ERC20, basic for native)
    // For MVP, we rely on pending donations submitted by users (via /donations/confirm)
    // This passive scan just updates confirmations on known pending txs

    lastCheckedBlocks[key] = currentBlock;
  } catch (err) {
    logger.error(`Error scanning ${blockchain} address ${address}: ${err.message}`);
  }
}

async function updateMissingUsdValues() {
  try {
    const donations = await Donation.findConfirmedWithoutUsd();
    for (const d of donations) {
      const dateStr = formatDateToISO(new Date(d.confirmed_at || d.created_at));
      const price = await CryptoPriceService.getPriceAtDate(d.token, dateStr);
      if (price) {
        const amountUsd = calculateUsdValue(d.amount, price);
        await Donation.updateUsdValue(d.id, amountUsd, new Date());
        logger.info(`Updated USD value for donation ${d.id}: $${amountUsd}`);
      }
    }
  } catch (err) {
    logger.error(`Error updating USD values: ${err.message}`);
  }
}

module.exports = {
  checkPendingDonations,
  scanNewTransactions,
  updateMissingUsdValues,
};
