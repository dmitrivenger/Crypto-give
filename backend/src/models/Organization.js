const { query } = require('../config/database');

async function findAll() {
  const orgsResult = await query(
    `SELECT o.*,
      json_agg(
        json_build_object(
          'blockchain', oba.blockchain,
          'network', oba.network,
          'address', oba.address
        ) ORDER BY oba.blockchain
      ) FILTER (WHERE oba.id IS NOT NULL) AS blockchain_addresses
     FROM organizations o
     LEFT JOIN org_blockchain_addresses oba ON oba.org_id = o.id AND oba.is_active = true
     WHERE o.active = true
     GROUP BY o.id
     ORDER BY o.name`
  );
  return orgsResult.rows;
}

async function findById(id) {
  const result = await query(
    `SELECT o.*,
      json_agg(
        json_build_object(
          'blockchain', oba.blockchain,
          'network', oba.network,
          'address', oba.address
        ) ORDER BY oba.blockchain
      ) FILTER (WHERE oba.id IS NOT NULL) AS blockchain_addresses
     FROM organizations o
     LEFT JOIN org_blockchain_addresses oba ON oba.org_id = o.id AND oba.is_active = true
     WHERE o.id = $1 AND o.active = true
     GROUP BY o.id`,
    [id]
  );
  return result.rows[0] || null;
}

async function findByBlockchainAddress(address, blockchain) {
  const result = await query(
    `SELECT o.* FROM organizations o
     JOIN org_blockchain_addresses oba ON oba.org_id = o.id
     WHERE LOWER(oba.address) = LOWER($1) AND oba.blockchain = $2 AND oba.is_active = true AND o.active = true
     LIMIT 1`,
    [address, blockchain]
  );
  return result.rows[0] || null;
}

async function getAllActiveAddresses() {
  const result = await query(
    `SELECT oba.*, o.name as org_name, o.tax_id
     FROM org_blockchain_addresses oba
     JOIN organizations o ON o.id = oba.org_id
     WHERE oba.is_active = true AND o.active = true`
  );
  return result.rows;
}

module.exports = { findAll, findById, findByBlockchainAddress, getAllActiveAddresses };
