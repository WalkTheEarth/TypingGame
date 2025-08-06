import React, { useRef, useEffect } from 'react';
import { useTypingGame, GameState } from './hooks/useTypingGame';
import { SpeakerWaveIcon } from './components/icons';

const App: React.FC = () => {
  const {
    gameState,
    currentWord,
    userInput,
    score,
    countdownValue,
    startTest,
    handleInputChange,
    resetGame,
    replayAudio
  } = useTypingGame();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameState === GameState.RUNNING && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === GameState.FINISHED) {
      const timer = setTimeout(() => {
        resetGame();
      }, 4000); // Show score for 4 seconds
      return () => clearTimeout(timer);
    }
  }, [gameState, resetGame]);

  const getInputBorderColor = () => {
    if (gameState === GameState.FINISHED) {
      return 'border-green-500';
    }
    if (gameState === GameState.RUNNING) {
      if (userInput.length === 0) {
        return 'border-slate-500';
      }
      if (currentWord.toLowerCase().startsWith(userInput.toLowerCase())) {
        return 'border-cyan-500';
      }
      return 'border-red-500';
    }
    return 'border-slate-700';
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.IDLE:
        return (
          <button
            onClick={startTest}
            className="px-10 py-5 text-2xl font-bold rounded-lg transition-all duration-300
                       bg-slate-800 text-slate-200 border border-slate-700
                       hover:bg-slate-700 hover:scale-105
                       focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
          >
            Start
          </button>
        );

      case GameState.COUNTDOWN:
        return (
          <div className="text-9xl font-bold text-slate-400 animate-countdown" key={countdownValue}>
            {countdownValue}
          </div>
        );

      case GameState.PREPARING:
        return (
          <div className="flex items-center space-x-3 text-2xl text-slate-400">
            <SpeakerWaveIcon className="w-8 h-8 animate-pulse" />
            <span>Listen...</span>
          </div>
        );

      case GameState.RUNNING:
      case GameState.FINISHED:
        return (
          <div className="w-full max-w-md flex flex-col items-center space-y-8">
            <div className="h-16 flex items-center justify-center">
              {gameState === GameState.FINISHED && (
                <p className="text-5xl font-mono tracking-widest text-slate-200 animate-fade-in">{currentWord}</p>
              )}
            </div>
            
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={gameState !== GameState.RUNNING}
                className={`w-full p-4 pr-14 text-center text-3xl font-mono bg-transparent rounded-none border-b-2 outline-none transition-colors duration-200 ${getInputBorderColor()}`}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
              />
              {gameState === GameState.RUNNING && (
                <button 
                  onClick={replayAudio}
                  aria-label="Hear word again"
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-cyan-400 focus:text-cyan-400 transition-colors focus:outline-none"
                >
                  <SpeakerWaveIcon className="w-7 h-7" />
                </button>
              )}
            </div>
            
            {gameState === GameState.FINISHED && score && (
              <div className="flex justify-around w-full mt-6 p-4 rounded-lg animate-fade-in">
                <div className="text-center px-4">
                  <p className="text-sm text-slate-400">Time</p>
                  <p className="text-4xl font-bold text-white">{score.time}s</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-sm text-slate-400">WPM</p>
                  <p className="text-4xl font-bold text-white">{score.wpm}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <main className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;