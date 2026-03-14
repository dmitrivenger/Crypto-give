const { ethers } = require('ethers');
const env = require('./env');

const PROVIDERS = {
  ethereum: new ethers.JsonRpcProvider(env.ETHEREUM_RPC_URL),
  polygon: new ethers.JsonRpcProvider(env.POLYGON_RPC_URL),
  bsc: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/'),
};

const SUPPORTED_TOKENS = {
  ethereum: {
    ETH:  { symbol: 'ETH',  decimals: 18, isNative: true,  coingeckoId: 'ethereum' },
    USDC: { symbol: 'USDC', decimals: 6,  isNative: false, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', coingeckoId: 'usd-coin' },
    USDT: { symbol: 'USDT', decimals: 6,  isNative: false, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', coingeckoId: 'tether' },
  },
  polygon: {
    POL:  { symbol: 'POL',  decimals: 18, isNative: true,  coingeckoId: 'matic-network' },
    USDC: { symbol: 'USDC', decimals: 6,  isNative: false, address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', coingeckoId: 'usd-coin' },
    USDT: { symbol: 'USDT', decimals: 6,  isNative: false, address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', coingeckoId: 'tether' },
  },
  bsc: {
    BNB:  { symbol: 'BNB',  decimals: 18, isNative: true,  coingeckoId: 'binancecoin' },
    USDT: { symbol: 'USDT', decimals: 18, isNative: false, address: '0x55d398326f99059fF775485246999027B3197955', coingeckoId: 'tether' },
    USDC: { symbol: 'USDC', decimals: 18, isNative: false, address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', coingeckoId: 'usd-coin' },
  },
  tron: {
    TRX:  { symbol: 'TRX',  decimals: 6, isNative: true,  coingeckoId: 'tron' },
    USDT: { symbol: 'USDT', decimals: 6, isNative: false, address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', coingeckoId: 'tether' },
  },
};

const EXPLORER_URLS = {
  ethereum: 'https://etherscan.io',
  polygon:  'https://polygonscan.com',
  bsc:      'https://bscscan.com',
  bitcoin:  'https://mempool.space/tx',
  tron:     'https://tronscan.org/#/transaction',
};

const CONFIRMATIONS_REQUIRED = {
  ethereum: env.ETHEREUM_CONFIRMATIONS_REQUIRED,
  polygon:  env.POLYGON_CONFIRMATIONS_REQUIRED,
  bsc:      15,
  tron:     20,
};

function getProvider(blockchain) {
  return PROVIDERS[blockchain] || null;
}

function getSupportedTokens(blockchain) {
  return SUPPORTED_TOKENS[blockchain] || {};
}

function getTokenConfig(blockchain, token) {
  return getSupportedTokens(blockchain)[token] || null;
}

function isTokenSupported(blockchain, token) {
  return !!getTokenConfig(blockchain, token);
}

module.exports = {
  PROVIDERS,
  SUPPORTED_TOKENS,
  EXPLORER_URLS,
  CONFIRMATIONS_REQUIRED,
  getProvider,
  getSupportedTokens,
  getTokenConfig,
  isTokenSupported,
};
