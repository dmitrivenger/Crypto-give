CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    country VARCHAR(2),
    city VARCHAR(255),
    tax_id VARCHAR(50) NOT NULL,
    tax_id_country VARCHAR(2),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_organizations_active ON organizations(active);

INSERT INTO organizations (name, description, country, tax_id, tax_id_country, website_url)
VALUES ('Chabad', 'Jewish educational and outreach organization', 'US', '11-1671182', 'US', 'https://chabad.org')
ON CONFLICT (name) DO NOTHING;
