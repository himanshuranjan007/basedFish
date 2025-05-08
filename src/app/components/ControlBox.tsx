
'use client';

import { useEffect, useState } from 'react';

const ControlBox: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Hide control box after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  const position = isMobile ? 'top-4 left-4' : 'top-4 left-1/2 transform -translate-x-1/2';
  
  return (
    <div className={`absolute ${position} z-20 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {!isVisible && (
        <button 
          onClick={toggleVisibility}
          className="bg-gray-700 bg-opacity-70 text-white px-2 py-1 rounded text-sm"
        >
          Show Controls
        </button>
      )}
      
      {isVisible && (
        <div className="bg-gray-700 bg-opacity-70 text-white p-3 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Game Controls</h3>
            <button 
              onClick={toggleVisibility}
              className="text-xs bg-gray-600 px-2 py-1 rounded"
            >
              Hide
            </button>
          </div>
          <ul className="text-sm">
            <li>• Mouse: Move fish toward cursor</li>
            <li>• Eat smaller fish to grow</li>
            <li>• Avoid bigger fish</li>
            <li>• Green dots are food</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ControlBox;