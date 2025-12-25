'use client';

import { useState, useEffect } from 'react';
import { Cpu, Wifi, Database, Lock, Terminal, Shield, Eye, Zap } from 'lucide-react';

const ICONS = [Cpu, Wifi, Database, Lock, Terminal, Shield, Eye, Zap];

export default function MindMatch() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);

  const initializeGame = () => {
    const doubled = [...ICONS, ...ICONS];
    const shuffled = doubled.sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, isFlipped: false }));
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setDisabled(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleClick = (id) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;

      if (cards[first].icon === cards[second].icon) {
        setSolved([...solved, first, second]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const isCompleted = solved.length === cards.length && cards.length > 0;

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-md mb-6 font-bold text-gray-700">
        <div className="text-secondary">MOVES: {moves}</div>
        <button
          onClick={initializeGame}
          className="text-primary hover:underline uppercase text-sm font-bold"
        >
          Reset Grid
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          const isVisible = flipped.includes(card.id) || solved.includes(card.id);

          return (
            <button
              key={card.id}
              onClick={() => handleClick(card.id)}
              disabled={isVisible}
              className={`
                w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center transition-all duration-300 transform
                ${isVisible
                  ? 'bg-primary/20 border-2 border-primary rotate-y-180'
                  : 'bg-muted border border-border hover:border-primary/50'
                }
              `}
            >
              {isVisible ? (
                <Icon className="w-8 h-8 text-primary animate-in zoom-in spin-in-180 duration-300" />
              ) : (
                <div className="text-gray-300 font-bold text-xs">?</div>
              )}
            </button>
          );
        })}
      </div>

      {isCompleted && (
        <div className="bg-primary/20 border border-primary p-6 rounded-lg text-center animate-in slide-in-from-bottom-5">
          <h3 className="text-xl font-bold text-primary mb-2">SYSTEM UNLOCKED</h3>
          <p className="text-sm text-foreground mb-4">Memory grid cleared successfully.</p>
          <button onClick={initializeGame} className="bg-primary text-black font-bold px-6 py-2 rounded">
            NEXT LEVEL
          </button>
        </div>
      )}
    </div>
  );
}
