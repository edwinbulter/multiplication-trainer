import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trigger } from 'react-native-haptic-feedback';

const TableSelection = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [customTable, setCustomTable] = useState('');
  const DEFAULT_TABLES = [0.125, 0.25, 1, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 25];

  useEffect(() => {
    loadUsername();
  }, []);

  const loadUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch (error) {
      console.error('Failed to load username', error);
    }
  };

  const startPractice = (table) => {
    trigger('impactLight');
    navigation.navigate('Practice', { table });
  };

  const handleCustomTableSubmit = () => {
    const tableValue = parseFloat(customTable.replace(',', '.'));
    if (!isNaN(tableValue) && tableValue > 0) {
      trigger('impactMedium');
      startPractice(tableValue);
      setCustomTable('');
    } else {
      Alert.alert('Fout', 'Voer een geldig getal in');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      trigger('impactLight');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Fout', 'Kon niet uitloggen');
    }
  };

  const handleCustomTableChange = (value) => {
    // Allow numbers, decimals with comma or dot
    if (value === '' || /^\d*[,.]?\d*$/.test(value)) {
      setCustomTable(value);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.welcomeText}>Welkom {username}!</Text>
      <Text style={styles.subtitle}>Welk tafeltje wil je oefenen?</Text>
      
      <TouchableOpacity 
        style={styles.scoreButton}
        onPress={() => navigation.navigate('ScoreBoard')}
      >
        <Text style={styles.scoreButtonText}>Bekijk Scorebord</Text>
      </TouchableOpacity>

      <View style={styles.tableGrid}>
        {DEFAULT_TABLES.map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.tableButton}
            onPress={() => startPractice(num)}
          >
            <Text style={styles.tableButtonText}>{num.toString().replace('.', ',')}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.customCard}>
        <Text style={styles.customTitle}>Of kies je eigen getal:</Text>
        <View style={styles.customInputRow}>
          <TextInput
            style={styles.customInput}
            value={customTable}
            onChangeText={handleCustomTableChange}
            placeholder="Bijv. 7 of 1,5"
            placeholderTextColor="#666"
            keyboardType="numeric"
            maxLength={10}
          />
          <TouchableOpacity
            style={styles.customButton}
            onPress={handleCustomTableSubmit}
          >
            <Text style={styles.customButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Uitloggen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14b8a6',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 24,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 10,
  },
  tableButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 12,
    width: '28%',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
    textAlign: 'center',
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  customInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#f8fafc',
  },
  customButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TableSelection;
