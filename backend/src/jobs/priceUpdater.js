const cron = require('node-cron');
const BlockchainMonitorService = require('../services/BlockchainMonitorService');
const logger = require('../utils/logger');

function start() {
  // Run daily at 2 AM to backfill missing USD values
  cron.schedule('0 2 * * *', async () => {
    logger.info('Running daily price updater job');
    try {
      await BlockchainMonitorService.updateMissingUsdValues();
    } catch (err) {
      logger.error('Daily price updater job error:', err);
    }
  });

  logger.info('Price updater job scheduled (daily at 2 AM)');
}

module.exports = { start };
