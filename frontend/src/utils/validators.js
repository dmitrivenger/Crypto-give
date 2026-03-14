export function isValidWalletAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

export function isValidTxHash(hash) {
  return /^0x[0-9a-fA-F]{64}$/.test(hash)
}

export function isValidAmount(amount) {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}
