import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image
} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const LiveGameScreen = ({ route }) => {
  const { gameId } = route.params;
  const { token } = useContext(AuthContext);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('home');
  const [betAmount, setBetAmount] = useState('');
  const [showBettingPanel, setShowBettingPanel] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/games/${gameId}`);
        setGame(response.data.data);
      } catch (error) {
        console.error('Error fetching game:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();

    // Connect to socket for live updates
    const newSocket = io('http://localhost:5000');
    newSocket.emit('join_game', gameId);
    
    newSocket.on('score_updated', (data) => {
      setGame(prev => ({
        ...prev,
        score: data.score,
        status: data.status
      }));
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [gameId]);

  const handlePlaceBet = async () => {
    if (!betAmount) {
      alert('Please enter bet amount');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/bets',
        {
          gameId,
          prediction: selectedTeam === 'home' ? 'homeWin' : selectedTeam === 'away' ? 'awayWin' : 'draw',
          stake: parseFloat(betAmount),
          oddsAtTime: selectedTeam === 'home' ? game.odds.homeWin : selectedTeam === 'away' ? game.odds.awayWin : game.odds.draw
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Bet placed successfully!');
      setShowBettingPanel(false);
      setBetAmount('');
    } catch (error) {
      alert('Failed to place bet');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16c784" />
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.container}>
        <Text>Game not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Football Field */}
      <View style={styles.fieldContainer}>
        {/* Field Background */}
        <Image
          source={{ uri: 'https://via.placeholder.com/400x800/2ecc71/2ecc71' }}
          style={styles.fieldBackground}
        />
        
        {/* Field SVG Elements */}
        <View style={styles.field}>
          {/* Center Line */}
          <View style={styles.centerLine} />
          
          {/* Center Circle */}
          <View style={styles.centerCircle} />

          {/* Score Display */}
          <View style={styles.scoreBoard}>
            <View style={styles.teamScore}>
              <Text style={styles.teamNameScore}>{game.homeTeam.name}</Text>
              <Text style={styles.scoreText}>{game.score.homeTeam}</Text>
            </View>
            
            <View style={styles.timeDisplay}>
              <Text style={styles.timeText}>
                {game.status === 'live' ? "45'" : 'FT'}
              </Text>
            </View>
            
            <View style={styles.teamScore}>
              <Text style={styles.teamNameScore}>{game.awayTeam.name}</Text>
              <Text style={styles.scoreText}>{game.score.awayTeam}</Text>
            </View>
          </View>

          {/* Player Positions - Home Team */}
          {game.status === 'live' && (
            <>
              {/* Goalkeeper */}
              <View style={[styles.player, { bottom: '10%', left: '5%' }]}>
                <View style={styles.playerIcon}>
                  <Text style={styles.playerText}>GK</Text>
                </View>
              </View>
              
              {/* Defenders */}
              <View style={[styles.player, { bottom: '30%', left: '8%' }]}>
                <View style={styles.playerIcon}>
                  <Text style={styles.playerText}>D</Text>
                </View>
              </View>
              <View style={[styles.player, { bottom: '40%', left: '12%' }]}>
                <View style={styles.playerIcon}>
                  <Text style={styles.playerText}>D</Text>
                </View>
              </View>
              
              {/* Midfielders */}
              <View style={[styles.player, { bottom: '50%', left: '20%' }]}>
                <View style={styles.playerIcon}>
                  <Text style={styles.playerText}>M</Text>
                </View>
              </View>
              <View style={[styles.player, { bottom: '45%', left: '35%' }]}>
                <View style={styles.playerIcon}>
                  <Text style={styles.playerText}>M</Text>
                </View>
              </View>
              
              {/* Forwards */}
              <View style={[styles.player, { bottom: '55%', left: '60%' }]}>
                <View style={styles.playerIcon}>
                  <Text style={styles.playerText}>F</Text>
                </View>
              </View>
              <View style={[styles.player, { bottom: '50%', left: '75%' }]}>
                <View style={styles.playerIcon}>
                  <Text style={styles.playerText}>F</Text>
                </View>
              </View>

              {/* Away Team Players */}
              <View style={[styles.player, { bottom: '85%', right: '5%' }]}>
                <View style={[styles.playerIcon, styles.awayPlayer]}>
                  <Text style={styles.playerText}>GK</Text>
                </View>
              </View>
              <View style={[styles.player, { bottom: '70%', right: '8%' }]}>
                <View style={[styles.playerIcon, styles.awayPlayer]}>
                  <Text style={styles.playerText}>D</Text>
                </View>
              </View>
              <View style={[styles.player, { bottom: '60%', right: '12%' }]}>
                <View style={[styles.playerIcon, styles.awayPlayer]}>
                  <Text style={styles.playerText}>D</Text>
                </View>
              </View>
              <View style={[styles.player, { bottom: '50%', right: '20%' }]}>
                <View style={[styles.playerIcon, styles.awayPlayer]}>
                  <Text style={styles.playerText}>M</Text>
                </View>
              </View>
              <View style={[styles.player, { bottom: '45%', right: '35%' }]}>
                <View style={[styles.playerIcon, styles.awayPlayer]}>
                  <Text style={styles.playerText}>M</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Odds Panel */}
      <View style={styles.oddsPanel}>
        <View style={styles.oddItem}>
          <Text style={styles.oddLabel}>{game.homeTeam.name}</Text>
          <Text style={styles.oddValue}>{game.odds.homeWin}</Text>
          <TouchableOpacity
            style={[styles.oddButton, selectedTeam === 'home' && styles.selectedOdd]}
            onPress={() => setSelectedTeam('home')}
          >
            <Text style={styles.oddButtonText}>Select</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.oddItem}>
          <Text style={styles.oddLabel}>Draw</Text>
          <Text style={styles.oddValue}>{game.odds.draw}</Text>
          <TouchableOpacity
            style={[styles.oddButton, selectedTeam === 'draw' && styles.selectedOdd]}
            onPress={() => setSelectedTeam('draw')}
          >
            <Text style={styles.oddButtonText}>Select</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.oddItem}>
          <Text style={styles.oddLabel}>{game.awayTeam.name}</Text>
          <Text style={styles.oddValue}>{game.odds.awayWin}</Text>
          <TouchableOpacity
            style={[styles.oddButton, selectedTeam === 'away' && styles.selectedOdd]}
            onPress={() => setSelectedTeam('away')}
          >
            <Text style={styles.oddButtonText}>Select</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Betting Panel */}
      {showBettingPanel && (
        <View style={styles.bettingPanel}>
          <Text style={styles.bettingTitle}>Place Your Bet</Text>
          <TextInput
            style={styles.bettingInput}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={betAmount}
            onChangeText={setBetAmount}
          />
          <TouchableOpacity
            style={styles.placeBetButton}
            onPress={handlePlaceBet}
          >
            <Text style={styles.placeBetButtonText}>Confirm Bet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowBettingPanel(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bet Button */}
      {!showBettingPanel && (
        <TouchableOpacity
          style={styles.betActionButton}
          onPress={() => setShowBettingPanel(true)}
        >
          <Text style={styles.betActionButtonText}>Place Bet</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  fieldContainer: {
    width: '100%',
    height: height * 0.6,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#2ecc71',
  },
  fieldBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  field: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  centerLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    left: '50%',
    backgroundColor: '#fff',
  },
  centerCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    left: '50%',
    top: '50%',
    marginLeft: -30,
    marginTop: -30,
  },
  scoreBoard: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
  },
  teamScore: {
    alignItems: 'center',
  },
  teamNameScore: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  scoreText: {
    color: '#16c784',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeDisplay: {
    backgroundColor: '#16c784',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 4,
  },
  timeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  player: {
    position: 'absolute',
  },
  playerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  awayPlayer: {
    backgroundColor: '#3498db',
  },
  playerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  oddsPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#16c784',
  },
  oddItem: {
    alignItems: 'center',
    flex: 1,
  },
  oddLabel: {
    color: '#fff',
    fontSize: 11,
    marginBottom: 5,
  },
  oddValue: {
    color: '#16c784',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  oddButton: {
    backgroundColor: '#16c784',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  selectedOdd: {
    backgroundColor: '#0fa367',
  },
  oddButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  bettingPanel: {
    backgroundColor: '#16213e',
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16c784',
  },
  bettingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bettingInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 10,
    fontSize: 14,
  },
  placeBetButton: {
    backgroundColor: '#16c784',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  placeBetButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 12,
  },
  betActionButton: {
    backgroundColor: '#16c784',
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  betActionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LiveGameScreen;
