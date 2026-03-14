-- Add TRON blockchain support
INSERT INTO org_blockchain_addresses (org_id, blockchain, network, address)
SELECT id, 'tron', 'mainnet', 'TJZ891dXs3n1agJBwNBZBvTEqLxfikFDSm'
FROM organizations WHERE name = 'Chabad'
ON CONFLICT DO NOTHING;
