
'use client';

import { useEffect, useState } from 'react';

interface StatsMonitorProps {
  playerSize: number;
  score: number;
  playerPosition: { x: number; y: number };
}

const StatsMonitor: React.FC<StatsMonitorProps> = ({ playerSize, score, playerPosition }) => {
  const [fps, setFps] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [frames, setFrames] = useState<number[]>([]);
  const [lastFrameTime, setLastFrameTime] = useState<number>(performance.now());
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    let frameId: number;
    
    const updateFPS = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      setLastFrameTime(now);
      
      // Calculate instantaneous FPS
      const instantFps = 1000 / delta;
      
      // Keep last 10 frames for averaging
      const newFrames = [...frames, instantFps].slice(-10);
      setFrames(newFrames);
      
      // Calculate average FPS
      const avgFps = newFrames.reduce((sum, fps) => sum + fps, 0) / newFrames.length;
      setFps(Math.round(avgFps));
      
      frameId = requestAnimationFrame(updateFPS);
    };
    
    frameId = requestAnimationFrame(updateFPS);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      cancelAnimationFrame(frameId);
    };
  }, [frames, lastFrameTime]);
  
  return (
    <div className={`absolute top-4 right-4 bg-gray-700 bg-opacity-70 text-white p-2 rounded z-20 ${isMobile ? 'text-xs' : 'text-sm'}`}>
      <div>FPS: {fps}</div>
      <div>Size: {playerSize.toFixed(1)}</div>
      <div>Score: {score}</div>
      <div className="text-xs">
        Position: ({Math.round(playerPosition.x)}, {Math.round(playerPosition.y)})
      </div>
      <div className="text-xs">Mobile: {isMobile ? 'true' : 'false'}</div>
    </div>
  );
};

export default StatsMonitor;