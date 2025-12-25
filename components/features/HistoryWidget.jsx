'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export default function HistoryWidget() {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // In a real app, this would fetch from /api/knowledge/history
    // For now, we will simulate the "Seed Data" behavior if empty
    const date = new Date();
    const today = `${date.getMonth() + 1}-${date.getDate()}`;

    // Quick Hack: Static seed for demo if API returns nothing (to be implemented)
    setEvent({
      year: "1990",
      event: "The first web page was served on the open internet."
    });
  }, []);

  if (!event) return null;

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-start space-x-4 shadow-sm">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        <Calendar className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-primary text-sm mb-1">Today in History</h3>
        <p className="text-xs font-mono text-secondary mb-1">{event.year}</p>
        <p className="text-sm text-foreground">{event.event}</p>
      </div>
    </div>
  );
}
