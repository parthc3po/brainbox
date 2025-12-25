'use client';

import { useState, useEffect } from 'react';
import { StickyNote } from 'lucide-react';

const COLORS = ["#00ff41", "#00f3ff", "#ff0055", "#ffff00"];

export default function FridgeMagnet() {
  const [shouts, setShouts] = useState([]);
  const [input, setInput] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    fetch('/api/fridge').then(res => res.json()).then(setShouts);
  }, []);

  const postShout = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const res = await fetch('/api/fridge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, author: 'Family', color })
    });

    if (res.ok) {
      const newItem = await res.json();
      setShouts([newItem, ...shouts]);
      setInput('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm h-fit">
        <h3 className="font-bold text-primary mb-4 text-lg">Post a Note</h3>
        <form onSubmit={postShout}>
          <textarea
            className="w-full h-32 bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm mb-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Msg..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-muted-foreground">COLOR:</span>
            <div className="flex space-x-2">
              {COLORS.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full ${color === c ? 'ring-2 ring-white' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-black font-bold py-2 rounded font-mono hover:scale-105 transition-transform">
            STICK IT
          </button>
        </form>
      </div>

      {/* Board */}
      <div className="md:col-span-2 bg-muted/5 border border-dashed border-white/10 rounded-lg p-8 min-h-[500px]">
        <div className="flex flex-wrap gap-6 justify-center">
          {shouts.map(shout => (
            <div
              key={shout.id}
              className="w-48 h-48 p-4 shadow-lg transform hover:scale-110 transition-transform duration-300 text-gray-800 font-bold flex items-center justify-center text-center relative pointer-events-auto rounded-xl"
              style={{ backgroundColor: shout.color, transform: `rotate(${Math.random() * 10 - 5}deg)` }}
            >
              <div className="absolute -top-3 w-4 h-12 bg-black/10 transform rotate-45 backdrop-blur-sm rounded-full"></div>
              "{shout.message}"
            </div>
          ))}
          {shouts.length === 0 && <span className="text-muted-foreground self-center">THE FRIDGE IS EMPTY</span>}
        </div>
      </div>
    </div>
  );
}
