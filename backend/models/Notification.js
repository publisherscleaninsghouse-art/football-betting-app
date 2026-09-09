// Notifications Model
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['bet_placed', 'bet_won', 'bet_lost', 'payment_success', 'game_update'],
    required: true
  },
  title: String,
  message: String,
  data: mongoose.Schema.Types.Mixed, // Additional data
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
