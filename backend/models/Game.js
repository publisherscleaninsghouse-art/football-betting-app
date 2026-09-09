// Game Model - Represents a football game in the database
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Teams
  homeTeam: {
    name: String,
    logo: String,
    id: String
  },
  awayTeam: {
    name: String,
    logo: String,
    id: String
  },
  
  // Match Details
  league: String,
  season: Number,
  matchday: Number,
  
  // Date and Time
  kickOffTime: {
    type: Date,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'live', 'finished', 'postponed', 'cancelled'],
    default: 'scheduled'
  },
  
  // Score
  score: {
    homeTeam: {
      type: Number,
      default: 0
    },
    awayTeam: {
      type: Number,
      default: 0
    }
  },
  
  // Full Time Score
  fullTimeScore: {
    homeTeam: Number,
    awayTeam: Number
  },
  
  // Half Time Score
  halfTimeScore: {
    homeTeam: Number,
    awayTeam: Number
  },
  
  // Odds (for betting)
  odds: {
    homeWin: Number,    // 1.85
    draw: Number,       // 3.20
    awayWin: Number     // 4.50
  },
  
  // Stadium & Attendance
  stadium: String,
  attendance: Number,
  
  // Statistics
  statistics: {
    homeTeamShots: Number,
    awayTeamShots: Number,
    homeTeamPossession: Number,
    awayTeamPossession: Number
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema);
