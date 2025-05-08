'use client';

import { useEffect, useState } from 'react';

interface MobileControlsProps {
  onDirectionChange: (x: number, y: number) => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({ onDirectionChange }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [joystickActive, setJoystickActive] = useState<boolean>(false);
  const [joystickPos, setJoystickPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [basePos, setBasePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const baseX = touch.clientX;
    const baseY = touch.clientY;
    
    setBasePos({ x: baseX, y: baseY });
    setJoystickPos({ x: baseX, y: baseY });
    setJoystickActive(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!joystickActive) return;
    
    const touch = e.touches[0];
    const maxDistance = 50; // Maximum joystick distance
    
    // Calculate distance from base
    const deltaX = touch.clientX - basePos.x;
    const deltaY = touch.clientY - basePos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Normalize direction
    let normX = deltaX / distance;
    let normY = deltaY / distance;
    
    // Limit distance
    const actualDistance = Math.min(distance, maxDistance);
    
    // Calculate joystick position
    const joystickX = basePos.x + normX * actualDistance;
    const joystickY = basePos.y + normY * actualDistance;
    
    setJoystickPos({ x: joystickX, y: joystickY });
    
    // Send normalized direction to game
    onDirectionChange(normX, normY);
  };
  
  const handleTouchEnd = () => {
    setJoystickActive(false);
    onDirectionChange(0, 0);
  };
  
  if (!isMobile) return null;
  
  return (
    <div className="fixed bottom-10 left-10 z-30">
      {/* Joystick base */}
      <div 
        className="w-32 h-32 rounded-full bg-gray-500 bg-opacity-50 flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Joystick handle */}
        {joystickActive && (
          <div 
            className="w-16 h-16 rounded-full bg-gray-700 absolute"
            style={{
              left: joystickPos.x - 32,
              top: joystickPos.y - 32,
            }}
          />
        )}
        {!joystickActive && (
          <div className="w-16 h-16 rounded-full bg-gray-700" />
        )}
      </div>
    </div>
  );
};

export default MobileControls;
