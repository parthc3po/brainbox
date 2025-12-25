'use client';

import PixelEditor from '@/components/features/PixelEditor';

export default function PixelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Pixel Studio</h1>
        <p className="text-muted-foreground">8-bit creativity engine.</p>
      </header>
      <PixelEditor />
    </div>
  );
}
