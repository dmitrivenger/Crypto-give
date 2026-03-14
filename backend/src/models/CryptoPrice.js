const { query } = require('../config/database');

async function findByTokenAndDate(token, date) {
  const result = await query(
    `SELECT * FROM crypto_prices WHERE token = $1 AND date = $2`,
    [token.toUpperCase(), date]
  );
  return result.rows[0] || null;
}

async function upsert(token, date, priceUsd, source = 'coingecko') {
  const result = await query(
    `INSERT INTO crypto_prices (token, date, price_usd, source)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (token, date) DO UPDATE SET price_usd = $3, source = $4
     RETURNING *`,
    [token.toUpperCase(), date, priceUsd, source]
  );
  return result.rows[0];
}

module.exports = { findByTokenAndDate, upsert };
