const rateLimit = require('express-rate-limit');

const general = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' },
});

const donations = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.headers['x-wallet-address'] || req.ip,
  message: { status: 'error', code: 'RATE_LIMITED', message: 'Too many donation requests. Please wait before trying again.' },
});

const taxReports = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.headers['x-wallet-address'] || req.params.walletAddress || req.ip,
  message: { status: 'error', code: 'RATE_LIMITED', message: 'Too many report requests. Please wait before trying again.' },
});

const organizations = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { status: 'error', code: 'RATE_LIMITED', message: 'Too many requests.' },
});

module.exports = { general, donations, taxReports, organizations };
