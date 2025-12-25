'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Book, ChevronRight, Search } from 'lucide-react';
import HistoryWidget from '@/components/features/HistoryWidget';

const CATEGORIES = ["Space", "Deep Sea", "Coding", "History", "Mechanics"];

export default function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState("Space");
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    fetch(`/api/knowledge?category=${activeCategory}`)
      .then(res => res.json())
      .then(setTopics);
  }, [activeCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Knowledge Vault</h1>
          <p className="text-muted-foreground">The library of the universe.</p>
        </div>
        <div className="w-full md:w-auto">
          <HistoryWidget />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
            <h3 className="font-bold text-primary mb-4 text-sm uppercase tracking-wide">Select Sector</h3>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSelectedTopic(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${activeCategory === cat ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <span>{cat}</span>
                  {activeCategory === cat && <ChevronRight className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-9">
          {selectedTopic ? (
            <div className="bg-white border border-gray-200 p-8 rounded-2xl min-h-[500px] shadow-sm">
              <button onClick={() => setSelectedTopic(null)} className="text-xs text-secondary hover:text-primary mb-4 font-bold flex items-center">
                &larr; RETURN TO INDEX
              </button>
              <h2 className="text-3xl font-bold text-foreground mb-6 pb-4 border-b border-gray-100">{selectedTopic.title}</h2>
              <div className="prose prose-invert prose-green max-w-none">
                <ReactMarkdown>{selectedTopic.content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search / Filter bar could go here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.length > 0 ? topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className="bg-white border border-gray-200 hover:border-primary/50 p-6 rounded-xl text-left transition-all group hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Book className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-500">{topic.category}</span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary mb-2 line-clamp-1">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {topic.content.substring(0, 100)}...
                    </p>
                  </button>
                )) : (
                  <div className="col-span-2 text-center py-20 border border-dashed border-border rounded-lg text-muted-foreground">
                    NO DATA IN SECTOR '{activeCategory.toUpperCase()}'
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
