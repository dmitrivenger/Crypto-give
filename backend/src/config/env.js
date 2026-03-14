require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cryptogive_dev',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY || '',
  ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
  POLYGON_RPC_URL: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY || '',
  ETHEREUM_CONFIRMATIONS_REQUIRED: parseInt(process.env.ETHEREUM_CONFIRMATIONS_REQUIRED || '12', 10),
  POLYGON_CONFIRMATIONS_REQUIRED: parseInt(process.env.POLYGON_CONFIRMATIONS_REQUIRED || '128', 10),
  BLOCKCHAIN_POLL_INTERVAL_MS: parseInt(process.env.BLOCKCHAIN_POLL_INTERVAL_MS || '30000', 10),
};
