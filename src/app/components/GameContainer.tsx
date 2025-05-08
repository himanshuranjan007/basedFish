
'use client';

import { useEffect, useState, useRef } from 'react';
import Game from '../game/Game';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import PauseButton from './PauseButton';
import GameUI from './GameUI';
import ControlBox from './ControlBox';
import StatsMonitor from './StatsMonitor';
import MobileControls from './MobileControls';



const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'gameOver'>('start');
  const [score, setScore] = useState<number>(0);
  const [playerSize, setPlayerSize] = useState<number>(10);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [finalSize, setFinalSize] = useState<number>(0);
  const [playerPosition, setPlayerPosition] = useState<{ x: number; y: number }>({ x: 500, y: 400 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setPlayerSize(10);
    
    if (canvasRef.current) {
      gameRef.current = new Game(
        canvasRef.current,
        handleGameOver,
        updateScore,
        updatePlayerSize,
        updatePlayerPosition
      );
      gameRef.current.start();
    }
  };
  
  const pauseGame = () => {
    if (gameState === 'playing') {
      setGameState('paused');
      gameRef.current?.pause();
    } else if (gameState === 'paused') {
      setGameState('playing');
      gameRef.current?.resume();
    }
  };
  
  const handleGameOver = (finalScore: number, finalSize: number) => {
    setFinalScore(finalScore);
    setFinalSize(finalSize);
    setGameState('gameOver');
    gameRef.current?.stop();
  };
  
  const updateScore = (newScore: number) => {
    setScore(newScore);
  };
  
  const updatePlayerSize = (newSize: number) => {
    setPlayerSize(newSize);
  };
  
  const updatePlayerPosition = (x: number, y: number) => {
    setPlayerPosition({ x, y });
  };
  
  const handleMobileDirectionChange = (x: number, y: number) => {
    if (gameRef.current) {
      gameRef.current.setMobileDirection(x, y);
    }
  };
  
  useEffect(() => {
    // Clean up game on unmount
    return () => {
      gameRef.current?.stop();
    };
  }, []);
  
  return (
    <div className="relative w-[1000px] h-[800px] max-w-full max-h-[80vh] bg-blue-800 rounded-lg overflow-hidden shadow-xl">
      {gameState === 'start' && (
        <StartScreen onStart={startGame} />
      )}
      
      {gameState === 'gameOver' && (
        <GameOverScreen 
          score={finalScore} 
          size={finalSize} 
          onRestart={startGame} 
        />
      )}
      
      <canvas 
        ref={canvasRef} 
        width={1000} 
        height={800} 
        className={`${gameState === 'start' || gameState === 'gameOver' ? 'hidden' : 'block'}`}
      />
      
      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <PauseButton isPaused={gameState === 'paused'} onTogglePause={pauseGame} />
          <GameUI score={score} playerSize={playerSize} />
          <StatsMonitor playerSize={playerSize} score={score} playerPosition={playerPosition} />
          <ControlBox />
          <MobileControls onDirectionChange={handleMobileDirectionChange} />
        </>
      )}
    </div>
  );
};

export default GameContainer;