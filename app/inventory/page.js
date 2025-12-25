'use client';

import { useState, useEffect } from 'react';
import { Box, Plus, Minus, Trash2 } from 'lucide-react';

const CATEGORIES = ['Board', 'Sensor', 'Cable', 'Tool', 'Part', 'Other'];

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Part', quantity: 1, notes: '' });

  useEffect(() => {
    fetch('/api/inventory').then(res => res.json()).then(setItems);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const newItem = await res.json();
      setItems([...items, newItem]);
      setIsOpen(false);
      setFormData({ name: '', category: 'Part', quantity: 1, notes: '' });
    }
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty < 0) return;
    // Optimistic update
    setItems(items.map(i => i.id === id ? { ...i, quantity: newQty } : i));

    await fetch(`/api/inventory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty })
    });
  };

  const deleteItem = async (id) => {
    if (!confirm("Remove this item from database?")) return;
    setItems(items.filter(i => i.id !== id));
    await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Supply Depot</h1>
        <p className="text-muted-foreground">Logistics and hardware tracking.</p>
      </header>

      {isOpen ? (
        <div className="bg-muted/10 border border-primary/50 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-primary mb-4 text-lg">Log New Equipment</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground">Item Name</label>
              <input
                className="w-full bg-white border border-gray-200 p-2 rounded-lg text-foreground focus:border-primary focus:outline-none"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Category</label>
              <select
                className="w-full bg-white border border-gray-200 p-2 rounded-lg text-foreground focus:border-primary focus:outline-none"
                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Qty</label>
              <input
                type="number"
                className="w-full bg-white border border-gray-200 p-2 rounded-lg text-foreground focus:border-primary focus:outline-none"
                value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div className="md:col-span-4 flex justify-end space-x-2 mt-4">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm">Cancel</button>
              <button type="submit" className="bg-primary text-black font-bold px-6 py-2 rounded">ADD ITEM</button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="mb-8 bg-secondary/10 text-secondary hover:bg-secondary/20 px-4 py-2 rounded-lg font-bold flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> LOG EQUIPMENT
        </button>
      )}

      <div className="bg-black/40 border border-border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4">ITEM NAME</th>
              <th className="p-4">CATEGORY</th>
              <th className="p-4 text-center">QUANTITY</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors text-sm border-t border-gray-100">
                <td className="p-4 font-bold text-foreground">{item.name}</td>
                <td className="p-4">
                  <span className="bg-muted rounded px-2 py-0.5 text-xs">{item.category}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-primary"><Minus className="w-3 h-3" /></button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-primary"><Plus className="w-3 h-3" /></button>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">Inventory Empty</div>
        )}
      </div>
    </div>
  );
}
