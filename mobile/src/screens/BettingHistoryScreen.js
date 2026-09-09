import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BettingHistoryScreen = () => {
  const { token } = useContext(AuthContext);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, won, lost

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/bets/history',
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { status: filter === 'all' ? undefined : filter }
          }
        );
        setBets(response.data.data);
      } catch (error) {
        console.error('Error fetching bets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchBets();
  }, [token, filter]);

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
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}
          onPress={() => setFilter('pending')}
        >
          <Text style={styles.filterText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'won' && styles.activeFilter]}
          onPress={() => setFilter('won')}
        >
          <Text style={styles.filterText}>Won</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'lost' && styles.activeFilter]}
          onPress={() => setFilter('lost')}
        >
          <Text style={styles.filterText}>Lost</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {bets.length === 0 ? (
          <Text style={styles.noBets}>No bets found</Text>
        ) : (
          bets.map((bet) => (
            <View key={bet._id} style={styles.betCard}>
              <View style={styles.betHeader}>
                <Text style={styles.betPrediction}>{bet.prediction}</Text>
                <Text style={[styles.betStatus, styles[`status_${bet.status}`]]}>
                  {bet.status.toUpperCase()}
                </Text>
              </View>
              <View style={styles.betDetails}>
                <View style={styles.betDetail}>
                  <Text style={styles.label}>Stake</Text>
                  <Text style={styles.value}>${bet.stake}</Text>
                </View>
                <View style={styles.betDetail}>
                  <Text style={styles.label}>Odds</Text>
                  <Text style={styles.value}>{bet.oddsAtTime}</Text>
                </View>
                <View style={styles.betDetail}>
                  <Text style={styles.label}>Potential Winnings</Text>
                  <Text style={styles.value}>${bet.potentialWinnings}</Text>
                </View>
              </View>
              {bet.status === 'won' && (
                <View style={styles.winnings}>
                  <Text style={styles.winningsText}>Won: ${bet.actualWinnings}</Text>
                </View>
              )}
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#16c784',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  noBets: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  betCard: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  betPrediction: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  betStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  status_pending: {
    backgroundColor: '#f39c12',
  },
  status_won: {
    backgroundColor: '#16c784',
  },
  status_lost: {
    backgroundColor: '#e74c3c',
  },
  betDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  betDetail: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16c784',
  },
  winnings: {
    backgroundColor: '#d4edda',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  winningsText: {
    color: '#155724',
    fontWeight: '600',
  },
});

export default BettingHistoryScreen;
