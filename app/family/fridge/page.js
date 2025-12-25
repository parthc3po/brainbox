'use client';
import FridgeMagnet from '@/components/features/FridgeMagnet';
export default function FridgePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Family Comm Hub</h1>
        <p className="text-muted-foreground">Digital Refrigerator Surface.</p>
      </header>
      <FridgeMagnet />
    </div>
  );
}
