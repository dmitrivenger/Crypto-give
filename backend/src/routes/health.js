const express = require('express');
const router = express.Router();
const { checkConnection } = require('../config/database');
const { getProvider } = require('../config/blockchain');

router.get('/', async (req, res) => {
  const dbOk = await checkConnection();

  let blockchainStatus = 'unknown';
  try {
    await getProvider('ethereum').getBlockNumber();
    blockchainStatus = 'connected';
  } catch {
    blockchainStatus = 'disconnected';
  }

  const status = dbOk ? 'ok' : 'degraded';
  res.status(dbOk ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    database: dbOk ? 'connected' : 'disconnected',
    blockchain: blockchainStatus,
    uptime: process.uptime(),
  });
});

module.exports = router;
