const User = require('../models/User');
const { isValidWalletAddress } = require('../utils/validators');

async function getUser(req, res, next) {
  try {
    const { walletAddress } = req.params;
    if (!isValidWalletAddress(walletAddress)) {
      return res.status(400).json({ status: 'error', code: 'INVALID_WALLET_ADDRESS', message: 'Invalid wallet address' });
    }
    const user = await User.findByWallet(walletAddress);
    if (!user) {
      return res.status(404).json({ status: 'error', code: 'USER_NOT_FOUND', message: 'User not found' });
    }
    res.json({ status: 'success', data: formatUser(user) });
  } catch (err) {
    next(err);
  }
}

async function upsertUser(req, res, next) {
  try {
    const { walletAddress } = req.params;
    if (!isValidWalletAddress(walletAddress)) {
      return res.status(400).json({ status: 'error', code: 'INVALID_WALLET_ADDRESS', message: 'Invalid wallet address' });
    }
    const { firstName, lastName, email, taxNumber } = req.body;
    const user = await User.upsert(walletAddress, { firstName, lastName, email, taxNumber });
    res.json({ status: 'success', data: formatUser(user) });
  } catch (err) {
    next(err);
  }
}

function formatUser(user) {
  return {
    walletAddress: user.wallet_address,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    taxNumber: user.tax_number,
    profileComplete: user.profile_complete,
    createdAt: user.created_at,
  };
}

async function deleteUser(req, res, next) {
  try {
    const { walletAddress } = req.params;
    if (!isValidWalletAddress(walletAddress)) {
      return res.status(400).json({ status: 'error', code: 'INVALID_WALLET_ADDRESS', message: 'Invalid wallet address' });
    }
    const deleted = await User.deleteByWallet(walletAddress);
    if (!deleted) {
      return res.status(404).json({ status: 'error', code: 'USER_NOT_FOUND', message: 'User not found' });
    }
    res.json({ status: 'success', message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUser, upsertUser, deleteUser };
