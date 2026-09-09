// Users Routes
const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getWallet,
  addFunds,
  withdrawFunds,
  getUserStats
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// All user routes require authentication
router.use(authMiddleware);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/wallet/balance', getWallet);
router.post('/wallet/add-funds', addFunds);
router.post('/wallet/withdraw', withdrawFunds);
router.get('/stats', getUserStats);

module.exports = router;
