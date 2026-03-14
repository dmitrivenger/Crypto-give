const express = require('express');
const router = express.Router();
const { getUser, upsertUser, deleteUser } = require('../controllers/UserController');
const { general } = require('../middleware/rateLimiter');

router.get('/:walletAddress', general, getUser);
router.post('/:walletAddress', general, upsertUser);
router.delete('/:walletAddress', general, deleteUser);

module.exports = router;
