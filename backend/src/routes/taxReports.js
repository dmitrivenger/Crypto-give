const express = require('express');
const router = express.Router();
const { getTaxReport } = require('../controllers/TaxReportController');
const { taxReports: taxReportRateLimit } = require('../middleware/rateLimiter');

router.get('/:walletAddress', taxReportRateLimit, getTaxReport);

module.exports = router;
