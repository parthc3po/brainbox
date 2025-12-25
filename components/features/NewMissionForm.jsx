'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const CATEGORIES = ['Logic', 'Science', 'Coding', 'Research', 'System'];

export default function NewMissionForm({ onMissionCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Coding',
    xpReward: 10,
    tools: '' // comma separated string for simplicity
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const toolsArray = formData.tools.split(',').map(t => t.trim()).filter(t => t);

      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tools: toolsArray }),
      });

      if (res.ok) {
        const newMission = await res.json();
        onMissionCreated(newMission);
        setIsOpen(false);
        setFormData({ title: '', description: '', category: 'Coding', xpReward: 10, tools: '' });
      }
    } catch (error) {
      console.error('Failed to create mission', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center space-x-2 font-medium"
      >
        <Plus className="w-5 h-5" />
        <span>ASSIGN NEW MISSION</span>
      </button>
    );
  }

  return (
    <div className="bg-muted/30 border border-primary/20 rounded-lg p-6 mb-8 relative animate-in fade-in zoom-in-95 duration-200">
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-lg font-bold text-primary mb-4">New Mission Parameters</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase text-gray-500 mb-1 font-bold">Mission Title</label>
          <input
            required
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. Operation Python Basics"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1 font-bold">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1 font-bold">XP Reward</label>
            <input
              type="number"
              value={formData.xpReward}
              onChange={e => setFormData({ ...formData, xpReward: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase text-gray-500 mb-1 font-bold">Required Tools (Comma separated)</label>
          <input
            type="text"
            value={formData.tools}
            onChange={e => setFormData({ ...formData, tools: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            placeholder="e.g. VS Code, Terminal, Brain"
          />
        </div>

        <div>
          <label className="block text-xs uppercase text-gray-500 mb-1 font-bold">Mission Briefing</label>
          <textarea
            required
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-foreground focus:border-primary focus:outline-none h-24"
            placeholder="Describe the objectives..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-buttons uppercase disabled:opacity-50 shadow-md"
        >
          {loading ? 'Initializing...' : 'Upload Mission'}
        </button>
      </form>
    </div>
  );
}
