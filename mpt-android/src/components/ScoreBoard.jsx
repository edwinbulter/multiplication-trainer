import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trigger } from 'react-native-haptic-feedback';

const ScoreBoard = ({ navigation }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const storedScores = JSON.parse(await AsyncStorage.getItem('scores') || '[]');
      setScores(storedScores);
    } catch (error) {
      console.error('Failed to load scores', error);
    }
  };

  const getSortedScores = () => {
    return scores.sort((a, b) => a.duration - b.duration);
  };

  const handleClearScores = () => {
    Alert.alert(
      'Wis Scorebord',
      'Weet je zeker dat je alle scores wilt wissen? Dit kan niet ongedaan worden gemaakt.',
      [
        { text: 'Nee', style: 'cancel' },
        { 
          text: 'Ja', 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('scores');
              setScores([]);
              trigger('impactMedium');
            } catch (error) {
              Alert.alert('Fout', 'Kon scores niet wissen');
            }
          }
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderScoreItem = ({ item, index }) => (
    <View style={styles.scoreItem}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.table}>Tafel van {item.table.toString().replace('.', ',')}</Text>
      <Text style={styles.duration}>{item.duration.toFixed(1)} seconden</Text>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Scorebord</Text>
        
        {getSortedScores().length > 0 ? (
          <FlatList
            data={getSortedScores()}
            renderItem={renderScoreItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.scoreList}
          />
        ) : (
          <Text style={styles.noScores}>Nog geen scores beschikbaar</Text>
        )}

        <View style={styles.buttonContainer}>
          {getSortedScores().length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearScores}
            >
              <Text style={styles.clearButtonText}>Wis Scorebord</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('TableSelection')}
          >
            <Text style={styles.backButtonText}>Terug naar Tafels</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14b8a6',
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreList: {
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 16,
    flex: 1,
    minWidth: 100,
  },
  table: {
    color: '#14b8a6',
    fontSize: 16,
    flex: 1,
    minWidth: 120,
  },
  duration: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    minWidth: 100,
  },
  date: {
    color: '#6b7280',
    fontSize: 14,
    flex: 1,
    minWidth: 120,
  },
  noScores: {
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 40,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: '#dc2626',
    padding: 15,
    borderRadius: 12,
    paddingHorizontal: 30,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
    paddingHorizontal: 30,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScoreBoard;
