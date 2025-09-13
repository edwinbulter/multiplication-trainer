import { useState, useEffect } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect if virtual keyboard should be shown (mobile screens)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
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
      setFeedback('Fout, probeer opnieuw');
      setFeedbackType('error');
    }
  };

  // Calculate practice duration
  const getDuration = () => {
    if (!startTime || !endTime) return 0;
    return ((endTime - startTime) / 1000).toFixed(1);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-800 p-4 text-center box-border flex flex-col justify-center items-center mx-auto small-mobile:p-2 small-mobile:min-h-screen small-mobile:justify-center small-mobile:items-center">
      <h1 className="text-blue-600 text-4xl mb-8 font-bold md:text-5xl sm:text-3xl sm:mb-4 small-mobile:text-2xl small-mobile:mb-3">Tafels Oefenen</h1>
      
      {!username ? (
        <div className="max-w-md mx-auto my-8 p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-teal-600 text-3xl mb-6 font-semibold sm:text-2xl sm:mb-4">Voer je naam in</h2>
          <form onSubmit={handleUsernameSubmit} className="flex flex-col items-center gap-4">
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder="Jouw naam"
              required
              className="w-full max-w-xs text-xl p-3 border-2 border-gray-300 rounded-lg text-center focus:border-blue-600 focus:outline-none"
            />
            <button type="submit" className="bg-teal-600 text-white border-none rounded-lg px-6 py-3 text-lg cursor-pointer transition-colors hover:bg-teal-700">Start</button>
          </form>
        </div>
      ) : !selectedTable && !showScores ? (
        <div className="my-8 flex flex-col items-stretch w-full text-center max-w-4xl">
          <h2 className="text-teal-600 text-3xl mb-6 font-semibold sm:text-2xl sm:mb-4">Welkom {username}!</h2>
          <h3 className="text-slate-800 text-2xl mb-4 sm:text-xl">Welk tafeltje wil je oefenen?</h3>
          <button className="bg-teal-600 text-white border-none rounded-lg px-6 py-3 text-base cursor-pointer transition-all hover:bg-teal-700 hover:shadow-lg shadow-md mx-4 my-4" onClick={() => setShowScores(true)}>
            Bekijk Scorebord
          </button>
          <div className="grid grid-cols-3 gap-4 my-8 px-4 w-full text-center sm:gap-3 sm:px-2 xs:gap-2">
            {[0.125, 0.25, 1, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 25].map((num) => (
              <button
                key={num}
                onClick={() => startPractice(num)}
                className="bg-blue-600 text-white border-none rounded-lg p-4 text-lg cursor-pointer transition-all hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg w-full flex items-center justify-center text-center break-words shadow-md sm:p-3 sm:text-base sm:min-h-12 xs:p-2 xs:text-sm xs:min-h-10"
              >
                Tafel van {num.toString().replace('.', ',')}
              </button>
            ))}
          </div>
          <button className="bg-red-600 text-white border-none rounded-lg px-5 py-2.5 text-sm cursor-pointer transition-all hover:bg-red-700" onClick={() => {
            setUsername('');
            localStorage.removeItem('username');
          }}>
            Uitloggen
          </button>
        </div>
      ) : showScores ? (
        <div className="bg-white rounded-xl p-8 shadow-lg my-8 mx-auto max-w-4xl w-full sm:p-4">
          <h2 className="text-teal-600 text-3xl mb-6 font-semibold sm:text-2xl sm:mb-4">Scorebord</h2>
          <div className="my-8">
            {getSortedScores().length > 0 ? (
              getSortedScores().map((score, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 items-center hover:bg-slate-50 sm:grid-cols-2 sm:gap-2 sm:p-2">
                  <span className="font-bold text-blue-600">{score.username}</span>
                  <span className="text-teal-600">Tafel van {score.table.toString().replace('.', ',')}</span>
                  <span className="font-bold sm:col-span-1">{score.duration.toFixed(1)} seconden</span>
                  <span className="text-gray-600 text-sm sm:col-span-1 sm:text-xs">{new Date(score.timestamp).toLocaleString('nl-NL')}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-600 italic p-8 text-center bg-gray-50 rounded-lg my-4">Nog geen scores beschikbaar. Speel een spel om je eerste score te behalen!</p>
            )}
          </div>
          <div className="flex gap-4 justify-center mt-8 flex-wrap sm:flex-col sm:items-center">
            {getSortedScores().length > 0 && (
              <button className="bg-red-600 text-white border-none rounded-lg px-6 py-3 text-base cursor-pointer transition-all hover:bg-red-700 hover:-translate-y-0.5 sm:w-full sm:max-w-xs" onClick={clearScores}>
                Wis Scorebord
              </button>
            )}
            <button className="bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-base cursor-pointer transition-all hover:bg-blue-700 sm:w-full sm:max-w-xs" onClick={() => setShowScores(false)}>
              Terug naar Tafels
            </button>
          </div>
        </div>
      ) : isComplete ? (
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-lg">
          <h2 className="text-green-600 text-3xl mb-6 font-semibold sm:text-2xl">Goed gedaan! 🎉</h2>
          <p className="mb-6 text-lg sm:text-base">Je hebt de tafel van {selectedTable.toString().replace('.', ',')} afgerond in {getDuration()} seconden!</p>
          <button
            onClick={() => setSelectedTable(null)}
            className="bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-lg cursor-pointer transition-colors hover:bg-blue-700"
          >
            Kies een andere tafel
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 shadow-lg w-full max-w-2xl mx-auto box-border overflow-x-hidden flex flex-col items-center text-center sm:p-3 small-mobile:p-2 small-mobile:rounded-lg small-mobile:mx-auto small-mobile:w-11/12">
          <h2 className="text-teal-600 text-3xl mb-6 font-semibold sm:text-2xl sm:mb-4 small-mobile:text-xl small-mobile:mb-2">Tafel van {selectedTable.toString().replace('.', ',')}</h2>
          <div className="text-3xl my-8 font-bold sm:text-2xl sm:my-4 small-mobile:text-xl small-mobile:my-2">
            <p>{questions[currentQuestionIndex].multiplicand.toString().replace('.', ',')} × {questions[currentQuestionIndex].multiplier} = ?</p>
          </div>
          <div className={`my-4 p-3 rounded-lg font-bold min-h-12 w-4/5 max-w-sm box-border text-center flex items-center justify-center sm:min-h-11 sm:p-2 sm:text-sm xs:min-h-10 small-mobile:my-2 small-mobile:p-2 small-mobile:min-h-8 small-mobile:text-xs ${feedbackType === 'success' ? 'bg-green-600 text-white animate-pulse' : feedbackType === 'error' ? 'bg-red-600 text-white' : ''}`}>
            {feedback}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 my-8 sm:gap-3 sm:my-4 small-mobile:gap-2 small-mobile:my-3">
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
              className={`w-72 p-4 text-xl border-2 border-gray-300 rounded-lg text-center box-border focus:border-blue-600 focus:outline-none text-gray-900 ${isMobile ? 'w-44 text-lg bg-gray-50 cursor-default border-blue-600 p-3' : ''} sm:w-36 sm:text-base sm:p-2 small-mobile:w-32 small-mobile:text-sm small-mobile:p-2`}
              autoFocus
              readOnly={isMobile}
            />
            {isMobile && (
              <div className="block my-4 max-w-full w-full box-border mx-auto small-mobile:my-2">
                <div className="flex justify-center gap-2 mb-2 sm:gap-1 small-mobile:gap-1 small-mobile:mb-1">
                  {[1, 2, 3].map(num => (
                    <button
                      key={num}
                      type="button"
                      className="w-15 h-15 text-2xl font-bold border-2 border-gray-300 rounded-lg cursor-pointer transition-all flex items-center justify-center bg-gray-50 text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5 active:translate-y-0 active:bg-blue-700 sm:w-12 sm:h-12 sm:text-xl xs:w-11 xs:h-11 xs:text-lg small-mobile:w-10 small-mobile:h-10 small-mobile:text-base medium-mobile:w-12 medium-mobile:h-12 medium-mobile:text-lg large-mobile:w-15 large-mobile:h-15 large-mobile:text-xl"
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
                <div className="flex justify-center gap-2 mb-2 sm:gap-1 small-mobile:gap-1 small-mobile:mb-1">
                  {[4, 5, 6].map(num => (
                    <button
                      key={num}
                      type="button"
                      className="w-15 h-15 text-2xl font-bold border-2 border-gray-300 rounded-lg cursor-pointer transition-all flex items-center justify-center bg-gray-50 text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5 active:translate-y-0 active:bg-blue-700 sm:w-12 sm:h-12 sm:text-xl xs:w-11 xs:h-11 xs:text-lg small-mobile:w-10 small-mobile:h-10 small-mobile:text-base medium-mobile:w-12 medium-mobile:h-12 medium-mobile:text-lg large-mobile:w-15 large-mobile:h-15 large-mobile:text-xl"
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
                <div className="flex justify-center gap-2 mb-2 sm:gap-1 small-mobile:gap-1 small-mobile:mb-1">
                  {[7, 8, 9].map(num => (
                    <button
                      key={num}
                      type="button"
                      className="w-15 h-15 text-2xl font-bold border-2 border-gray-300 rounded-lg cursor-pointer transition-all flex items-center justify-center bg-gray-50 text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5 active:translate-y-0 active:bg-blue-700 sm:w-12 sm:h-12 sm:text-xl xs:w-11 xs:h-11 xs:text-lg small-mobile:w-10 small-mobile:h-10 small-mobile:text-base medium-mobile:w-12 medium-mobile:h-12 medium-mobile:text-lg large-mobile:w-15 large-mobile:h-15 large-mobile:text-xl"
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
                <div className="flex justify-center gap-2 mb-2 sm:gap-1 small-mobile:gap-1 small-mobile:mb-1">
                  <button
                    type="button"
                    className="w-15 h-15 text-3xl font-bold border-2 border-gray-300 rounded-lg cursor-pointer transition-all flex items-center justify-center bg-gray-200 text-teal-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5 active:translate-y-0 active:bg-blue-700 sm:w-12 sm:h-12 sm:text-2xl xs:w-11 xs:h-11 xs:text-xl small-mobile:w-10 small-mobile:h-10 small-mobile:text-lg medium-mobile:w-12 medium-mobile:h-12 medium-mobile:text-xl large-mobile:w-15 large-mobile:h-15 large-mobile:text-2xl"
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
                    className="w-15 h-15 text-2xl font-bold border-2 border-gray-300 rounded-lg cursor-pointer transition-all flex items-center justify-center bg-gray-50 text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5 active:translate-y-0 active:bg-blue-700 sm:w-12 sm:h-12 sm:text-xl xs:w-11 xs:h-11 xs:text-lg small-mobile:w-10 small-mobile:h-10 small-mobile:text-base medium-mobile:w-12 medium-mobile:h-12 medium-mobile:text-lg large-mobile:w-15 large-mobile:h-15 large-mobile:text-xl"
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
                    className="w-15 h-15 text-xl font-bold border-2 border-red-600 rounded-lg cursor-pointer transition-all flex items-center justify-center bg-red-600 text-white hover:bg-red-700 hover:border-red-700 hover:-translate-y-0.5 active:translate-y-0 active:bg-red-800 sm:w-12 sm:h-12 sm:text-lg xs:w-11 xs:h-11 xs:text-base small-mobile:w-10 small-mobile:h-10 small-mobile:text-sm medium-mobile:w-12 medium-mobile:h-12 medium-mobile:text-base large-mobile:w-15 large-mobile:h-15 large-mobile:text-lg"
                    onClick={() => {
                      setUserAnswer(userAnswer.slice(0, -1));
                    }}
                  >
                    ⌫
                  </button>
                </div>
              </div>
            )}
            <button type="submit" className="bg-green-600 text-white border-none rounded-lg px-8 py-4 text-xl cursor-pointer transition-colors hover:bg-green-700 sm:px-6 sm:py-3 sm:text-lg small-mobile:px-4 small-mobile:py-2 small-mobile:text-base">Controleer</button>
          </form>
          <p className="text-gray-600 text-base mt-8 sm:mt-4 sm:text-sm small-mobile:mt-2 small-mobile:text-xs">Vraag {currentQuestionIndex + 1} van {questions.length}</p>
        </div>
      )}
    </div>
  );
}

export default App;
