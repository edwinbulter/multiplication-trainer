import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trigger } from 'react-native-haptic-feedback';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Fout', 'Voer alsjeblieft je naam in');
      return;
    }

    try {
      await AsyncStorage.setItem('username', username);
      trigger('impactLight');
      navigation.replace('TableSelection');
    } catch (error) {
      Alert.alert('Fout', 'Kon naam niet opslaan');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Multiplication Trainer</Text>
        <Text style={styles.subtitle}>Voer je naam in om te beginnen</Text>
        
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Jouw naam"
          placeholderTextColor="#666"
          maxLength={20}
          autoCapitalize="words"
        />
        
        <TouchableOpacity 
          style={[styles.button, !username.trim() && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!username.trim()}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    width: '100%',
    maxWidth: 400,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
