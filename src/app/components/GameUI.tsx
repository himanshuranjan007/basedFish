'use client';

interface GameUIProps {
  score: number;
  playerSize: number;
}

const GameUI: React.FC<GameUIProps> = ({ score, playerSize }) => {
  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg z-20">
      <div className="mb-1">
        <span className="font-bold mr-2">Score:</span>
        <span>{score}</span>
      </div>
      <div>
        <span className="font-bold mr-2">Size:</span>
        <span>{playerSize.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default GameUI;
