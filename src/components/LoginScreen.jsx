import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = ({ onLogin }) => {
  const [inputUsername, setInputUsername] = useState('');
  const navigate = useNavigate();

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      onLogin(inputUsername.trim());
      navigate('/tables');
    }
  };

  return (
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
  );
};

export default LoginScreen;
