import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import './Games.css';

const Games = () => {
  const { token } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [filter, setFilter] = useState('all'); // all, live, scheduled

  useEffect(() => {
    // Fetch initial games
    const fetchGames = async () => {
      try {
        let url = 'http://localhost:5000/api/games';
        if (filter === 'live') {
          url = 'http://localhost:5000/api/games/live';
        }
        
        const response = await axios.get(url);
        setGames(response.data.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();

    // Connect to socket for live updates
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [filter]);

  const handlePlaceBet = (gameId) => {
    // Redirect to betting page
    window.location.href = `/bet/${gameId}`;
  };

  if (loading) return <div className="loading">Loading games...</div>;

  return (
    <div className="games-container">
      <header className="games-header">
        <h1>Football Games</h1>
        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Games
          </button>
          <button 
            className={filter === 'live' ? 'active' : ''}
            onClick={() => setFilter('live')}
          >
            Live Now
          </button>
          <button 
            className={filter === 'scheduled' ? 'active' : ''}
            onClick={() => setFilter('scheduled')}
          >
            Upcoming
          </button>
        </div>
      </header>

      <div className="games-list">
        {games.length === 0 ? (
          <p>No games available</p>
        ) : (
          games.map((game) => (
            <div key={game._id} className={`game-card ${game.status}`}>
              <div className="game-header">
                <span className="league">{game.league}</span>
                <span className={`status ${game.status}`}>{game.status}</span>
              </div>

              <div className="game-teams">
                <div className="team home-team">
                  <img src={game.homeTeam.logo} alt={game.homeTeam.name} />
                  <p>{game.homeTeam.name}</p>
                </div>

                <div className="game-score">
                  <span className="vs">VS</span>
                  {game.status === 'live' && (
                    <p className="live-score">
                      {game.score.homeTeam} - {game.score.awayTeam}
                    </p>
                  )}
                  {game.status !== 'live' && (
                    <p className="kick-off-time">{new Date(game.kickOffTime).toLocaleString()}</p>
                  )}
                </div>

                <div className="team away-team">
                  <img src={game.awayTeam.logo} alt={game.awayTeam.name} />
                  <p>{game.awayTeam.name}</p>
                </div>
              </div>

              <div className="game-odds">
                <div className="odd">
                  <p>{game.homeTeam.name}</p>
                  <span className="odds-value">{game.odds.homeWin}</span>
                </div>
                <div className="odd">
                  <p>Draw</p>
                  <span className="odds-value">{game.odds.draw}</span>
                </div>
                <div className="odd">
                  <p>{game.awayTeam.name}</p>
                  <span className="odds-value">{game.odds.awayWin}</span>
                </div>
              </div>

              <button 
                className="bet-button"
                onClick={() => handlePlaceBet(game._id)}
              >
                Place Bet
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Games;
