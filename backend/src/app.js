require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { extractWallet } = require('./middleware/auth');
const { general: generalRateLimit } = require('./middleware/rateLimiter');

// Routes
const organizationRoutes = require('./routes/organizations');
const donationRoutes = require('./routes/donations');
const taxReportRoutes = require('./routes/taxReports');
const healthRoutes = require('./routes/health');
const cryptoPriceRoutes = require('./routes/cryptoPrices');
const userRoutes = require('./routes/users');

// Jobs
const blockchainMonitorJob = require('./jobs/blockchainMonitor');
const priceUpdaterJob = require('./jobs/priceUpdater');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Wallet-Address'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(generalRateLimit);

// Extract wallet address from all requests
app.use(extractWallet);

// Request logging
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url}`, {
    wallet: req.walletAddress,
    ip: req.ip,
  });
  next();
});

// Routes
app.use('/v1/organizations', organizationRoutes);
app.use('/v1/donations', donationRoutes);
app.use('/v1/tax-report', taxReportRoutes);
app.use('/v1/health', healthRoutes);
app.use('/v1/crypto-price', cryptoPriceRoutes);
app.use('/v1/users', userRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start background jobs
blockchainMonitorJob.start();
priceUpdaterJob.start();

// Start server
const PORT = env.PORT;
const server = app.listen(PORT, () => {
  logger.info(`CryptoGive API running on port ${PORT} (${env.NODE_ENV})`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection:', reason);
});

module.exports = app;
