const { EXPLORER_URLS } = require('../config/blockchain');

function getExplorerUrl(blockchain, txHash) {
  const base = EXPLORER_URLS[blockchain];
  if (!base) return null;
  return `${base}/tx/${txHash}`;
}

function getAddressExplorerUrl(blockchain, address) {
  const base = EXPLORER_URLS[blockchain];
  if (!base) return null;
  return `${base}/address/${address}`;
}

function normalizeAddress(address) {
  if (!address) return null;
  return address.toLowerCase();
}

function formatWeiToEther(weiAmount, decimals = 18) {
  const divisor = BigInt(10 ** decimals);
  const whole = BigInt(weiAmount) / divisor;
  const remainder = BigInt(weiAmount) % divisor;
  if (remainder === 0n) return whole.toString();
  const remStr = remainder.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${whole}.${remStr}`;
}

module.exports = {
  getExplorerUrl,
  getAddressExplorerUrl,
  normalizeAddress,
  formatWeiToEther,
};
