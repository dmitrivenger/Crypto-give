CREATE TABLE IF NOT EXISTS crypto_prices (
    id SERIAL PRIMARY KEY,
    token VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    price_usd NUMERIC(20, 2) NOT NULL,
    source VARCHAR(50) DEFAULT 'coingecko',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_token_date UNIQUE (token, date)
);

CREATE INDEX IF NOT EXISTS idx_crypto_prices_token_date ON crypto_prices(token, date);
CREATE INDEX IF NOT EXISTS idx_crypto_prices_date ON crypto_prices(date);
