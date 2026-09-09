// User Controller - Business logic for users
const User = require('../models/User');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, country, dateOfBirth } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, phone, country, dateOfBirth },
      { new: true }
    ).select('-password');

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get wallet balance
const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      success: true,
      wallet: user.wallet,
      totalBets: user.totalBets,
      winningBets: user.winningBets,
      totalWinnings: user.totalWinnings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add funds to wallet
const addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const user = await User.findById(req.userId);
    user.wallet.balance += amount;
    user.wallet.totalDeposited += amount;
    await user.save();

    res.json({
      success: true,
      message: 'Funds added successfully',
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Withdraw funds
const withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (amount > user.wallet.balance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    user.wallet.balance -= amount;
    await user.save();

    res.json({
      success: true,
      message: 'Withdrawal successful',
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const stats = {
      totalBets: user.totalBets,
      winningBets: user.winningBets,
      losingBets: user.totalBets - user.winningBets,
      winRate: user.totalBets > 0 ? ((user.winningBets / user.totalBets) * 100).toFixed(2) : 0,
      totalWinnings: user.totalWinnings,
      currentBalance: user.wallet.balance
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getWallet,
  addFunds,
  withdrawFunds,
  getUserStats
};
