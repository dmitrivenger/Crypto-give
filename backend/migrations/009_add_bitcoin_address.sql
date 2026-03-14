-- Add Bitcoin address for Chabad
-- Replace with your real BTC receiving address before going live
INSERT INTO org_blockchain_addresses (org_id, blockchain, network, address)
SELECT id, 'bitcoin', 'mainnet', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
FROM organizations WHERE name = 'Chabad'
ON CONFLICT ON CONSTRAINT unique_org_blockchain_network DO NOTHING;
