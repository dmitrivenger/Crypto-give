const DonationService = require('../services/DonationService');
const { isValidWalletAddress } = require('../utils/validators');
const logger = require('../utils/logger');

async function initiateDonation(req, res, next) {
  try {
    const { orgId, amount, token, blockchain } = req.validatedBody || req.body;
    const walletAddress = req.walletAddress;

    const result = await DonationService.initiateDonation(
      walletAddress, orgId, amount, token, blockchain
    );
    res.json({ status: 'success', data: result });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ status: 'error', code: err.code, message: err.message });
    next(err);
  }
}

async function confirmDonation(req, res, next) {
  try {
    const { txHash, orgId, blockchain, token, amount } = req.validatedBody || req.body;
    const walletAddress = req.walletAddress;

    const result = await DonationService.confirmDonation(
      walletAddress, txHash, orgId, blockchain, token, amount
    );
    res.json({
      status: 'success',
      data: {
        id: result.id,
        txHash: result.txHash,
        status: result.status,
        message: 'Transaction received! Waiting for blockchain confirmation (typically 30 seconds to a few minutes).',
      },
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ status: 'error', code: err.code, message: err.message });
    next(err);
  }
}

async function getDonations(req, res, next) {
  try {
    const { walletAddress } = req.params;

    if (!isValidWalletAddress(walletAddress)) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_WALLET_ADDRESS',
        message: 'Invalid wallet address format',
      });
    }

    const filters = {
      year: req.query.year ? parseInt(req.query.year, 10) : undefined,
      orgId: req.query.orgId ? parseInt(req.query.orgId, 10) : undefined,
      blockchain: req.query.blockchain,
      status: req.query.status,
    };

    const result = await DonationService.getDonationsByWallet(walletAddress, filters);

    if (!result.donations.length) {
      return res.status(404).json({
        status: 'error',
        code: 'NO_DONATIONS_FOUND',
        message: `No donations found for wallet ${walletAddress}`,
      });
    }

    res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { initiateDonation, confirmDonation, getDonations };
