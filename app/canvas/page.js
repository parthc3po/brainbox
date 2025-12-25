'use client';

import CyberCanvas from '@/components/features/CyberCanvas';

export default function CanvasPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-mono text-primary mb-2">CYBER_CANVAS</h1>
        <p className="text-muted-foreground">Digital drafting table. Create schematic masterpieces.</p>
      </header>

      <CyberCanvas />
    </div>
  );
}
