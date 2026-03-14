export const SUPPORTED_TOKENS = ['ETH', 'USDC', 'USDT', 'POL', 'BNB']

export const TOKENS_BY_BLOCKCHAIN = {
  ethereum: ['ETH', 'USDC', 'USDT'],
  polygon: ['POL', 'USDC', 'USDT'],
  bsc: ['BNB', 'USDT', 'USDC'],
}

export const SUPPORTED_BLOCKCHAINS = ['ethereum', 'polygon', 'bsc']

export const BLOCKCHAIN_EXPLORERS = {
  ethereum: 'https://etherscan.io',
  polygon: 'https://polygonscan.com',
  bsc: 'https://bscscan.com',
}

export const BLOCKCHAIN_LABELS = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  bsc: 'BNB Chain',
}

// All supported blockchains are EVM
export const EVM_BLOCKCHAINS = ['ethereum', 'polygon', 'bsc']

export const TOKEN_DECIMALS = {
  ETH: 18,
  USDC: 6,
  USDT: 6,
  POL: 18,
  BNB: 18,
}

export const MIN_DONATION_USD = 1

export const DONATION_EXPIRY_MINUTES = 60
