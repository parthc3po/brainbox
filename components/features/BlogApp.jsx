'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Newspaper, PenTool } from 'lucide-react';

export default function BlogApp() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('LIST'); // LIST, CREATE, READ
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', author: '' });

  useEffect(() => {
    fetch('/api/blog').then(res => res.json()).then(setPosts);
  }, [view]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ title: '', content: '', author: '' });
    setView('LIST');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-6 h-6 text-primary" />
          <button onClick={() => setView('LIST')} className="text-xl font-bold font-mono text-foreground hover:text-primary">
            THE_FAMILY_CHRONICLE
          </button>
        </div>
        {view === 'LIST' && (
          <button onClick={() => setView('CREATE')} className="bg-primary text-black font-bold px-4 py-2 rounded font-mono flex items-center">
            <PenTool className="w-4 h-4 mr-2" /> WRITE ARTICLE
          </button>
        )}
      </div>

      {view === 'LIST' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <button
              key={post.id}
              onClick={() => { setSelectedPost(post); setView('READ'); }}
              className="bg-black/40 border border-border p-6 rounded-lg text-left hover:border-primary/50 transition-colors group"
            >
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary mb-2 line-clamp-1">{post.title}</h3>
              <div className="text-xs font-mono text-muted-foreground mb-4">
                By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <p className="text-sm text-secondary line-clamp-3 opacity-70">
                {post.content}
              </p>
            </button>
          ))}
          {posts.length === 0 && (
            <div className="col-span-2 text-center py-20 bg-muted/10 rounded-lg text-muted-foreground border-2 border-dashed border-border">
              NO NEWS IS GOOD NEWS? WRITE SOMETHING!
            </div>
          )}
        </div>
      )}

      {view === 'CREATE' && (
        <div className="bg-black/40 border border-border p-8 rounded-lg">
          <h2 className="text-2xl font-bold font-mono text-primary mb-6">SUBMIT_REPORT</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                className="bg-black/50 border border-border p-3 rounded font-mono"
                placeholder="Headline"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              <input
                className="bg-black/50 border border-border p-3 rounded font-mono"
                placeholder="Reporter Name"
                required
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
            <textarea
              className="w-full h-64 bg-black/50 border border-border p-3 rounded font-mono"
              placeholder="Article Content (Markdown Supported)..."
              required
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
            />
            <div className="flex space-x-4 justify-end">
              <button type="button" onClick={() => setView('LIST')} className="px-6 py-2 border border-border rounded text-muted-foreground hover:bg-muted">
                CANCEL
              </button>
              <button type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded hover:scale-105 transition-transform">
                PUBLISH
              </button>
            </div>
          </form>
        </div>
      )}

      {view === 'READ' && selectedPost && (
        <div className="bg-black/40 border border-border p-8 rounded-lg animate-in slide-in-from-right-4">
          <button onClick={() => setView('LIST')} className="mb-6 text-sm text-muted-foreground hover:text-primary font-mono">
            &larr; BACK TO FEED
          </button>
          <article className="prose prose-invert prose-green max-w-none">
            <h1>{selectedPost.title}</h1>
            <p className="text-xs font-mono text-muted-foreground border-b border-border pb-4">
              Reported by <span className="text-primary">{selectedPost.author}</span> on {new Date(selectedPost.createdAt).toLocaleDateString()}
            </p>
            <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
          </article>
        </div>
      )}
    </div>
  );
}
