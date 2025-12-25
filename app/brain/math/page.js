'use client';

import SpeedMath from '@/components/features/SpeedMath';
import { useState, useEffect } from 'react';

export default function MathPage() {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    fetch('/api/scores?game=SPEED_MATH')
      .then(res => res.json())
      .then(setHighScores);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-primary mb-2">Mental Math Training</h1>
        <p className="text-muted-foreground">High-velocity arithmetic training.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <SpeedMath />
        </div>
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-secondary mb-4 border-b border-gray-100 pb-2">Top Scores</h3>
            <div className="space-y-2">
              {highScores.map((s, i) => (
                <div key={s.id} className="flex justify-between text-sm font-medium py-2">
                  <span className="text-muted-foreground">{i + 1}. {s.player}</span>
                  <span className="text-primary">{s.score}</span>
                </div>
              ))}
              {highScores.length === 0 && <span className="text-xs text-muted-foreground">NO DATA LOGGED</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
