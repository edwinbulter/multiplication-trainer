import { useNavigate } from 'react-router-dom';

const ScoreBoard = ({ scores, onClearScores }) => {
  const navigate = useNavigate();

  const getSortedScores = () => {
    return scores.sort((a, b) => a.duration - b.duration);
  };

  const handleClearScores = () => {
    if (window.confirm('Weet je zeker dat je alle scores wilt wissen? Dit kan niet ongedaan worden gemaakt.')) {
      onClearScores();
    }
  };

  return (
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
          <p className="text-gray-600 text-center py-8">Nog geen scores beschikbaar</p>
        )}
      </div>
      <div className="flex gap-4 justify-center mt-8 flex-wrap sm:flex-col sm:items-center">
        {getSortedScores().length > 0 && (
          <button 
            className="bg-red-600 text-white border-none rounded-lg px-6 py-3 text-base cursor-pointer transition-all hover:bg-red-700 hover:-translate-y-0.5 sm:w-full sm:max-w-xs" 
            onClick={handleClearScores}
          >
            Wis Scorebord
          </button>
        )}
        <button 
          onClick={() => navigate('/tables')}
          className="bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-base cursor-pointer transition-all hover:bg-blue-700 sm:w-full sm:max-w-xs"
        >
          Terug naar Tafels
        </button>
      </div>
    </div>
  );
};

export default ScoreBoard;
