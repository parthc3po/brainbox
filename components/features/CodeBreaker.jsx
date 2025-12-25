'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Delete } from 'lucide-react';
import WORD_LIST from './words.json';

// Constants
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

// Virtual Keyboard Layout
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

export default function CodeBreaker() {
  const [secret, setSecret] = useState('');
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(''));
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState('PLAYING');
  const [usedLetters, setUsedLetters] = useState({});

  // Use ref to avoid stale closures
  const stateRef = useRef({ currentGuess, currentGuessIndex, secret, usedLetters, gameState });
  stateRef.current = { currentGuess, currentGuessIndex, secret, usedLetters, gameState };

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
    setUsedLetters({});
  };

  const handleType = useCallback((char) => {
    const { gameState, currentGuess } = stateRef.current;

    if (gameState !== 'PLAYING') return;

    if (char === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    if (char === 'ENTER') {
      if (currentGuess.length === WORD_LENGTH) {
        // Submit the guess
        const { currentGuessIndex, secret, usedLetters } = stateRef.current;

        // Update guesses array
        setGuesses(prev => {
          const newGuesses = [...prev];
          newGuesses[currentGuessIndex] = currentGuess;
          return newGuesses;
        });

        // Update used letters
        const newUsedLetters = { ...usedLetters };
        currentGuess.split('').forEach((letter, index) => {
          if (secret[index] === letter) {
            newUsedLetters[letter] = 'correct';
          } else if (secret.includes(letter) && newUsedLetters[letter] !== 'correct') {
            newUsedLetters[letter] = 'present';
          } else if (!newUsedLetters[letter]) {
            newUsedLetters[letter] = 'absent';
          }
        });
        setUsedLetters(newUsedLetters);

        // Check win/lose
        if (currentGuess === secret) {
          setGameState('WON');
        } else if (currentGuessIndex === MAX_GUESSES - 1) {
          setGameState('LOST');
        } else {
          setCurrentGuessIndex(prev => prev + 1);
          setCurrentGuess('');
        }
      }
      return;
    }

    if (/^[A-Z]$/.test(char) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + char);
    }
  }, []);

  // Physical Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleType('BACKSPACE');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleType('ENTER');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleType(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleType]);

  const getLetterStatus = (letter, index) => {
    if (secret[index] === letter) return 'bg-primary text-white border-primary';
    if (secret.includes(letter)) return 'bg-yellow-500 text-white border-yellow-500';
    return 'bg-gray-400 text-white border-gray-400';
  };

  const getKeyboardKeyStyle = (key) => {
    const status = usedLetters[key];
    if (status === 'correct') return 'bg-primary text-white';
    if (status === 'present') return 'bg-yellow-500 text-white';
    if (status === 'absent') return 'bg-gray-400 text-white';
    return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 px-2">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">PASSWORD CRACKER</h2>
        {gameState === 'PLAYING' && <p className="text-xs text-muted-foreground">Guess the {WORD_LENGTH}-letter password.</p>}
        {gameState === 'WON' && <p className="text-lg sm:text-xl text-primary font-bold animate-pulse">ACCESS GRANTED</p>}
        {gameState === 'LOST' && <div className="text-destructive"><p>ACCESS DENIED</p><p className="text-sm">PASSWORD: {secret}</p></div>}

        {(gameState === 'WON' || gameState === 'LOST') && (
          <button onClick={startNewGame} className="mt-2 border border-primary text-primary px-4 py-2 rounded text-xs hover:bg-primary/10">
            NEXT TARGET
          </button>
        )}
      </div>

      {/* Guess Grid */}
      <div className="grid grid-rows-6 gap-1.5 sm:gap-2">
        {guesses.map((guess, rIndex) => {
          const isCurrent = rIndex === currentGuessIndex && gameState === 'PLAYING';
          const displayText = isCurrent ? currentGuess : guess;
          const letters = displayText.padEnd(WORD_LENGTH, ' ').split('');

          return (
            <div key={rIndex} className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {letters.map((char, cIndex) => {
                let style = "bg-white border-gray-300 text-gray-800";

                if (guess && rIndex < currentGuessIndex) {
                  // Past guess - show colors
                  style = getLetterStatus(guess[cIndex], cIndex);
                } else if (isCurrent && char.trim()) {
                  // Current guess being typed
                  style = "bg-white border-secondary text-secondary border-2";
                }

                return (
                  <div
                    key={cIndex}
                    className={`w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center border-2 rounded-lg font-bold text-xl sm:text-2xl uppercase transition-all ${style}`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Virtual Keyboard */}
      <div className="w-full max-w-sm sm:max-w-md">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-1">
            {row.map(key => (
              <button
                key={key}
                onClick={() => handleType(key)}
                className={`min-w-[28px] sm:min-w-[36px] px-1.5 sm:px-2.5 py-3 sm:py-4 rounded font-bold text-xs sm:text-sm transition-colors ${key === 'ENTER' ? 'px-2 sm:px-3 text-[10px] sm:text-xs bg-primary text-white' :
                    key === 'BACKSPACE' ? 'px-2 sm:px-3 bg-gray-300 text-gray-700' :
                      getKeyboardKeyStyle(key)
                  }`}
              >
                {key === 'BACKSPACE' ? <Delete className="w-4 h-4 sm:w-5 sm:h-5" /> : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
