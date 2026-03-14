-- Drop the overly strict unique constraint on address alone
-- (same EVM address can exist on multiple chains)
ALTER TABLE org_blockchain_addresses DROP CONSTRAINT IF EXISTS unique_org_address;

-- Add BNB Chain address for Chabad (same EVM address works across all EVM chains)
INSERT INTO org_blockchain_addresses (org_id, blockchain, network, address)
SELECT id, 'bsc', 'mainnet', '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
FROM organizations WHERE name = 'Chabad'
ON CONFLICT ON CONSTRAINT unique_org_blockchain_network DO NOTHING;
