'use client';

import { useState, useEffect } from 'react';
import { SimpleCrypto } from '@/lib/crypto';
import { Lock, Unlock, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

export default function VaultPage() {
  const [secrets, setSecrets] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // New Secret Form
  const [key, setKey] = useState(''); // Master Key for current session (or per item)

  // Form State
  const [formData, setFormData] = useState({ title: '', content: '', key: '' });

  // View State
  const [decryptedView, setDecryptedView] = useState({}); // Map of id -> boolean

  useEffect(() => {
    fetch('/api/vault')
      .then(res => res.json())
      .then(data => setSecrets(data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.key) {
      alert("Encryption Key Required!");
      return;
    }

    const encrypted = SimpleCrypto.encrypt(formData.content, formData.key);

    const res = await fetch('/api/vault', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        encryptedContent: encrypted
      })
    });

    if (res.ok) {
      const newSecret = await res.json();
      setSecrets([newSecret, ...secrets]);
      setIsOpen(false);
      setFormData({ title: '', content: '', key: '' });
    }
  };

  const toggleDecrypt = (id, encryptedContent) => {
    const isVisible = decryptedView[id];
    if (isVisible) {
      const newView = { ...decryptedView };
      delete newView[id];
      setDecryptedView(newView);
    } else {
      const userKey = prompt("ENTER DECRYPTION KEY:");
      if (userKey) {
        const decrypted = SimpleCrypto.decrypt(encryptedContent, userKey);
        // Verify if it looks like valid text (heuristic)
        setDecryptedView({ ...decryptedView, [id]: decrypted });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">The Vault</h1>
        <p className="text-muted-foreground">Encrypted secure storage. Client-side encryption active.</p>
      </header>

      {isOpen ? (
        <div className="bg-muted/10 border border-primary/50 p-6 rounded-lg mb-8 animate-in slide-in-from-top-4">
          <h3 className="font-bold text-primary mb-4 text-lg">New Encrypted Entry</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              placeholder="Subject / Title"
              className="w-full bg-white border border-gray-200 p-2 rounded-lg text-foreground focus:border-primary focus:outline-none"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              placeholder="Content to Encrypt..."
              className="w-full bg-white border border-gray-200 p-2 rounded-lg text-foreground focus:border-primary focus:outline-none h-32"
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
            />
            <input
              type="password"
              placeholder="Encryption Key (Don't forget this!)"
              className="w-full bg-white border border-secondary/30 p-2 rounded-lg text-foreground focus:border-secondary focus:outline-none ring-1 ring-secondary/20"
              value={formData.key}
              onChange={e => setFormData({ ...formData, key: e.target.value })}
            />
            <div className="flex space-x-4">
              <button type="submit" className="flex-1 bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary/90 shadow-md">
                ENCRYPT & SAVE
              </button>
              <button type="button" onClick={() => setIsOpen(false)} className="px-6 border border-border rounded hover:bg-muted text-muted-foreground">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center space-x-2 font-medium mb-8"
        >
          <Lock className="w-5 h-5" />
          <span>SECURE NEW DATA</span>
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {secrets.map(secret => {
          const decryptedContent = decryptedView[secret.id];

          return (
            <div key={secret.id} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-800">{secret.title}</h3>
                <Lock className={`w-4 h-4 ${decryptedContent ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4 text-xs break-all relative group text-gray-500 font-mono">
                {decryptedContent ? (
                  <span className="text-primary">{decryptedContent}</span>
                ) : (
                  <span className="text-muted-foreground opacity-50 blur-[2px] select-none hover:blur-none transition-all">
                    {secret.encryptedContent}
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleDecrypt(secret.id, secret.encryptedContent)}
                className="w-full border border-gray-200 hover:bg-gray-50 text-xs font-medium py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-gray-600"
              >
                {decryptedContent ? (
                  <>
                    <EyeOff className="w-3 h-3" /> <span>LOCK</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3" /> <span>DECRYPT</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}
