const { query } = require('../config/database');

async function findByWalletAndYear(walletAddress, year) {
  const result = await query(
    `SELECT * FROM tax_reports WHERE LOWER(donor_wallet_address) = LOWER($1) AND year = $2`,
    [walletAddress, year]
  );
  return result.rows[0] || null;
}

async function upsert(walletAddress, year, totalUsd, count) {
  const result = await query(
    `INSERT INTO tax_reports (donor_wallet_address, year, total_donations_usd, total_donations_count, pdf_generated_at)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
     ON CONFLICT (donor_wallet_address, year) DO UPDATE
       SET total_donations_usd = $3, total_donations_count = $4, pdf_generated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [walletAddress.toLowerCase(), year, totalUsd, count]
  );
  return result.rows[0];
}

module.exports = { findByWalletAndYear, upsert };
