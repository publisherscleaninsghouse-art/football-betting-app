// Games Routes
const express = require('express');
const router = express.Router();
const {
  getAllGames,
  getGameById,
  getLiveGames,
  getGamesByDate,
  createGame,
  updateGameScore
} = require('../controllers/gameController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', getAllGames);
router.get('/live', getLiveGames);
router.get('/date', getGamesByDate);
router.get('/:id', getGameById);

// Protected routes (Admin only)
router.post('/', authMiddleware, createGame);
router.put('/:id/score', authMiddleware, updateGameScore);

module.exports = router;
