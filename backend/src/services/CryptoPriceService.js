const axios = require('axios');
const CryptoPrice = require('../models/CryptoPrice');
const { formatDateForCoinGecko, formatDateToISO } = require('../utils/priceUtils');
const logger = require('../utils/logger');

const COINGECKO_IDS = {
  ETH: 'ethereum',
  BTC: 'bitcoin',
  USDC: 'usd-coin',
  MATIC: 'matic-network',
  USDT: 'tether',
};

async function getPriceAtDate(token, date) {
  const tokenUpper = token.toUpperCase();
  const dateStr = typeof date === 'string' ? date : formatDateToISO(date);

  // Check cache first
  const cached = await CryptoPrice.findByTokenAndDate(tokenUpper, dateStr);
  if (cached) {
    logger.debug(`Cache hit for ${tokenUpper} on ${dateStr}: $${cached.price_usd}`);
    return parseFloat(cached.price_usd);
  }

  // USDC is always ~$1
  if (tokenUpper === 'USDC' || tokenUpper === 'USDT') {
    await CryptoPrice.upsert(tokenUpper, dateStr, 1.0, 'hardcoded');
    return 1.0;
  }

  const coingeckoId = COINGECKO_IDS[tokenUpper];
  if (!coingeckoId) {
    throw new Error(`Unsupported token for price lookup: ${tokenUpper}`);
  }

  const cgDate = formatDateForCoinGecko(new Date(dateStr));
  const url = `https://api.coingecko.com/api/v3/coins/${coingeckoId}/history?date=${cgDate}&localization=false`;

  try {
    logger.info(`Fetching CoinGecko price for ${tokenUpper} on ${cgDate}`);
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { Accept: 'application/json' },
    });

    const price = response.data?.market_data?.current_price?.usd;
    if (!price) throw new Error('Price not found in CoinGecko response');

    await CryptoPrice.upsert(tokenUpper, dateStr, price, 'coingecko');
    logger.info(`Cached ${tokenUpper} price on ${dateStr}: $${price}`);
    return price;
  } catch (err) {
    logger.error(`CoinGecko price fetch failed for ${tokenUpper}: ${err.message}`);
    // Return null rather than throwing — caller can handle missing price
    return null;
  }
}

async function getCurrentPrice(token) {
  const tokenUpper = token.toUpperCase();
  if (tokenUpper === 'USDC' || tokenUpper === 'USDT') return 1.0;

  const coingeckoId = COINGECKO_IDS[tokenUpper];
  if (!coingeckoId) return null;

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
      { timeout: 8000 }
    );
    return response.data?.[coingeckoId]?.usd || null;
  } catch (err) {
    logger.error(`Failed to fetch current price for ${tokenUpper}: ${err.message}`);
    return null;
  }
}

module.exports = { getPriceAtDate, getCurrentPrice };
