// Game Controller - Business logic for games
const Game = require('../models/Game');
const axios = require('axios');

// Get all games
const getAllGames = async (req, res) => {
  try {
    const games = await Game.find()
      .sort({ kickOffTime: 1 })
      .limit(50);
    
    res.json({
      success: true,
      count: games.length,
      data: games
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get game by ID
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get live games
const getLiveGames = async (req, res) => {
  try {
    const liveGames = await Game.find({ status: 'live' });
    res.json({
      success: true,
      count: liveGames.length,
      data: liveGames
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get games by date
const getGamesByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const games = await Game.find({
      kickOffTime: { $gte: startDate, $lt: endDate }
    }).sort({ kickOffTime: 1 });

    res.json({
      success: true,
      count: games.length,
      data: games
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create game (Admin only)
const createGame = async (req, res) => {
  try {
    const { homeTeam, awayTeam, kickOffTime, league, odds } = req.body;

    const game = new Game({
      gameId: `${homeTeam.name}_vs_${awayTeam.name}_${Date.now()}`,
      homeTeam,
      awayTeam,
      kickOffTime,
      league,
      odds,
      status: 'scheduled'
    });

    await game.save();
    res.status(201).json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update game score (for live updates)
const updateGameScore = async (req, res) => {
  try {
    const { homeTeamScore, awayTeamScore, status } = req.body;
    
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      {
        'score.homeTeam': homeTeamScore,
        'score.awayTeam': awayTeamScore,
        status: status,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  getLiveGames,
  getGamesByDate,
  createGame,
  updateGameScore
};
