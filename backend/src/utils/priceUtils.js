function formatUSD(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function calculateUsdValue(cryptoAmount, priceUsd) {
  const amount = parseFloat(cryptoAmount);
  const price = parseFloat(priceUsd);
  if (isNaN(amount) || isNaN(price)) return null;
  return Math.round(amount * price * 100) / 100;
}

function formatDateForCoinGecko(date) {
  // CoinGecko expects DD-MM-YYYY
  const d = date instanceof Date ? date : new Date(date);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function formatDateToISO(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

module.exports = {
  formatUSD,
  calculateUsdValue,
  formatDateForCoinGecko,
  formatDateToISO,
};
