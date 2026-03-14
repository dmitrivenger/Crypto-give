const { query } = require('../config/database');

async function findByWallet(walletAddress) {
  const result = await query(
    `SELECT * FROM users WHERE LOWER(wallet_address) = LOWER($1)`,
    [walletAddress]
  );
  return result.rows[0] || null;
}

async function upsert(walletAddress, data = {}) {
  const { firstName, lastName, email, taxNumber } = data;
  const profileComplete = !!(firstName && lastName && email);

  const result = await query(
    `INSERT INTO users (wallet_address, first_name, last_name, email, tax_number, profile_complete)
     VALUES (LOWER($1), $2, $3, $4, $5, $6)
     ON CONFLICT (wallet_address) DO UPDATE SET
       first_name = COALESCE($2, users.first_name),
       last_name = COALESCE($3, users.last_name),
       email = COALESCE($4, users.email),
       tax_number = COALESCE($5, users.tax_number),
       profile_complete = $6,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [walletAddress, firstName || null, lastName || null, email || null, taxNumber || null, profileComplete]
  );
  return result.rows[0];
}

async function deleteByWallet(walletAddress) {
  const result = await query(
    `DELETE FROM users WHERE LOWER(wallet_address) = LOWER($1) RETURNING wallet_address`,
    [walletAddress]
  );
  return result.rowCount > 0;
}

module.exports = { findByWallet, upsert, deleteByWallet };
