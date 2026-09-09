// Bets Routes
const express = require('express');
const router = express.Router();
const {
  placeBet,
  getBetHistory,
  getBetById,
  settleBet,
  getPendingBets
} = require('../controllers/betController');
const { authMiddleware } = require('../middleware/auth');

// All betting routes require authentication
router.use(authMiddleware);

router.post('/', placeBet);
router.get('/history', getBetHistory);
router.get('/pending', getPendingBets);
router.get('/:id', getBetById);
router.put('/:id/settle', settleBet);

module.exports = router;
