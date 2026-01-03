import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const ScoreBoard = ({ scores, onClearScores }) => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState({
    table: 'none',
    duration: 'none',
    datetime: 'desc' // Default: newest first
  });

  const handleSort = (sortBy) => {
    setSortOrder(prev => {
      const newOrder = {
        table: 'none',
        duration: 'none',
        datetime: 'none'
      };
      
      switch (sortBy) {
        case 'table':
          newOrder.table = prev.table === 'asc' ? 'desc' : 'asc';
          break;
        case 'duration':
          newOrder.duration = prev.duration === 'asc' ? 'desc' : 'asc';
          break;
        case 'datetime':
          newOrder.datetime = prev.datetime === 'asc' ? 'desc' : 'asc';
          break;
      }
      
      return newOrder;
    });
  };

  const sortedScores = useMemo(() => {
    const sortedScores = [...scores];
    
    // Apply sorting based on active sort column
    if (sortOrder.datetime !== 'none') {
      sortedScores.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder.datetime === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (sortOrder.duration !== 'none') {
      sortedScores.sort((a, b) => {
        return sortOrder.duration === 'asc' ? a.duration - b.duration : b.duration - a.duration;
      });
    } else if (sortOrder.table !== 'none') {
      sortedScores.sort((a, b) => {
        // Handle division tables (e.g., ":3") and multiplication tables (e.g., "3")
        const getTableValue = (tableStr) => {
          const tableString = tableStr.toString();
          if (tableString.startsWith(':')) {
            return parseFloat(tableString.substring(1).replace(',', '.'));
          } else {
            return parseFloat(tableString.replace(',', '.'));
          }
        };
        const aVal = getTableValue(a.table);
        const bVal = getTableValue(b.table);
        return sortOrder.table === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }
    
    return sortedScores;
  }, [scores, sortOrder]);

  const handleClearScores = () => {
    if (window.confirm('Weet je zeker dat je het scoreboard wilt wissen?')) {
      onClearScores();
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg my-8 mx-auto max-w-4xl w-full sm:p-4">
      <h2 className="text-green-600 text-3xl mb-6 font-bold text-center sm:text-2xl sm:mb-4">Scorebord</h2>
      
      <button 
        className="w-full bg-red-600 text-white border-none rounded-lg px-6 py-3 text-base cursor-pointer transition-all hover:bg-red-700 mb-6 sm:text-sm"
        onClick={handleClearScores}
      >
        Wis Scorebord
      </button>

      <div className="bg-gray-100 rounded-lg overflow-hidden mb-6">
        {scores.length > 0 ? (
          <>
            {/* Headers */}
            <div className="grid grid-cols-12 gap-2 p-4 bg-gray-200 font-bold text-center sm:gap-1 sm:p-2">
              <div className="col-span-3">
                <button 
                  className="text-black hover:bg-gray-300 rounded p-2 transition-colors cursor-pointer text-sm w-full"
                  onClick={() => handleSort('table')}
                >
                  Tafel {sortOrder.table === 'asc' ? '↓' : sortOrder.table === 'desc' ? '↑' : '↕'}
                </button>
              </div>
              <div className="col-span-3">
                <button 
                  className="text-black hover:bg-gray-300 rounded p-2 transition-colors cursor-pointer text-sm w-full"
                  onClick={() => handleSort('duration')}
                >
                  Sec {sortOrder.duration === 'asc' ? '↓' : sortOrder.duration === 'desc' ? '↑' : '↕'}
                </button>
              </div>
              <div className="col-span-6">
                <button 
                  className="text-black hover:bg-gray-300 rounded p-2 transition-colors cursor-pointer text-sm w-full"
                  onClick={() => handleSort('datetime')}
                >
                  Datum {sortOrder.datetime === 'asc' ? '↓' : sortOrder.datetime === 'desc' ? '↑' : '↕'}
                </button>
              </div>
            </div>
            
            {/* Score rows */}
            {sortedScores.map((score, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 p-2 border-b border-gray-200 items-center text-center hover:bg-slate-50 sm:gap-1 sm:p-1">
                <span className="text-black text-sm col-span-3">
                  {score.table.toString().startsWith(':') ? `: ${score.table.toString().substring(1)}` : `x ${score.table.toString()}`}
                </span>
                <span className="text-black text-sm col-span-3">{Math.round(score.duration)}</span>
                <span className="text-black text-sm col-span-6">{formatDate(score.timestamp)}</span>
              </div>
            ))}
          </>
        ) : (
          <p className="text-gray-600 text-center py-8">Nog geen scores beschikbaar</p>
        )}
      </div>

      <button 
        onClick={() => navigate('/tables')}
        className="w-full bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-base cursor-pointer transition-all hover:bg-blue-700 sm:text-sm"
      >
        Terug naar Tafels
      </button>
    </div>
  );
};

export default ScoreBoard;
