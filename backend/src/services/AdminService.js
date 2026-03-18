const { query } = require('../config/database');

function buildDateFilter(period, idx) {
  if (!period) return { clause: '', params: [], nextIdx: idx };
  const params = [];
  let clause = '';

  if (period.year) {
    clause += ` AND EXTRACT(YEAR FROM d.created_at) = $${idx++}`;
    params.push(parseInt(period.year));
  }
  if (period.month) {
    clause += ` AND EXTRACT(MONTH FROM d.created_at) = $${idx++}`;
    params.push(parseInt(period.month));
  }
  if (period.day) {
    clause += ` AND EXTRACT(DAY FROM d.created_at) = $${idx++}`;
    params.push(parseInt(period.day));
  }

  return { clause, params, nextIdx: idx };
}

async function getOverview(period = {}) {
  const { clause, params } = buildDateFilter(period, 1);

  const result = await query(
    `SELECT
       COUNT(*)                        AS total_count,
       COUNT(DISTINCT donor_wallet_address) AS unique_donors,
       COALESCE(SUM(amount_usd), 0)   AS total_usd
     FROM donations d
     WHERE d.tx_status = 'confirmed'${clause}`,
    params
  );
  return result.rows[0];
}

async function getStatsByOrg(period = {}) {
  const { clause, params } = buildDateFilter(period, 1);

  const result = await query(
    `SELECT
       o.id            AS org_id,
       o.name          AS org_name,
       o.tax_id        AS org_tax_id,
       COUNT(d.id)     AS donation_count,
       COALESCE(SUM(d.amount_usd), 0) AS total_usd
     FROM donations d
     JOIN organizations o ON o.id = d.org_id
     WHERE d.tx_status = 'confirmed'${clause}
     GROUP BY o.id, o.name, o.tax_id
     ORDER BY total_usd DESC`,
    params
  );
  return result.rows;
}

async function getStatsByAddress(period = {}) {
  const { clause, params } = buildDateFilter(period, 1);

  const result = await query(
    `SELECT
       o.id            AS org_id,
       o.name          AS org_name,
       d.blockchain,
       d.token,
       d.to_address,
       COUNT(d.id)                    AS donation_count,
       SUM(d.amount)                  AS total_crypto,
       COALESCE(SUM(d.amount_usd), 0) AS total_usd
     FROM donations d
     JOIN organizations o ON o.id = d.org_id
     WHERE d.tx_status = 'confirmed'${clause}
     GROUP BY o.id, o.name, d.blockchain, d.token, d.to_address
     ORDER BY o.name, total_usd DESC`,
    params
  );
  return result.rows;
}

async function getAllDonations(period = {}) {
  const { clause, params } = buildDateFilter(period, 1);

  const result = await query(
    `SELECT
       d.id, d.created_at, d.tx_hash, d.from_address, d.to_address,
       d.blockchain, d.token, d.amount, d.amount_usd,
       d.tx_status, d.donor_wallet_address,
       o.name AS org_name, o.tax_id AS org_tax_id
     FROM donations d
     JOIN organizations o ON o.id = d.org_id
     WHERE d.tx_status = 'confirmed'${clause}
     ORDER BY d.created_at DESC`,
    params
  );
  return result.rows;
}

function generateAdminCSV(overview, byOrg, byAddress, donations) {
  const lines = [
    '# CryptoGive Admin Report',
    `# Generated: ${new Date().toISOString()}`,
    '',
    '## OVERVIEW',
    `Total Donations,${overview.total_count}`,
    `Unique Donors,${overview.unique_donors}`,
    `Total USD,${parseFloat(overview.total_usd).toFixed(2)}`,
    '',
    '## BY ORGANIZATION',
    'Organization,Tax ID,Donations,Total USD',
    ...byOrg.map(r =>
      `"${r.org_name}",${r.org_tax_id},${r.donation_count},${parseFloat(r.total_usd).toFixed(2)}`
    ),
    '',
    '## BY CRYPTO ADDRESS',
    'Organization,Blockchain,Token,Address,Donations,Total Crypto,Total USD',
    ...byAddress.map(r =>
      `"${r.org_name}",${r.blockchain},${r.token},${r.to_address},${r.donation_count},${parseFloat(r.total_crypto).toFixed(8)},${parseFloat(r.total_usd).toFixed(2)}`
    ),
    '',
    '## ALL TRANSACTIONS',
    'Date,Organization,Blockchain,Token,Amount,USD,TX Hash,From,To,Status',
    ...donations.map(d =>
      `"${new Date(d.created_at).toISOString()}","${d.org_name}",${d.blockchain},${d.token},${parseFloat(d.amount).toFixed(8)},${d.amount_usd ? parseFloat(d.amount_usd).toFixed(2) : ''},${d.tx_hash},${d.from_address || ''},${d.to_address},${d.tx_status}`
    ),
  ];
  return lines.join('\n');
}

module.exports = { getOverview, getStatsByOrg, getStatsByAddress, getAllDonations, generateAdminCSV };
