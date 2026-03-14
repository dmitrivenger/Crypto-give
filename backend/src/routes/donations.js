const express = require('express');
const router = express.Router();
const { initiateDonation, confirmDonation, getDonations } = require('../controllers/DonationController');
const { requireWallet } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { donations: donationRateLimit, general } = require('../middleware/rateLimiter');

router.post('/initiate', requireWallet, donationRateLimit, validate('initiateDonation'), initiateDonation);
router.post('/confirm', requireWallet, donationRateLimit, validate('confirmDonation'), confirmDonation);
router.get('/:walletAddress', general, getDonations);

module.exports = router;
