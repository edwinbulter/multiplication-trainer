import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trigger } from 'react-native-haptic-feedback';

const PracticeScreen = ({ route, navigation }) => {
  const { table } = route.params;
  const selectedTable = parseFloat(table.toString().replace(',', '.'));
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [answers, setAnswers] = useState([]);

  // Generate questions for the selected table
  const generateQuestions = (tableValue) => {
    const newQuestions = [];
    for (let i = 1; i <= 10; i++) {
      newQuestions.push({
        multiplicand: tableValue,
        multiplier: i,
        answer: tableValue * i
      });
    }
    // Shuffle questions
    return newQuestions.sort(() => Math.random() - 0.5);
  };

  // Initialize practice session
  useEffect(() => {
    if (selectedTable && !isNaN(selectedTable)) {
      const newQuestions = generateQuestions(selectedTable);
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setStartTime(Date.now());
      setEndTime(null);
      setIsComplete(false);
      setAnswers([]);
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Stop Oefenen',
        'Weet je zeker dat je wilt stoppen?',
        [
          { text: 'Nee', style: 'cancel' },
          { text: 'Ja', onPress: () => navigation.goBack() },
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, [selectedTable]);

  // Handle answer submission
  const handleSubmit = () => {
    if (!userAnswer) {
      Alert.alert('Fout', 'Voer een antwoord in');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    // Convert comma to dot for proper float parsing
    const answer = parseFloat(userAnswer.replace(',', '.'));

    // Compare with small epsilon to handle floating point arithmetic
    const isCorrect = Math.abs(answer - currentQuestion.answer) < 0.0001;
    
    // Save answer
    const newAnswer = {
      question: `${currentQuestion.multiplicand.toString().replace('.', ',')} × ${currentQuestion.multiplier}`,
      userAnswer: answer,
      correctAnswer: currentQuestion.answer,
      isCorrect: isCorrect
    };
    setAnswers([...answers, newAnswer]);

    if (isCorrect) {
      setFeedback('Goed!');
      setFeedbackType('success');
      trigger('success');
    } else {
      setFeedback(`Fout! Het juiste antwoord is ${currentQuestion.answer}`);
      setFeedbackType('error');
      trigger('error');
    }

    // Clear feedback after delay
    setTimeout(() => {
      setFeedback('');
      setFeedbackType('');
    }, 1500);

    if (currentQuestionIndex === questions.length - 1) {
      // Practice complete
      const endTimeNow = Date.now();
      setEndTime(endTimeNow);
      setIsComplete(true);
      saveScore(selectedTable, endTimeNow - startTime);
    } else {
      // Move to next question
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
      }, 1500);
    }
  };

  // Save score to AsyncStorage
  const saveScore = async (tableValue, duration) => {
    try {
      const username = await AsyncStorage.getItem('username');
      const existingScores = JSON.parse(await AsyncStorage.getItem('scores') || '[]');
      
      const newScore = {
        username,
        table: tableValue,
        duration: duration / 1000,
        date: new Date().toISOString(),
        answers: answers
      };
      
      existingScores.push(newScore);
      await AsyncStorage.setItem('scores', JSON.stringify(existingScores));
    } catch (error) {
      console.error('Failed to save score', error);
    }
  };

  // Calculate practice duration
  const getDuration = () => {
    if (!startTime || !endTime) return 0;
    return ((endTime - startTime) / 1000).toFixed(1);
  };

  // Handle number input
  const handleNumberInput = (num) => {
    if (userAnswer.length < 10) {
      setUserAnswer(userAnswer + num.toString());
      trigger('impactLight');
    }
  };

  // Handle comma input
  const handleComma = () => {
    if (!userAnswer.includes(',') && userAnswer.length > 0 && userAnswer.length < 9) {
      setUserAnswer(userAnswer + ',');
      trigger('impactLight');
    }
  };

  // Handle delete
  const handleDelete = () => {
    setUserAnswer(userAnswer.slice(0, -1));
    trigger('impactLight');
  };

  if (isNaN(selectedTable) || selectedTable <= 0) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.errorTitle}>Ongeldige tafel</Text>
          <Text style={styles.errorText}>Het opgegeven tafeltje is niet geldig.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Terug naar Tafels</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.loadingTitle}>Laden...</Text>
          <Text style={styles.loadingText}>Vragen worden voorbereid...</Text>
        </View>
      </View>
    );
  }

  if (isComplete) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.completeTitle}>Goed gedaan! 🎉</Text>
          <Text style={styles.completeText}>
            Je hebt de tafel van {selectedTable.toString().replace('.', ',')} afgerond in {getDuration()} seconden!
          </Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => navigation.navigate('TableSelection')}
          >
            <Text style={styles.completeButtonText}>Kies een andere tafel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Tafel van {selectedTable.toString().replace('.', ',')}</Text>
        
        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            {currentQuestion.multiplicand.toString().replace('.', ',')} × {currentQuestion.multiplier} = 
          </Text>
          <View style={styles.answerBox}>
            <Text style={styles.answerText}>{userAnswer}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.stopButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.stopButtonText}>Stop Oefenen</Text>
        </TouchableOpacity>

        <View style={[styles.feedback, feedbackType === 'success' && styles.successFeedback, feedbackType === 'error' && styles.errorFeedback]}>
          <Text style={[styles.feedbackText, feedbackType === 'success' && styles.successText, feedbackType === 'error' && styles.errorText]}>
            {feedback}
          </Text>
        </View>

        <View style={styles.keyboard}>
          <View style={styles.keyboardRow}>
            {[1, 2, 3].map(num => (
              <TouchableOpacity
                key={num}
                style={styles.keyButton}
                onPress={() => handleNumberInput(num)}
              >
                <Text style={styles.keyText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keyboardRow}>
            {[4, 5, 6].map(num => (
              <TouchableOpacity
                key={num}
                style={styles.keyButton}
                onPress={() => handleNumberInput(num)}
              >
                <Text style={styles.keyText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keyboardRow}>
            {[7, 8, 9].map(num => (
              <TouchableOpacity
                key={num}
                style={styles.keyButton}
                onPress={() => handleNumberInput(num)}
              >
                <Text style={styles.keyText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keyboardRow}>
            <TouchableOpacity
              style={[styles.keyButton, styles.commaButton]}
              onPress={handleComma}
            >
              <Text style={styles.keyText}>,</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keyButton}
              onPress={() => handleNumberInput(0)}
            >
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.keyText}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.checkButton, !userAnswer && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!userAnswer}
        >
          <Text style={styles.checkButtonText}>Controleer</Text>
        </TouchableOpacity>

        <Text style={styles.progress}>
          Vraag {currentQuestionIndex + 1} van {questions.length}
        </Text>
      </View>
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
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
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
    marginBottom: 30,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  question: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  answerBox: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    minWidth: 80,
    marginLeft: 10,
    alignItems: 'center',
  },
  answerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  stopButton: {
    backgroundColor: '#e5e7eb',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  stopButtonText: {
    color: '#374151',
    fontWeight: 'bold',
  },
  feedback: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successFeedback: {
    backgroundColor: '#16a34a',
  },
  errorFeedback: {
    backgroundColor: '#dc2626',
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  successText: {
    color: 'white',
  },
  errorText: {
    color: 'white',
  },
  keyboard: {
    marginBottom: 20,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  keyButton: {
    width: 70,
    height: 70,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commaButton: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  keyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  checkButton: {
    backgroundColor: '#16a34a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  checkButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progress: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
    marginBottom: 20,
  },
  completeText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PracticeScreen;
