'use client';

import { useState, useEffect } from 'react';
import WORD_LIST from './words.json';

// Constants
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

export default function CodeBreaker() {
  const [secret, setSecret] = useState('');
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(''));
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState('PLAYING'); // PLAYING, WON, LOST

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setSecret(randomWord);
    setGuesses(Array(MAX_GUESSES).fill(''));
    setCurrentGuessIndex(0);
    setCurrentGuess('');
    setGameState('PLAYING');
  };

  const handleType = (char) => {
    if (gameState !== 'PLAYING') return;
    if (char === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }
    if (char === 'ENTER') {
      if (currentGuess.length === WORD_LENGTH) {
        submitGuess();
      }
      return;
    }
    if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(char)) {
      setCurrentGuess(prev => prev + char);
    }
  };

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace') handleType('BACKSPACE');
      else if (e.key === 'Enter') handleType('ENTER');
      else handleType(e.key.toUpperCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameState]);

  const submitGuess = () => {
    const newGuesses = [...guesses];
    newGuesses[currentGuessIndex] = currentGuess;
    setGuesses(newGuesses);

    if (currentGuess === secret) {
      setGameState('WON');
      // Save Score logic here if needed (e.g. 100 - guesses * 10)
    } else if (currentGuessIndex === MAX_GUESSES - 1) {
      setGameState('LOST');
    } else {
      setCurrentGuessIndex(prev => prev + 1);
      setCurrentGuess('');
    }
  };

  const getLetterStatus = (letter, index, guess) => {
    if (secret[index] === letter) return 'bg-primary text-black border-primary'; // Match
    if (secret.includes(letter)) return 'bg-yellow-500 text-black border-yellow-500'; // Wrong spot
    return 'bg-muted text-muted-foreground border-border'; // No match
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">PASSWORD CRACKER</h2>
        {gameState === 'PLAYING' && <p className="text-xs text-muted-foreground">Guess the {WORD_LENGTH}-letter system password.</p>}
        {gameState === 'WON' && <p className="text-xl text-primary font-bold animate-pulse">ACCESS GRANTED</p>}
        {gameState === 'LOST' && <div className="text-destructive"><p>ACCESS DENIED</p><p>PASSWORD: {secret}</p></div>}

        {(gameState === 'WON' || gameState === 'LOST') && (
          <button onClick={startNewGame} className="mt-4 border border-primary text-primary px-4 py-2 rounded text-xs hover:bg-primary/10">
            NEXT TARGET
          </button>
        )}
      </div>

      <div className="grid grid-rows-6 gap-2">
        {guesses.map((guess, rIndex) => {
          const isCurrent = rIndex === currentGuessIndex;
          const letters = isCurrent ? currentGuess.padEnd(WORD_LENGTH, ' ') : guess.padEnd(WORD_LENGTH, ' ');

          return (
            <div key={rIndex} className="grid grid-cols-5 gap-2">
              {letters.split('').map((char, cIndex) => {
                let style = "bg-white border-gray-200 text-gray-800 shadow-sm";
                if (!isCurrent && guess) {
                  style = getLetterStatus(char, cIndex, guess);
                } else if (isCurrent && char.trim()) {
                  style = "border-secondary text-secondary animate-pulse";
                }

                return (
                  <div key={cIndex} className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg font-bold text-xl uppercase transition-colors ${style}`}>
                    {char}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  );
}
