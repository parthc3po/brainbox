'use client';

import { useState, useEffect } from 'react';
import { BarChart, Plus } from 'lucide-react';

export default function VotingSystem() {
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch('/api/vote').then(res => res.json()).then(setPolls);
  }, []);

  const createPoll = async (e) => {
    e.preventDefault();
    const validOptions = newPoll.options.filter(o => o.trim() !== '');
    if (validOptions.length < 2) return alert("Need at least 2 options!");

    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: newPoll.question, options: validOptions })
    });

    if (res.ok) {
      const poll = await res.json();
      setPolls([...polls, poll]);
      setIsCreating(false);
      setNewPoll({ question: '', options: ['', ''] });
    }
  };

  const vote = async (pollIndex, optionId) => {
    // Optimistic Update
    const updatedPolls = [...polls];
    const poll = updatedPolls[pollIndex];
    const option = poll.options.find(o => o.id === optionId);
    option.votes += 1;
    setPolls(updatedPolls);

    await fetch('/api/vote', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId })
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold font-mono text-primary">DEMOCRACY_PROTOCOL</h2>
        <button onClick={() => setIsCreating(!isCreating)} className="bg-primary text-black font-bold px-4 py-2 rounded font-mono flex items-center text-sm">
          <Plus className="w-4 h-4 mr-2" /> NEW POLL
        </button>
      </div>

      {isCreating && (
        <div className="bg-black/40 border border-primary/50 p-6 rounded-lg mb-8 animate-in slide-in-from-top-4">
          <input
            className="w-full bg-black/50 border border-border p-2 mb-4 rounded font-mono"
            placeholder="Question (e.g., Movie Night?)"
            value={newPoll.question}
            onChange={e => setNewPoll({ ...newPoll, question: e.target.value })}
          />
          {newPoll.options.map((opt, i) => (
            <input
              key={i}
              className="w-full bg-black/50 border border-border p-2 mb-2 rounded font-mono text-sm"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={e => {
                const newOpts = [...newPoll.options];
                newOpts[i] = e.target.value;
                setNewPoll({ ...newPoll, options: newOpts });
              }}
            />
          ))}
          <button onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })} className="text-xs text-secondary hover:underline mb-4 block">+ Add Option</button>
          <button onClick={createPoll} className="w-full bg-primary/20 text-primary border border-primary py-2 rounded font-bold font-mono">
            INITIATE VOTE
          </button>
        </div>
      )}

      <div className="grid gap-8">
        {polls.map((poll, pIndex) => {
          const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

          return (
            <div key={poll.id} className="bg-black/40 border border-border p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-foreground mb-4">{poll.question}</h3>
              <div className="space-y-3">
                {poll.options.map(opt => {
                  const percent = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                  return (
                    <div key={opt.id} onClick={() => vote(pIndex, opt.id)} className="relative group cursor-pointer">
                      <div className="flex justify-between text-sm font-mono mb-1 z-10 relative pointer-events-none">
                        <span>{opt.text}</span>
                        <span>{opt.votes} ({Math.round(percent)}%)</span>
                      </div>
                      <div className="h-8 bg-muted/20 rounded overflow-hidden relative border border-white/5 group-hover:border-primary/50 transition-colors">
                        <div
                          className="h-full bg-primary/40 transition-all duration-500 ease-out"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 text-xs font-mono text-muted-foreground text-right">{totalVotes} VOTES CAST</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
