const { query } = require('../config/database');

async function create(data) {
  const result = await query(
    `INSERT INTO donations
      (donor_wallet_address, org_id, blockchain, token, amount, tx_hash, from_address, to_address, tx_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
     RETURNING *`,
    [
      data.donor_wallet_address.toLowerCase(),
      data.org_id,
      data.blockchain,
      data.token,
      data.amount,
      data.tx_hash.toLowerCase(),
      data.from_address ? data.from_address.toLowerCase() : null,
      data.to_address.toLowerCase(),
    ]
  );
  return result.rows[0];
}

async function findByWallet(walletAddress, filters = {}) {
  const conditions = ['LOWER(d.donor_wallet_address) = LOWER($1)'];
  const params = [walletAddress];
  let idx = 2;

  if (filters.year) {
    conditions.push(`EXTRACT(YEAR FROM d.created_at) = $${idx++}`);
    params.push(filters.year);
  }
  if (filters.orgId) {
    conditions.push(`d.org_id = $${idx++}`);
    params.push(filters.orgId);
  }
  if (filters.blockchain) {
    conditions.push(`d.blockchain = $${idx++}`);
    params.push(filters.blockchain);
  }
  if (filters.status) {
    conditions.push(`d.tx_status = $${idx++}`);
    params.push(filters.status);
  }

  const sql = `
    SELECT d.*, o.name as org_name, o.tax_id as org_tax_id
    FROM donations d
    JOIN organizations o ON o.id = d.org_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY d.created_at DESC
  `;
  const result = await query(sql, params);
  return result.rows;
}

async function findByTxHash(txHash) {
  const result = await query(
    `SELECT d.*, o.name as org_name FROM donations d
     JOIN organizations o ON o.id = d.org_id
     WHERE LOWER(d.tx_hash) = LOWER($1)`,
    [txHash]
  );
  return result.rows[0] || null;
}

async function updateStatus(id, status, confirmedAt = null) {
  const result = await query(
    `UPDATE donations SET tx_status = $1, confirmed_at = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $3 RETURNING *`,
    [status, confirmedAt, id]
  );
  return result.rows[0];
}

async function updateFromBlockchain(id, data) {
  const result = await query(
    `UPDATE donations SET
      block_number = $1, tx_index = $2, gas_used = $3,
      confirmation_count = $4, tx_status = $5,
      confirmed_at = $6, updated_at = CURRENT_TIMESTAMP
     WHERE id = $7 RETURNING *`,
    [data.block_number, data.tx_index, data.gas_used,
     data.confirmation_count, data.tx_status, data.confirmed_at, id]
  );
  return result.rows[0];
}

async function updateUsdValue(id, amountUsd, priceCheckedAt) {
  const result = await query(
    `UPDATE donations SET amount_usd = $1, price_checked_at = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $3 RETURNING *`,
    [amountUsd, priceCheckedAt, id]
  );
  return result.rows[0];
}

async function findPending() {
  const result = await query(
    `SELECT d.*, o.name as org_name
     FROM donations d
     JOIN organizations o ON o.id = d.org_id
     WHERE d.tx_status = 'pending'
     ORDER BY d.created_at ASC`
  );
  return result.rows;
}

async function findConfirmedWithoutUsd() {
  const result = await query(
    `SELECT * FROM donations
     WHERE tx_status = 'confirmed' AND amount_usd IS NULL
     ORDER BY created_at ASC`
  );
  return result.rows;
}

async function getSummary(walletAddress, year) {
  const result = await query(
    `SELECT
       COUNT(*) as total_count,
       COALESCE(SUM(amount_usd), 0) as total_usd
     FROM donations
     WHERE LOWER(donor_wallet_address) = LOWER($1)
       AND EXTRACT(YEAR FROM created_at) = $2
       AND tx_status = 'confirmed'`,
    [walletAddress, year]
  );
  return result.rows[0];
}

async function findByOrgAddress(toAddress, blockchain, sinceBlock) {
  const params = [toAddress.toLowerCase(), blockchain];
  let sql = `SELECT * FROM donations
             WHERE LOWER(to_address) = $1 AND blockchain = $2`;
  if (sinceBlock) {
    sql += ` AND block_number > $3`;
    params.push(sinceBlock);
  }
  const result = await query(sql, params);
  return result.rows;
}

module.exports = {
  create,
  findByWallet,
  findByTxHash,
  updateStatus,
  updateFromBlockchain,
  updateUsdValue,
  findPending,
  findConfirmedWithoutUsd,
  getSummary,
  findByOrgAddress,
};
