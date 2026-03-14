CREATE TABLE IF NOT EXISTS tax_reports (
    id SERIAL PRIMARY KEY,
    donor_wallet_address VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    total_donations_usd NUMERIC(20, 2) NOT NULL,
    total_donations_count INTEGER NOT NULL,
    pdf_file_path VARCHAR(500),
    pdf_generated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_wallet_year UNIQUE (donor_wallet_address, year)
);

CREATE INDEX IF NOT EXISTS idx_tax_reports_donor_wallet ON tax_reports(donor_wallet_address);
CREATE INDEX IF NOT EXISTS idx_tax_reports_year ON tax_reports(year);
