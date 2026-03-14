export const SUPPORTED_TOKENS = ['ETH', 'USDC', 'USDT', 'POL', 'BNB', 'BTC', 'TRX']

export const TOKENS_BY_BLOCKCHAIN = {
  ethereum: ['ETH', 'USDC', 'USDT'],
  polygon:  ['POL', 'USDC', 'USDT'],
  bsc:      ['BNB', 'USDT', 'USDC'],
  bitcoin:  ['BTC'],
  tron:     ['TRX', 'USDT'],
}

export const SUPPORTED_BLOCKCHAINS = ['ethereum', 'polygon', 'bsc', 'bitcoin', 'tron']

export const BLOCKCHAIN_LABELS = {
  ethereum: 'Ethereum',
  polygon:  'Polygon',
  bsc:      'BNB Chain',
  bitcoin:  'Bitcoin',
  tron:     'Tron',
}

export const BLOCKCHAIN_SYMBOLS = {
  ethereum: 'Ξ',
  polygon:  '⬡',
  bsc:      '◆',
  bitcoin:  '₿',
  tron:     '◎',
}

export const BLOCKCHAIN_COLORS = {
  ethereum: { bg: 'bg-indigo-50',  border: 'border-indigo-100',  text: 'text-indigo-600',  active: 'bg-indigo-600' },
  polygon:  { bg: 'bg-purple-50',  border: 'border-purple-100',  text: 'text-purple-600',  active: 'bg-purple-600' },
  bsc:      { bg: 'bg-yellow-50',  border: 'border-yellow-100',  text: 'text-yellow-600',  active: 'bg-yellow-500' },
  bitcoin:  { bg: 'bg-orange-50',  border: 'border-orange-100',  text: 'text-orange-500',  active: 'bg-orange-500' },
  tron:     { bg: 'bg-red-50',     border: 'border-red-100',     text: 'text-red-500',     active: 'bg-red-500' },
}

export const BLOCKCHAIN_EXPLORERS = {
  ethereum: 'https://etherscan.io/tx',
  polygon:  'https://polygonscan.com/tx',
  bsc:      'https://bscscan.com/tx',
  bitcoin:  'https://mempool.space/tx',
  tron:     'https://tronscan.org/#/transaction',
}

// EVM chains: handled by wagmi (automatic wallet signing)
export const EVM_BLOCKCHAINS = ['ethereum', 'polygon', 'bsc']

// Manual chains: user sends from their own wallet app
export const MANUAL_BLOCKCHAINS = ['bitcoin', 'tron']

export const TOKEN_DECIMALS = {
  ETH:  18,
  USDC: 6,
  USDT: 6,
  POL:  18,
  BNB:  18,
  BTC:  8,
  TRX:  6,
}
