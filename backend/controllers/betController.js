// Bet Controller - Business logic for betting
const Bet = require('../models/Bet');
const Game = require('../models/Game');
const User = require('../models/User');

// Place a bet
const placeBet = async (req, res) => {
  try {
    const { gameId, prediction, stake, oddsAtTime } = req.body;
    const userId = req.userId;

    // Validate input
    if (!gameId || !prediction || !stake) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user has enough balance
    const user = await User.findById(userId);
    if (user.wallet.balance < stake) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Verify game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Create bet
    const bet = new Bet({
      userId,
      gameId,
      prediction,
      stake,
      oddsAtTime,
      betType: prediction,
      potentialWinnings: stake * oddsAtTime,
      status: 'pending'
    });

    await bet.save();

    // Deduct from user wallet
    user.wallet.balance -= stake;
    user.totalBets += 1;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Bet placed successfully',
      data: bet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bet history
const getBetHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, limit = 50, skip = 0 } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const bets = await Bet.find(query)
      .populate('gameId')
      .sort({ placedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Bet.countDocuments(query);

    res.json({
      success: true,
      count: bets.length,
      total,
      data: bets
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single bet
const getBetById = async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id).populate('gameId');
    if (!bet) {
      return res.status(404).json({ error: 'Bet not found' });
    }
    res.json({ success: true, data: bet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Settle bet (when game finishes)
const settleBet = async (req, res) => {
  try {
    const { betId, gameResult } = req.body;

    const bet = await Bet.findById(betId);
    const game = await Game.findById(bet.gameId);
    const user = await User.findById(bet.userId);

    let result = 'lost';

    // Determine bet result
    if (gameResult === bet.prediction) {
      result = 'won';
      const winnings = bet.stake * bet.oddsAtTime;
      user.wallet.balance += winnings;
      user.winningBets += 1;
      user.totalWinnings += winnings;
      bet.actualWinnings = winnings;
    }

    bet.status = result;
    bet.settledAt = new Date();
    await bet.save();
    await user.save();

    res.json({
      success: true,
      message: `Bet ${result}`,
      data: bet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pending bets
const getPendingBets = async (req, res) => {
  try {
    const bets = await Bet.find({ userId: req.userId, status: 'pending' })
      .populate('gameId')
      .sort({ placedAt: -1 });

    res.json({
      success: true,
      count: bets.length,
      data: bets
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  placeBet,
  getBetHistory,
  getBetById,
  settleBet,
  getPendingBets
};
