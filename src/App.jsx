import { useState } from 'react';
import './App.css';

const App = () => {
  const [inputUsername, setInputUsername] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [showScores, setShowScores] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  
  // Load scores from localStorage
  const getScores = () => {
    const scores = localStorage.getItem('scores');
    return scores ? JSON.parse(scores) : [];
  };

  // Save a new score
  const saveScore = (table, duration) => {
    const scores = getScores();
    scores.push({
      username,
      table,
      duration,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('scores', JSON.stringify(scores));
  };

  // Clear all scores
  const clearScores = () => {
    if (window.confirm('Weet je zeker dat je alle scores wilt wissen? Dit kan niet ongedaan worden gemaakt.')) {
      localStorage.removeItem('scores');
      // Force re-render by updating a state that affects the scoreboard
      setShowScores(false);
      setTimeout(() => setShowScores(true), 100);
    }
  };

  // Save username to localStorage
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      const formattedName = inputUsername.trim().toLowerCase().charAt(0).toUpperCase() + inputUsername.trim().toLowerCase().slice(1);
      localStorage.setItem('username', formattedName);
      setUsername(formattedName);
      setInputUsername('');
    }
  };

  // Get sorted scores for the scoreboard
  const getSortedScores = () => {
    return getScores().sort((a, b) => a.duration - b.duration);
  };

  // Generate questions for the selected table
  const generateQuestions = (table) => {
    const newQuestions = [];
    for (let i = 1; i <= 10; i++) {
      newQuestions.push({
        multiplicand: table,
        multiplier: i,
        answer: table * i
      });
    }
    // Shuffle questions
    return newQuestions.sort(() => Math.random() - 0.5);
  };

  // Start new practice session
  const startPractice = (table) => {
    setSelectedTable(table);
    setQuestions(generateQuestions(table));
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setStartTime(Date.now());
    setEndTime(null);
    setIsComplete(false);
  };

  // Handle answer submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const currentQuestion = questions[currentQuestionIndex];
    // Convert comma to dot for proper float parsing
    const answer = parseFloat(userAnswer.replace(',', '.'));

    // Compare with small epsilon to handle floating point arithmetic
    if (Math.abs(answer - currentQuestion.answer) < 0.0001) {
      setFeedback('Goed!');
      setFeedbackType('success');
      // Clear the success message after 1 second
      setTimeout(() => {
        setFeedback('');
        setFeedbackType('');
      }, 1000);
      if (currentQuestionIndex === questions.length - 1) {
        // Practice complete
        const endTimeNow = Date.now();
        setEndTime(endTimeNow);
        setIsComplete(true);
        // Save score
        const duration = ((endTimeNow - startTime) / 1000);
        saveScore(selectedTable, duration);
      } else {
        // Move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
      setUserAnswer('');
    } else {
      // Wrong answer - clear input for retry and show error message
      setUserAnswer('');
      setFeedback('Fout, geef het juiste antwoord');
      setFeedbackType('error');
    }
  };

  // Calculate practice duration
  const getDuration = () => {
    if (!startTime || !endTime) return 0;
    return ((endTime - startTime) / 1000).toFixed(1);
  };

  return (
    <div className="app">
      <h1>Tafels Oefenen</h1>
      
      {!username ? (
        <div className="username-form">
          <h2>Voer je naam in</h2>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder="Jouw naam"
              required
            />
            <button type="submit">Start</button>
          </form>
        </div>
      ) : !selectedTable && !showScores ? (
        <div className="table-selection">
          <h2>Welkom {username}!</h2>
          <h3>Welk tafeltje wil je oefenen?</h3>
          <button className="scoreboard-button" onClick={() => setShowScores(true)}>
            Bekijk Scorebord
          </button>
          <div className="table-buttons">
            {[0.125, 0.25, 1, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 25].map((num) => (
              <button
                key={num}
                onClick={() => startPractice(num)}
                className="table-button"
              >
                Tafel van {num.toString().replace('.', ',')}
              </button>
            ))}
          </div>
          <button className="logout-button" onClick={() => {
            setUsername('');
            localStorage.removeItem('username');
          }}>
            Uitloggen
          </button>
        </div>
      ) : showScores ? (
        <div className="scoreboard">
          <h2>Scorebord</h2>
          <div className="scores-list">
            {getSortedScores().length > 0 ? (
              getSortedScores().map((score, index) => (
                <div key={index} className="score-item">
                  <span className="score-name">{score.username}</span>
                  <span className="score-table">Tafel van {score.table.toString().replace('.', ',')}</span>
                  <span className="score-time">{score.duration.toFixed(1)} seconden</span>
                  <span className="score-date">{new Date(score.timestamp).toLocaleString('nl-NL')}</span>
                </div>
              ))
            ) : (
              <p className="no-scores">Nog geen scores beschikbaar. Speel een spel om je eerste score te behalen!</p>
            )}
          </div>
          <div className="scoreboard-buttons">
            {getSortedScores().length > 0 && (
              <button className="clear-scores-button" onClick={clearScores}>
                Wis Scorebord
              </button>
            )}
            <button className="back-button" onClick={() => setShowScores(false)}>
              Terug naar Tafels
            </button>
          </div>
        </div>
      ) : isComplete ? (
        <div className="completion">
          <h2>Goed gedaan! 🎉</h2>
          <p>Je hebt de tafel van {selectedTable.toString().replace('.', ',')} afgerond in {getDuration()} seconden!</p>
          <button
            onClick={() => setSelectedTable(null)}
            className="restart-button"
          >
            Kies een andere tafel
          </button>
        </div>
      ) : (
        <div className="practice">
          <h2>Tafel van {selectedTable.toString().replace('.', ',')}</h2>
          <div className="question">
            <p>{questions[currentQuestionIndex].multiplicand.toString().replace('.', ',')} × {questions[currentQuestionIndex].multiplier} = ?</p>
          </div>
          {feedback && (
            <div className={`feedback ${feedbackType}`}>
              {feedback}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => {
                // Allow only numbers and at most one comma
                const value = e.target.value;
                if (value === '' || /^\d*,?\d*$/.test(value)) {
                  setUserAnswer(value);
                }
              }}
              placeholder="Jouw antwoord"
              className="answer-input"
              autoFocus
            />
            <div className="virtual-keyboard">
              <div className="keyboard-row">
                {[1, 2, 3].map(num => (
                  <button
                    key={num}
                    type="button"
                    className="keyboard-btn number-btn"
                    onClick={() => {
                      if (userAnswer.length < 10) {
                        setUserAnswer(userAnswer + num.toString());
                      }
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="keyboard-row">
                {[4, 5, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    className="keyboard-btn number-btn"
                    onClick={() => {
                      if (userAnswer.length < 10) {
                        setUserAnswer(userAnswer + num.toString());
                      }
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="keyboard-row">
                {[7, 8, 9].map(num => (
                  <button
                    key={num}
                    type="button"
                    className="keyboard-btn number-btn"
                    onClick={() => {
                      if (userAnswer.length < 10) {
                        setUserAnswer(userAnswer + num.toString());
                      }
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="keyboard-row">
                <button
                  type="button"
                  className="keyboard-btn comma-btn"
                  onClick={() => {
                    if (!userAnswer.includes(',') && userAnswer.length > 0 && userAnswer.length < 9) {
                      setUserAnswer(userAnswer + ',');
                    }
                  }}
                >
                  ,
                </button>
                <button
                  type="button"
                  className="keyboard-btn number-btn"
                  onClick={() => {
                    if (userAnswer.length < 10) {
                      setUserAnswer(userAnswer + '0');
                    }
                  }}
                >
                  0
                </button>
                <button
                  type="button"
                  className="keyboard-btn backspace-btn"
                  onClick={() => {
                    setUserAnswer(userAnswer.slice(0, -1));
                  }}
                >
                  ⌫
                </button>
              </div>
            </div>
            <button type="submit" className="submit-btn">Controleer</button>
          </form>
          <p className="progress">Vraag {currentQuestionIndex + 1} van {questions.length}</p>
        </div>
      )}
    </div>
  );
}

export default App;
