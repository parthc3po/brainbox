'use client';

import CodeBreaker from '@/components/features/CodeBreaker';

export default function CodePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Code Breaker</h1>
        <p className="text-muted-foreground">Decrypt the firewall password.</p>
      </header>
      <CodeBreaker />
    </div>
  );
}
