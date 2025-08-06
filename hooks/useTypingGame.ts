import { useState, useCallback, useEffect } from 'react';
import { WORD_LIST } from '../constants';

export enum GameState {
  IDLE,
  COUNTDOWN,
  PREPARING,
  RUNNING,
  FINISHED
}

export interface Score {
  time: number;
  wpm: number;
}

export const useTypingGame = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [score, setScore] = useState<Score | null>(null);
  const [countdownValue, setCountdownValue] = useState(3);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext once. It requires user interaction to start on some browsers,
    // which is fulfilled by the 'Start' button click.
    setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)());
  }, []);
  
  const playBeep = useCallback((freq = 523.25, duration = 150) => {
    if (!audioContext) return;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 0.01);

    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillator.type = 'sine';

    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration / 1000);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }, [audioContext]);


  const speak = useCallback((text: string, onEnd: () => void) => {
    if (!window.speechSynthesis) {
      console.warn("Speech Synthesis not supported by this browser.");
      onEnd(); // fallback for browsers without TTS
      return;
    }
    // Cancel any ongoing speech before starting a new one.
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = onEnd;
    utterance.onerror = (e) => {
      console.error("Speech Synthesis error:", e);
      onEnd(); // still need to start the timer even if speech fails
    };
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (gameState !== GameState.COUNTDOWN) return;

    if (countdownValue > 0) {
      playBeep(countdownValue === 1 ? 783.99 : 523.25); // Higher beep for the last one
      const timer = setTimeout(() => {
        setCountdownValue(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
        setGameState(GameState.PREPARING);
        const newWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
        setCurrentWord(newWord);

        speak(newWord, () => {
          setStartTime(Date.now());
          setGameState(GameState.RUNNING);
        });
    }
  }, [gameState, countdownValue, speak, playBeep]);


  const startTest = useCallback(() => {
    // Cancel any ongoing speech
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    setScore(null);
    setUserInput('');
    setStartTime(null);
    setCountdownValue(3);
    setGameState(GameState.COUNTDOWN);
  }, []);

  const replayAudio = useCallback(() => {
    if (currentWord) {
      // The `speak` function now handles cancelling previous speech.
      speak(currentWord, () => {});
    }
  }, [currentWord, speak]);

  const resetGame = useCallback(() => {
    setGameState(GameState.IDLE);
    setCurrentWord('');
    setUserInput('');
    setScore(null);
    setStartTime(null);
  }, []);

  const handleInputChange = (value: string) => {
    if (gameState !== GameState.RUNNING) return;
    setUserInput(value);
  };

  useEffect(() => {
    if (gameState === GameState.RUNNING && startTime && userInput.toLowerCase() === currentWord.toLowerCase()) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000; // in seconds
      const wpm = (currentWord.length / 5) / (timeTaken / 60);

      setScore({
        time: parseFloat(timeTaken.toFixed(2)),
        wpm: parseFloat(wpm.toFixed(2))
      });
      setGameState(GameState.FINISHED);
    }
  }, [userInput, currentWord, startTime, gameState]);

  useEffect(() => {
    // Expose a function on the window object to log the current word for debugging/cheating.
    // You can call `logTheWord()` in the browser's developer console.
    (window as any).logTheWord = () => {
      if (currentWord) {
        console.log(`The current word is: "${currentWord}"`);
      } else {
        console.log("No word is active in the game right now. Start a game first.");
      }
    };

    // Cleanup the function when the component unmounts
    return () => {
      delete (window as any).logTheWord;
    };
  }, [currentWord]);

  return {
    gameState,
    currentWord,
    userInput,
    score,
    countdownValue,
    startTest,
    handleInputChange,
    resetGame,
    replayAudio,
  };
};