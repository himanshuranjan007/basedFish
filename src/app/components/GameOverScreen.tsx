'use client';

interface GameOverScreenProps {
  score: number;
  size: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, size, onRestart }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-blue-900 bg-opacity-90 z-50">
      <div className="bg-blue-800 rounded-2xl shadow-xl px-12 py-10 text-center max-w-md w-full">
        <h2 className="text-4xl font-extrabold text-red-400 mb-6">Game Over</h2>
        
        <p className="text-white text-lg mb-2">Your fish was eaten!</p>

        <div className="text-white text-md mt-4 mb-8 space-y-2">
          <p>
            Final Score: <span className="font-semibold">{score}</span>
          </p>
          <p>
            Final Size: <span className="font-semibold">{size.toFixed(1)}</span>
          </p>
        </div>

        <button 
          onClick={onRestart}
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2.5 px-6 rounded-full text-lg transition duration-200"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;