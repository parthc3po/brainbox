'use client';

import { useState, useEffect, useRef } from 'react';

const TEXTS = [
  "A black hole is a region of spacetime where gravity is so strong that nothing can escape from it.",
  "The deepest point is known as the Challenger Deep, reaching approximately eleven thousand meters.",
  "Linux is a family of open-source Unix-like operating systems based on the Linux kernel.",
  "The Quick Brown Fox Jumps Over The Lazy Dog, testing every key on the mechanical keyboard."
];

export default function TypingRacer() {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    setText(randomText);
    setInput('');
    setStartTime(null);
    setWpm(0);
    setCompleted(false);
    setWordCount(randomText.split(' ').length);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (!startTime) setStartTime(Date.now());

    setInput(val);

    if (val === text) {
      const timeTaken = (Date.now() - startTime) / 1000 / 60; // in minutes
      const computedWpm = Math.round(wordCount / timeTaken);
      setWpm(computedWpm);
      setCompleted(true);
      saveScore(computedWpm);
    }
  };

  const saveScore = async (score) => {
    await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: 'TYPING', score, player: 'Hacker' })
    });
  };

  // Render logic to color text
  const renderedText = text.split('').map((char, index) => {
    let color = 'text-muted-foreground';
    if (index < input.length) {
      color = input[index] === char ? 'text-primary' : 'text-destructive';
    }
    return <span key={index} className={color}>{char}</span>;
  });

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto space-y-8 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">DATA_ENTRY_PROTOCOL</h2>
        <p className="text-muted-foreground text-xs">Type the text below as fast as possible.</p>
      </div>

      <div className="text-lg leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-700 font-medium">
        {renderedText}
      </div>

      {!completed ? (
        <textarea
          value={input}
          onChange={handleChange}
          className="w-full h-24 bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 text-lg focus:border-primary focus:outline-none transition-colors"
          placeholder="Start typing here..."
        />
      ) : (
        <div className="text-center animate-in zoom-in">
          <h3 className="text-4xl font-bold text-primary mb-2">{wpm} WPM</h3>
          <p className="text-muted-foreground mb-4">Transmission Complete.</p>
          <button onClick={resetGame} className="bg-primary text-white font-bold px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">Start Next Round</button>
        </div>
      )}
    </div>
  );
}
