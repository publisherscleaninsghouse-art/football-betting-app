import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const GamesScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
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

    // Connect to socket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, [filter]);

  const handlePlaceBet = (gameId) => {
    navigation.navigate('PlaceBet', { gameId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16c784" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'live' && styles.activeFilter]}
          onPress={() => setFilter('live')}
        >
          <Text style={[styles.filterText, filter === 'live' && styles.activeFilterText]}>Live</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.gamesList}>
        {games.length === 0 ? (
          <Text style={styles.noGames}>No games available</Text>
        ) : (
          games.map((game) => (
            <View key={game._id} style={[styles.gameCard, game.status === 'live' && styles.liveCard]}>
              <View style={styles.gameHeader}>
                <Text style={styles.league}>{game.league}</Text>
                <Text style={[styles.status, styles[`status_${game.status}`]]}>
                  {game.status.toUpperCase()}
                </Text>
              </View>

              <View style={styles.gameTeams}>
                <View style={styles.team}>
                  <Text style={styles.teamName}>{game.homeTeam.name}</Text>
                </View>

                <View style={styles.score}>
                  {game.status === 'live' ? (
                    <Text style={styles.liveScore}>{game.score.homeTeam} - {game.score.awayTeam}</Text>
                  ) : (
                    <Text style={styles.kickoffTime}>
                      {new Date(game.kickOffTime).toLocaleDateString()}
                    </Text>
                  )}
                </View>

                <View style={styles.team}>
                  <Text style={styles.teamName}>{game.awayTeam.name}</Text>
                </View>
              </View>

              <View style={styles.odds}>
                <View style={styles.oddItem}>
                  <Text style={styles.oddLabel}>{game.homeTeam.name}</Text>
                  <Text style={styles.oddValue}>{game.odds.homeWin}</Text>
                </View>
                <View style={styles.oddItem}>
                  <Text style={styles.oddLabel}>Draw</Text>
                  <Text style={styles.oddValue}>{game.odds.draw}</Text>
                </View>
                <View style={styles.oddItem}>
                  <Text style={styles.oddLabel}>{game.awayTeam.name}</Text>
                  <Text style={styles.oddValue}>{game.odds.awayWin}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.betButton}
                onPress={() => handlePlaceBet(game._id)}
              >
                <Text style={styles.betButtonText}>Place Bet</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeFilter: {
    backgroundColor: '#16c784',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
  },
  gamesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noGames: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  liveCard: {
    borderTopWidth: 4,
    borderTopColor: '#e74c3c',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  league: {
    fontWeight: '600',
    color: '#333',
    fontSize: 12,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  status_live: {
    backgroundColor: '#e74c3c',
  },
  status_scheduled: {
    backgroundColor: '#3498db',
  },
  gameTeams: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontWeight: '600',
    color: '#333',
    fontSize: 13,
    textAlign: 'center',
  },
  score: {
    flex: 0.8,
    alignItems: 'center',
  },
  liveScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16c784',
  },
  kickoffTime: {
    fontSize: 11,
    color: '#666',
  },
  odds: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  oddItem: {
    alignItems: 'center',
    flex: 1,
  },
  oddLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 3,
  },
  oddValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16c784',
  },
  betButton: {
    backgroundColor: '#16c784',
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  betButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default GamesScreen;
