'use client';

import TicTacToe from '@/components/features/TicTacToe';

export default function TicTacToePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-mono text-primary mb-2">CYBER_DUEL</h1>
        <p className="text-muted-foreground">Logic battle against the mainframe.</p>
      </header>

      <TicTacToe />
    </div>
  );
}
