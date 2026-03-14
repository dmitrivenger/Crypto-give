import { BLOCKCHAIN_EXPLORERS } from './constants'

export function formatAddress(address) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatAmount(amount, token) {
  const num = parseFloat(amount)
  if (isNaN(num)) return `0 ${token}`
  const decimals = token === 'USDC' || token === 'USDT' ? 2 : 6
  return `${num.toFixed(decimals).replace(/\.?0+$/, '')} ${token}`
}

export function formatUSD(amount) {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(amount))
}

export function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTxHash(hash) {
  if (!hash) return ''
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`
}

export function getTxLink(blockchain, txHash) {
  const base = BLOCKCHAIN_EXPLORERS[blockchain]
  if (!base || !txHash) return null
  return `${base}/tx/${txHash}`
}
