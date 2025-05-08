"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnect } from './WalletConnect';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-800 bg-opacity-90 z-10">
      <h1 className="text-5xl font-bold text-white mb-8">Big Fish Eat Small Fish</h1>
      <div className="mb-8 text-white text-center">
        <p className="text-xl mb-4">Eat smaller fish to grow bigger!</p>
        <p className="mb-2">• Control your fish with the mouse</p>
        <p className="mb-2">• Eat smaller fish and food to grow</p>
        <p className="mb-2">• Avoid bigger fish or you'll be eaten!</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <WalletConnect />
        {isConnected && (
          <button
            onClick={onStart}
            className={`bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full text-xl transition-transform ${isAnimating ? 'transform scale-110' : ''}`}
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
};

export default StartScreen;