'use client';

import { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Wifi } from 'lucide-react';

export default function SystemStatus() {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    // Mock uptime counter
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border border-primary/30 bg-black/40 rounded-lg p-4 font-mono text-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-primary font-bold uppercase tracking-widest text-xs">System Status</h4>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs uppercase">Uptime</span>
          <span className="text-foreground font-bold">{formatTime(uptime)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs uppercase">Security</span>
          <div className="flex items-center text-primary">
            <ShieldCheck className="w-3 h-3 mr-1" />
            <span>SECURE</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs uppercase">Network</span>
          <div className="flex items-center text-primary">
            <Wifi className="w-3 h-3 mr-1" />
            <span>ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
