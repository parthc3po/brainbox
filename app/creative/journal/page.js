'use client';

import JournalApp from '@/components/features/JournalApp';

export default function JournalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Private Logs</h1>
        <p className="text-muted-foreground">AES-256 Encrypted Personal Database.</p>
      </header>
      <JournalApp />
    </div>
  );
}
