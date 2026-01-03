import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import TableSelection from './components/TableSelection';
import PracticeScreen from './components/PracticeScreen';
import ScoreBoard from './components/ScoreBoard';

const App = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [scores, setScores] = useState([]);
  
  // Load scores from localStorage
  const getScores = () => {
    const scores = localStorage.getItem('scores');
    return scores ? JSON.parse(scores) : [];
  };

  // Save a new score
  const saveScore = (table, duration, operation = 'multiply') => {
    const currentScores = getScores();
    const tableLabel = operation === 'divide' ? `:${table}` : table.toString();
    currentScores.push({
      username,
      table: tableLabel,
      duration,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('scores', JSON.stringify(currentScores));
    setScores(currentScores);
  };

  // Handle login
  const handleLogin = (name) => {
    const formattedName = name.trim().toLowerCase().charAt(0).toUpperCase() + name.trim().toLowerCase().slice(1);
    localStorage.setItem('username', formattedName);
    setUsername(formattedName);
  };

  // Handle logout
  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('username');
  };

  // Clear all scores
  const clearScores = () => {
    localStorage.removeItem('scores');
    setScores([]);
  };

  // Load scores on component mount
  useEffect(() => {
    setScores(getScores());
  }, []);

  return (
    <Router>
      <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-800 p-4 text-center box-border flex flex-col justify-center items-center mx-auto small-mobile:p-2 small-mobile:min-h-screen small-mobile:justify-center small-mobile:items-center">
        <h1 className="text-blue-600 text-4xl mb-8 font-bold md:text-5xl sm:text-3xl sm:mb-4 small-mobile:text-2xl small-mobile:mb-3">Tafels Oefenen</h1>
        
        <Routes>
          <Route 
            path="/" 
            element={
              username ? (
                <Navigate to="/tables" replace />
              ) : (
                <LoginScreen onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/tables" 
            element={
              username ? (
                <TableSelection 
                  username={username} 
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/practice/:table/:operation" 
            element={
              username ? (
                <PracticeScreen 
                  onSaveScore={saveScore}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/scores" 
            element={
              username ? (
                <ScoreBoard scores={scores} onClearScores={clearScores} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
