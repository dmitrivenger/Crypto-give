const express = require('express');
const router = express.Router();
const CryptoPriceService = require('../services/CryptoPriceService');
const { general } = require('../middleware/rateLimiter');

router.get('/:token/:date', general, async (req, res, next) => {
  try {
    const { token, date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_DATE',
        message: 'Date must be in YYYY-MM-DD format',
      });
    }
    const price = await CryptoPriceService.getPriceAtDate(token, date);
    if (price === null) {
      return res.status(404).json({
        status: 'error',
        code: 'PRICE_NOT_FOUND',
        message: `Price not available for ${token} on ${date}`,
      });
    }
    res.json({
      status: 'success',
      data: { token: token.toUpperCase(), date, priceUsd: price, source: 'coingecko' },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
