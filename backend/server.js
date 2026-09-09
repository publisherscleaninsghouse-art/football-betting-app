const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const socketIO = require('socket.io');
const http = require('http');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Connect to Database
connectDB();

// Import Routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const betRoutes = require('./routes/bets');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Backend is running successfully!' });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);

  // Join game room for live updates
  socket.on('join_game', (gameId) => {
    socket.join(`game_${gameId}`);
    console.log(`User joined game: ${gameId}`);
  });

  // Listen for live score updates
  socket.on('game_update', (data) => {
    io.to(`game_${data.gameId}`).emit('score_updated', data);
  });

  // Bet placed notification
  socket.on('bet_placed', (data) => {
    socket.broadcast.emit('new_bet', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// 404 Error Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Test the server: http://localhost:${PORT}/api/test`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

module.exports = { app, io };
