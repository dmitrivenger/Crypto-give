CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    donor_wallet_address VARCHAR(255) NOT NULL,
    org_id INTEGER NOT NULL REFERENCES organizations(id),
    blockchain VARCHAR(50) NOT NULL,
    token VARCHAR(50) NOT NULL,
    amount NUMERIC(30, 18) NOT NULL,
    amount_usd NUMERIC(20, 2),
    tx_hash VARCHAR(255) UNIQUE NOT NULL,
    from_address VARCHAR(255),
    to_address VARCHAR(255) NOT NULL,
    block_number BIGINT,
    tx_index INTEGER,
    gas_used NUMERIC(20, 0),
    tx_status VARCHAR(20) DEFAULT 'pending',
    confirmation_count INTEGER DEFAULT 0,
    price_checked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_donations_donor_wallet ON donations(donor_wallet_address);
CREATE INDEX IF NOT EXISTS idx_donations_org_id ON donations(org_id);
CREATE INDEX IF NOT EXISTS idx_donations_tx_hash ON donations(tx_hash);
CREATE INDEX IF NOT EXISTS idx_donations_blockchain ON donations(blockchain);
CREATE INDEX IF NOT EXISTS idx_donations_tx_status ON donations(tx_status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
