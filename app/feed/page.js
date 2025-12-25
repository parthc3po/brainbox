'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, PlusCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function FeedPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to load feed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const handleAddToMission = async (item) => {
    const missionData = {
      title: `Investigate: ${item.title.substring(0, 50)}...`,
      description: `Read and analyze this article from ${item.source}.\n\nLink: ${item.link}\n\nSummary: ${item.content?.substring(0, 200)}...`,
      category: 'Research',
      xpReward: 15,
      tools: ['Browser']
    };

    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(missionData),
      });
      if (res.ok) {
        alert("Mission Added to Log!"); // Simple feedback for now
      }
    } catch (e) {
      console.error("Failed to add mission", e);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Global Comms</h1>
          <p className="text-muted-foreground">inbound data streams from scientific sector.</p>
        </div>
        <button
          onClick={fetchFeeds}
          disabled={loading}
          className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
        >
          <RefreshCw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && items.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400 font-medium">
            ESTABLISHING UPLINK...
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="bg-muted/10 border border-border p-5 rounded-lg hover:border-primary/40 transition-colors flex flex-col h-full">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-secondary px-2 py-0.5 border border-secondary/20 rounded-full bg-secondary/10">
                  {item.source}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {new Date(item.pubDate).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-bold text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors">
                <Link href={item.link} target="_blank">{item.title}</Link>
              </h3>

              <p className="text-sm text-muted-foreground font-sans line-clamp-3 mb-4 flex-grow">
                {item.content}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <Link href={item.link} target="_blank" className="text-primary hover:underline text-xs font-bold flex items-center">
                  READ_SOURCE <ExternalLink className="w-3 h-3 ml-1" />
                </Link>

                <button
                  onClick={() => handleAddToMission(item)}
                  className="flex items-center space-x-1 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs px-3 py-1.5 rounded-lg transition-colors font-bold shadow-sm"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>MAKE MISSION</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
