const { ethers } = require('ethers');
const env = require('./env');

const PROVIDERS = {
  ethereum: new ethers.JsonRpcProvider(env.ETHEREUM_RPC_URL),
  polygon: new ethers.JsonRpcProvider(env.POLYGON_RPC_URL),
};

const SUPPORTED_TOKENS = {
  ethereum: {
    ETH: { symbol: 'ETH', decimals: 18, isNative: true, coingeckoId: 'ethereum' },
    USDC: {
      symbol: 'USDC',
      decimals: 6,
      isNative: false,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      coingeckoId: 'usd-coin',
    },
  },
  polygon: {
    MATIC: { symbol: 'MATIC', decimals: 18, isNative: true, coingeckoId: 'matic-network' },
    USDC: {
      symbol: 'USDC',
      decimals: 6,
      isNative: false,
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      coingeckoId: 'usd-coin',
    },
  },
};

const EXPLORER_URLS = {
  ethereum: 'https://etherscan.io',
  polygon: 'https://polygonscan.com',
};

const CONFIRMATIONS_REQUIRED = {
  ethereum: env.ETHEREUM_CONFIRMATIONS_REQUIRED,
  polygon: env.POLYGON_CONFIRMATIONS_REQUIRED,
};

function getProvider(blockchain) {
  const provider = PROVIDERS[blockchain];
  if (!provider) throw new Error(`Unsupported blockchain: ${blockchain}`);
  return provider;
}

function getSupportedTokens(blockchain) {
  return SUPPORTED_TOKENS[blockchain] || {};
}

function getTokenConfig(blockchain, token) {
  const tokens = getSupportedTokens(blockchain);
  return tokens[token] || null;
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
