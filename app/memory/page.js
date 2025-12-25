'use client';

import MindMatch from '@/components/features/MindMatch';

export default function MemoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Mind Match</h1>
        <p className="text-muted-foreground">Pattern recognition protocol. Clear the grid.</p>
      </header>

      <MindMatch />
    </div>
  );
}
