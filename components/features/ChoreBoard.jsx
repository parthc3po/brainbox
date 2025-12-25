'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Plus } from 'lucide-react';

export default function ChoreBoard() {
  const [chores, setChores] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for demo
  const [newChore, setNewChore] = useState({ title: '', xp: 10, to: 'Hacker' });

  useEffect(() => {
    fetch('/api/chores').then(res => res.json()).then(setChores);
  }, []);

  const addChore = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/chores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newChore.title, xpReward: newChore.xp, assignedTo: newChore.to })
    });
    if (res.ok) {
      const item = await res.json();
      setChores([item, ...chores]);
      setNewChore({ title: '', xp: 10, to: 'Hacker' });
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING';
    // Optimistic
    setChores(chores.map(c => c.id === id ? { ...c, status: newStatus } : c));

    await fetch('/api/chores', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Daily Chores</h2>
        <button onClick={() => setIsAdmin(!isAdmin)} className="text-xs text-muted-foreground border border-gray-200 px-2 py-1 rounded bg-gray-50 hover:bg-gray-100">
          MODE: {isAdmin ? 'ADMIN' : 'USER'}
        </button>
      </div>

      {isAdmin && (
        <form onSubmit={addChore} className="bg-muted/10 p-4 rounded-lg mb-8 flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-500">Task</label>
            <input className="w-full bg-white border border-gray-200 p-2 rounded-lg" value={newChore.title} onChange={e => setNewChore({ ...newChore, title: e.target.value })} required />
          </div>
          <div className="w-24">
            <label className="text-xs font-medium text-gray-500">XP Value</label>
            <input type="number" className="w-full bg-white border border-gray-200 p-2 rounded-lg" value={newChore.xp} onChange={e => setNewChore({ ...newChore, xp: e.target.value })} />
          </div>
          <button type="submit" className="bg-primary text-black font-bold p-2.5 rounded"><Plus className="w-5 h-5" /></button>
        </form>
      )}

      <div className="space-y-4">
        {chores.map(chore => (
          <div key={chore.id} className={`flex items-center justify-between p-4 border rounded-xl transition-all shadow-sm ${chore.status === 'COMPLETED' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-4">
              <button onClick={() => toggleStatus(chore.id, chore.status)} className="text-primary hover:scale-110 transition-transform">
                {chore.status === 'COMPLETED' ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>
              <div>
                <h3 className={`font-bold text-lg ${chore.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{chore.title}</h3>
                <span className="text-xs text-secondary font-medium">Assigned to: {chore.assignedTo} • {chore.xpReward} XP</span>
              </div>
            </div>
          </div>
        ))}
        {chores.length === 0 && <div className="text-center text-muted-foreground py-10">NO PENDING ORDERS. RELAX.</div>}
      </div>
    </div>
  );
}
