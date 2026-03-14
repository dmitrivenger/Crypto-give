const { isValidWalletAddress } = require('../utils/validators');

function extractWallet(req, res, next) {
  const wallet = req.headers['x-wallet-address'] || req.query.walletAddress;
  if (wallet) {
    req.walletAddress = wallet.toLowerCase();
  }
  next();
}

function requireWallet(req, res, next) {
  const wallet = req.headers['x-wallet-address'] || req.query.walletAddress;
  if (!wallet) {
    return res.status(401).json({
      status: 'error',
      code: 'WALLET_REQUIRED',
      message: 'Wallet address required. Include X-Wallet-Address header.',
    });
  }
  if (!isValidWalletAddress(wallet)) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_WALLET_ADDRESS',
      message: 'Invalid wallet address format.',
    });
  }
  req.walletAddress = wallet.toLowerCase();
  next();
}

module.exports = { extractWallet, requireWallet };
