import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TableSelection = ({ username, onLogout }) => {
  const [customTable, setCustomTable] = useState('');
  const navigate = useNavigate();
  const DEFAULT_TABLES = [0.125, 0.25, 1, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 25];

  const startPractice = (table) => {
    navigate(`/practice/${table}`);
  };

  const handleCustomTableSubmit = (e) => {
    e.preventDefault();
    const tableValue = parseFloat(customTable.replace(',', '.'));
    if (!isNaN(tableValue) && tableValue > 0) {
      startPractice(tableValue);
      setCustomTable('');
    }
  };

  return (
    <div className="my-4 flex flex-col items-stretch w-full text-center max-w-4xl">
      <h2 className="text-teal-600 text-3xl mb-3 font-semibold sm:text-2xl sm:mb-2">Welkom {username}!</h2>
      <h3 className="text-slate-800 text-xl mb-3 sm:text-lg">Welk tafeltje wil je oefenen?</h3>
      <button 
        className="bg-teal-600 text-white border-none rounded-lg px-4 py-2 text-sm cursor-pointer transition-all hover:bg-teal-700 hover:shadow-lg shadow-md mx-4 my-2" 
        onClick={() => navigate('/scores')}
      >
        Bekijk Scorebord
      </button>
      <div className="grid grid-cols-3 gap-3 my-4 px-4 w-full text-center sm:gap-2 sm:px-2 xs:gap-2">
        {DEFAULT_TABLES.map((num) => (
          <button
            key={num}
            onClick={() => startPractice(num)}
            className="bg-blue-600 text-white border-none rounded-lg p-3 text-base cursor-pointer transition-all hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg w-full flex items-center justify-center text-center break-words shadow-md sm:p-2 sm:text-sm sm:min-h-10 xs:p-1.5 xs:text-xs xs:min-h-8"
          >
            {num.toString().replace('.', ',')}
          </button>
        ))}
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-lg my-3 mx-auto max-w-md">
        <h4 className="text-slate-800 text-lg mb-2 font-semibold sm:text-base">Of kies je eigen getal:</h4>
        <form onSubmit={handleCustomTableSubmit} className="flex flex-row items-center gap-2 sm:flex-col sm:gap-2">
          <input
            type="text"
            value={customTable}
            onChange={(e) => {
              // Allow numbers, decimals with comma or dot
              const value = e.target.value;
              if (value === '' || /^\d*[,.]?\d*$/.test(value)) {
                setCustomTable(value);
              }
            }}
            placeholder="Bijv. 7 of 1,5"
            className="flex-1 p-2 text-base border-2 border-gray-300 rounded-lg text-center focus:border-blue-600 focus:outline-none text-gray-900 sm:w-full sm:text-sm"
          />
          <button
            type="submit"
            className="bg-green-600 text-white border-none rounded-lg px-4 py-2 text-base cursor-pointer transition-all hover:bg-green-700 hover:shadow-lg shadow-md sm:w-full sm:text-sm"
          >
            Start
          </button>
        </form>
      </div>
      <button 
        className="bg-red-600 text-white border-none rounded-lg px-5 py-2.5 text-sm cursor-pointer transition-all hover:bg-red-700" 
        onClick={onLogout}
      >
        Uitloggen
      </button>
    </div>
  );
};

export default TableSelection;
