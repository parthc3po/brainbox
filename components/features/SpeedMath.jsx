'use client';

import { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Trophy } from 'lucide-react';

export default function SpeedMath() {
  const [gameState, setGameState] = useState('MENU'); // MENU, PLAYING, GAME_OVER
  const [problem, setProblem] = useState({ text: '', answer: 0 });
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRef = useRef(null);

  const generateProblem = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;

    let text = `${a} ${op} ${b}`;
    let answer = 0;

    if (op === '+') answer = a + b;
    if (op === '-') answer = a - b;
    if (op === '*') answer = a * b;

    setProblem({ text, answer });
  };

  useEffect(() => {
    let timer;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      inputRef.current?.focus();
    }
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('PLAYING');
    generateProblem();
    setInput('');
  };

  const endGame = async () => {
    setGameState('GAME_OVER');
    if (score > 0) {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: 'SPEED_MATH', score, player: 'Hacker' })
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(input) === problem.answer) {
      setScore(prev => prev + 10);
      generateProblem();
      setInput('');
    } else {
      // Penalty or just shake? For now just clear.
      setInput('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      {gameState === 'MENU' && (
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary mb-4">Speed Math</h2>
          <p className="text-muted-foreground mb-8">Solve as many problems as you can in 60s.</p>
          <button onClick={startGame} className="bg-primary text-white font-bold px-8 py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-md">
            START MISSION
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="w-full max-w-md text-center">
          <div className="flex justify-between items-center mb-12 text-2xl font-bold text-gray-700">
            <div className="flex items-center text-secondary">
              <Timer className="w-6 h-6 mr-2" /> {timeLeft}s
            </div>
            <div className="flex items-center text-primary">
              <Zap className="w-6 h-6 mr-2" /> {score} XP
            </div>
          </div>

          <div className="text-6xl font-extrabold text-foreground mb-8">
            {problem.text}
          </div>

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent border-b-4 border-primary text-center text-4xl p-2 focus:outline-none placeholder:text-gray-300"
              placeholder="?"
              autoFocus
            />
          </form>
        </div>
      )}

      {gameState === 'GAME_OVER' && (
        <div className="text-center animate-in zoom-in">
          <h2 className="text-4xl font-bold text-destructive mb-4">TIME EXPIRED</h2>
          <div className="text-6xl font-bold text-primary mb-8">{score} PTS</div>
          <button onClick={startGame} className="bg-secondary/10 text-secondary border border-secondary px-6 py-2 rounded-lg font-bold hover:bg-secondary/20 transition-colors">
            RETRY
          </button>
        </div>
      )}
    </div>
  );
}
