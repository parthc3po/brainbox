'use client';

import { useState, useEffect } from 'react';
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import { Lock, Unlock, FileText } from 'lucide-react';

export default function JournalApp() {
  const [entries, setEntries] = useState([]);
  const [key, setKey] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });

  useEffect(() => {
    fetch('/api/journal').then(res => res.json()).then(setEntries);
  }, []);

  const unlock = (e) => {
    e.preventDefault();
    if (key.length > 0) setUnlocked(true);
  };

  const saveEntry = async () => {
    if (!newEntry.title || !newEntry.content) return;

    const encrypted = AES.encrypt(newEntry.content, key).toString();

    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newEntry.title, content: encrypted })
    });

    if (res.ok) {
      const entry = await res.json();
      setEntries([entry, ...entries]);
      setNewEntry({ title: '', content: '' });
    }
  };

  const decrypt = (cipher) => {
    try {
      const bytes = AES.decrypt(cipher, key);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText || "ERROR: WRONG KEY";
    } catch (e) {
      return "DECRYPTION FAILED";
    }
  };

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-primary/30 rounded-lg p-8 bg-black/40">
        <Lock className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-2xl font-bold font-mono text-primary mb-4">RESTRICTED_ACCESS</h2>
        <form onSubmit={unlock} className="space-y-4 w-full max-w-xs">
          <input
            type="password"
            placeholder="Enter Security Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-black/50 border border-border p-2 rounded text-center font-mono"
          />
          <button type="submit" className="w-full bg-primary text-black font-bold py-2 rounded font-mono hover:bg-primary/80">
            AUTHENTICATE
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-black/40 border border-border p-6 rounded-lg">
        <h3 className="font-bold font-mono text-primary mb-4 flex items-center"><FileText className="w-4 h-4 mr-2" /> NEW ENTRY</h3>
        <input
          className="w-full bg-black/50 border border-border p-2 mb-2 rounded font-mono"
          placeholder="Title"
          value={newEntry.title}
          onChange={e => setNewEntry({ ...newEntry, title: e.target.value })}
        />
        <textarea
          className="w-full h-48 bg-black/50 border border-border p-2 mb-4 rounded font-mono text-sm"
          placeholder="Write your thoughts..."
          value={newEntry.content}
          onChange={e => setNewEntry({ ...newEntry, content: e.target.value })}
        />
        <button onClick={saveEntry} className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 py-2 rounded font-mono">
          ENCRYPT & SAVE
        </button>
      </div>

      <div className="space-y-4">
        {entries.map(e => (
          <div key={e.id} className="bg-muted/10 border border-border p-4 rounded-lg">
            <h4 className="font-bold text-foreground mb-1">{e.title}</h4>
            <span className="text-xs text-muted-foreground block mb-2">{new Date(e.createdAt).toLocaleDateString()}</span>
            <p className="text-sm font-mono text-secondary whitespace-pre-wrap">
              {decrypt(e.content)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
