function isValidWalletAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

function isValidTxHash(hash) {
  return /^0x[0-9a-fA-F]{64}$/.test(hash);
}

function isValidAmount(amount) {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
}

function isValidDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr));
}

function isValidBlockchain(blockchain) {
  return ['ethereum', 'polygon'].includes(blockchain);
}

function isValidYear(year) {
  const y = parseInt(year, 10);
  return !isNaN(y) && y >= 2020 && y <= 2100;
}

module.exports = {
  isValidWalletAddress,
  isValidTxHash,
  isValidAmount,
  isValidDate,
  isValidBlockchain,
  isValidYear,
};
