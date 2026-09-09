// Bet Model - Represents a user's bet on a game
const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  
  // Bet Details
  betType: {
    type: String,
    enum: ['win', 'draw', 'lose', 'over', 'under', 'handicap', 'both_score'],
    required: true
  },
  // Example: 'win' means home team wins, 'lose' means away team wins
  
  prediction: {
    type: String,
    enum: ['homeWin', 'draw', 'awayWin'],
    required: true
  },
  
  // Amount
  stake: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Odds at time of bet
  oddsAtTime: {
    type: Number,
    required: true
  },
  
  // Potential winnings
  potentialWinnings: {
    type: Number
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'won', 'lost', 'voided', 'cancelled'],
    default: 'pending'
  },
  
  // Actual winnings (if won)
  actualWinnings: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  placedAt: {
    type: Date,
    default: Date.now
  },
  settledAt: Date,
  
  // Notes
  notes: String
});

module.exports = mongoose.model('Bet', betSchema);
