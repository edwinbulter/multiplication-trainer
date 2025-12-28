import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  // Save data to AsyncStorage
  async save(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  },

  // Load data from AsyncStorage
  async load(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return null;
    }
  },

  // Remove data from AsyncStorage
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  },

  // Clear all data from AsyncStorage
  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
};

// Specific storage functions for the app
export const userStorage = {
  // Save username
  async saveUsername(username) {
    await storage.save('username', username);
  },

  // Load username
  async loadUsername() {
    return await storage.load('username');
  },

  // Remove username
  async removeUsername() {
    await storage.remove('username');
  },

  // Save score
  async saveScore(score) {
    const scores = await this.loadScores() || [];
    scores.push(score);
    await storage.save('scores', scores);
  },

  // Load scores
  async loadScores() {
    return await storage.load('scores');
  },

  // Clear scores
  async clearScores() {
    await storage.remove('scores');
  }
};
