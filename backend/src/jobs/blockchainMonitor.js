const cron = require('node-cron');
const BlockchainMonitorService = require('../services/BlockchainMonitorService');
const logger = require('../utils/logger');

let isRunning = false;

function start() {
  // Check pending donations every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    if (isRunning) return;
    isRunning = true;
    try {
      await BlockchainMonitorService.checkPendingDonations();
    } catch (err) {
      logger.error('Blockchain monitor job error:', err);
    } finally {
      isRunning = false;
    }
  });

  // Update missing USD values every hour
  cron.schedule('0 * * * *', async () => {
    try {
      await BlockchainMonitorService.updateMissingUsdValues();
    } catch (err) {
      logger.error('USD value updater job error:', err);
    }
  });

  logger.info('Blockchain monitor jobs started');
}

module.exports = { start };
