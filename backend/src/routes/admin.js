const express = require('express');
const router = express.Router();
const { getOverview, getStatsByOrg, getStatsByAddress, getAllDonations, generateAdminCSV } = require('../services/AdminService');
const logger = require('../utils/logger');

// Simple admin key middleware
function requireAdminKey(req, res, next) {
  const adminKey = process.env.ADMIN_KEY;
  const provided = req.headers['x-admin-key'] || req.query.key;
  if (!adminKey || provided !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

router.use(requireAdminKey);

// GET /v1/admin/stats?year=2025&month=3&day=15
router.get('/stats', async (req, res) => {
  try {
    const period = {
      year:  req.query.year,
      month: req.query.month,
      day:   req.query.day,
    };
    const [overview, byOrg, byAddress] = await Promise.all([
      getOverview(period),
      getStatsByOrg(period),
      getStatsByAddress(period),
    ]);
    res.json({ overview, byOrg, byAddress });
  } catch (err) {
    logger.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

// GET /v1/admin/report?year=2025&month=3&day=15&format=csv
router.get('/report', async (req, res) => {
  try {
    const period = {
      year:  req.query.year,
      month: req.query.month,
      day:   req.query.day,
    };
    const [overview, byOrg, byAddress, donations] = await Promise.all([
      getOverview(period),
      getStatsByOrg(period),
      getStatsByAddress(period),
      getAllDonations(period),
    ]);
    const csv = generateAdminCSV(overview, byOrg, byAddress, donations);
    const filename = `cryptogive-admin-report-${Date.now()}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    logger.error('Admin report error:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;
