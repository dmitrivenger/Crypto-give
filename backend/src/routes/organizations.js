const express = require('express');
const router = express.Router();
const { getOrganizations, getOrganizationById } = require('../controllers/OrganizationController');
const { organizations: orgRateLimit } = require('../middleware/rateLimiter');

router.get('/', orgRateLimit, getOrganizations);
router.get('/:id', orgRateLimit, getOrganizationById);

module.exports = router;
