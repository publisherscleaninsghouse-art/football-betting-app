import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <div className="balance-display">
          <h3>Balance: ${user?.wallet?.balance}</h3>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'betting' ? 'active' : ''}
          onClick={() => setActiveTab('betting')}
        >
          Place Bet
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Bet History
        </button>
        <button 
          className={activeTab === 'wallet' ? 'active' : ''}
          onClick={() => setActiveTab('wallet')}
        >
          Wallet
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview">
            <h2>Your Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Bets</h3>
                <p>{stats?.totalBets || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Winning Bets</h3>
                <p>{stats?.winningBets || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Win Rate</h3>
                <p>{stats?.winRate || 0}%</p>
              </div>
              <div className="stat-card">
                <h3>Total Winnings</h3>
                <p>${stats?.totalWinnings || 0}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'betting' && (
          <div className="betting-section">
            <h2>Available Games</h2>
            <p>Games list will be displayed here</p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h2>Betting History</h2>
            <p>Your bets will appear here</p>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="wallet-section">
            <h2>Wallet Management</h2>
            <p>Add funds or withdraw here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
