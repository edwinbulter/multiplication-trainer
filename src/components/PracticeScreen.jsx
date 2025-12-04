import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PracticeScreen = ({ onSaveScore }) => {
  const { table } = useParams();
  const navigate = useNavigate();
  const selectedTable = parseFloat(table.replace(',', '.'));
  
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

  // Initialize practice session
  useEffect(() => {
    if (selectedTable && !isNaN(selectedTable)) {
      setQuestions(generateQuestions(selectedTable));
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setStartTime(Date.now());
      setEndTime(null);
      setIsComplete(false);
    }
  }, [selectedTable]);

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
        onSaveScore(selectedTable, duration);
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

  if (isNaN(selectedTable) || selectedTable <= 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-lg">
        <h2 className="text-red-600 text-3xl mb-6 font-semibold">Ongeldige tafel</h2>
        <p className="mb-6 text-lg">Het opgegeven tafeltje is niet geldig.</p>
        <button
          onClick={() => navigate('/tables')}
          className="bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-lg cursor-pointer transition-colors hover:bg-blue-700"
        >
          Terug naar Tafels
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-lg">
        <h2 className="text-blue-600 text-3xl mb-6 font-semibold">Laden...</h2>
        <p>Vragen worden voorbereid...</p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-lg">
        <h2 className="text-green-600 text-3xl mb-6 font-semibold sm:text-2xl">Goed gedaan! 🎉</h2>
        <p className="mb-6 text-lg sm:text-base">Je hebt de tafel van {selectedTable.toString().replace('.', ',')} afgerond in {getDuration()} seconden!</p>
        <button
          onClick={() => navigate('/tables')}
          className="bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-lg cursor-pointer transition-colors hover:bg-blue-700"
        >
          Kies een andere tafel
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg w-full max-w-2xl mx-auto box-border overflow-x-hidden flex flex-col items-center text-center sm:p-3 small-mobile:p-2 small-mobile:rounded-lg small-mobile:mx-auto small-mobile:w-11/12">
      <h2 className="text-teal-600 text-3xl mb-6 font-semibold sm:text-2xl sm:mb-4 small-mobile:text-xl small-mobile:mb-2">Tafel van {selectedTable.toString().replace('.', ',')}</h2>
      <div className="text-3xl my-8 font-bold sm:text-2xl sm:my-4 small-mobile:text-xl small-mobile:my-2">
        <p>{questions[currentQuestionIndex].multiplicand.toString().replace('.', ',')} × {questions[currentQuestionIndex].multiplier} = <span className="text-blue-600 border-b-2 border-blue-600 min-w-8 inline-block text-center">{userAnswer}</span></p>
      </div>
      <button
        onClick={() => navigate('/tables')}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors mb-4"
      >
        Stop Oefenen
      </button>
      <div className={`my-4 p-3 rounded-lg font-bold min-h-12 w-4/5 max-w-sm box-border text-center flex items-center justify-center sm:min-h-11 sm:p-2 sm:text-sm xs:min-h-10 small-mobile:my-2 small-mobile:p-2 small-mobile:min-h-8 small-mobile:text-xs ${feedbackType === 'success' ? 'bg-green-600 text-white animate-pulse' : feedbackType === 'error' ? 'bg-red-600 text-white' : ''}`}>
        {feedback}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 my-8 sm:gap-3 sm:my-4 small-mobile:gap-2 small-mobile:my-3">
        {!isMobile && (
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
            className="w-72 p-4 text-xl border-2 border-gray-300 rounded-lg text-center box-border focus:border-blue-600 focus:outline-none text-gray-900 sm:w-36 sm:text-base sm:p-2"
            autoFocus
          />
        )}
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
      <div className="text-gray-600 text-sm mt-4">
        Vraag {currentQuestionIndex + 1} van {questions.length}
      </div>
    </div>
  );
};

export default PracticeScreen;
