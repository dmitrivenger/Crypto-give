CREATE TABLE IF NOT EXISTS org_blockchain_addresses (
    id SERIAL PRIMARY KEY,
    org_id INTEGER NOT NULL REFERENCES organizations(id),
    blockchain VARCHAR(50) NOT NULL,
    network VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_org_address UNIQUE (address),
    CONSTRAINT unique_org_blockchain_network UNIQUE (org_id, blockchain, network)
);

CREATE INDEX IF NOT EXISTS idx_org_blockchain_addresses_blockchain ON org_blockchain_addresses(blockchain);
CREATE INDEX IF NOT EXISTS idx_org_blockchain_addresses_address ON org_blockchain_addresses(address);

INSERT INTO org_blockchain_addresses (org_id, blockchain, network, address)
SELECT id, 'ethereum', 'mainnet', '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
FROM organizations WHERE name = 'Chabad'
ON CONFLICT DO NOTHING;

INSERT INTO org_blockchain_addresses (org_id, blockchain, network, address)
SELECT id, 'polygon', 'mainnet', '0x853d35Cc6634C0532925a3b844Bc2e7595f98a1a'
FROM organizations WHERE name = 'Chabad'
ON CONFLICT DO NOTHING;
