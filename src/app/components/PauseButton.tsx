
'use client';

interface PauseButtonProps {
  isPaused: boolean;
  onTogglePause: () => void;
}

const PauseButton: React.FC<PauseButtonProps> = ({ isPaused, onTogglePause }) => {
  return (
    <button 
      onClick={onTogglePause}
      className="absolute top-4 right-4 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 z-20"
      aria-label={isPaused ? 'Resume game' : 'Pause game'}
    >
      {isPaused ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      )}
    </button>
  );
};

export default PauseButton;