'use client';

import { useState, useEffect } from 'react';
import { Palette, Download, Save, Heart } from 'lucide-react';

const GRID_SIZE = 16;
const COLORS = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#808080'];

export default function PixelEditor() {
  const [grid, setGrid] = useState(Array(GRID_SIZE * GRID_SIZE).fill('#000000'));
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [gallery, setGallery] = useState([]);
  const [title, setTitle] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    fetch('/api/art').then(res => res.json()).then(setGallery);
  }, []);

  const handleCellClick = (index) => {
    const newGrid = [...grid];
    newGrid[index] = selectedColor;
    setGrid(newGrid);
  };

  const handleMouseEnter = (index) => {
    if (isDrawing) {
      handleCellClick(index);
    }
  };

  const saveArt = async () => {
    if (!title) return alert("Name your masterpiece!");

    const res = await fetch('/api/art', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        data: JSON.stringify(grid),
        author: 'Artist'
      })
    });

    if (res.ok) {
      const art = await res.json();
      setGallery([art, ...gallery]);
      setTitle('');
    }
  };

  const loadArt = (artData) => {
    setGrid(JSON.parse(artData));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Editor */}
      <div className="lg:col-span-2 flex flex-col items-center">
        <div className="bg-black border border-border p-4 rounded-lg shadow-2xl mb-6">
          <div
            className="grid gap-[1px] bg-gray-800"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            onMouseDown={() => setIsDrawing(true)}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
          >
            {grid.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 sm:w-8 sm:h-8 cursor-crosshair hover:opacity-80 transition-opacity"
                style={{ backgroundColor: color }}
                onMouseDown={() => handleCellClick(i)}
                onMouseEnter={() => handleMouseEnter(i)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-md">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className={`w-8 h-8 rounded-full border-2 ${selectedColor === c ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="flex space-x-4 w-full max-w-md">
          <input
            className="flex-1 bg-black/50 border border-border p-2 rounded font-mono"
            placeholder="Artwork Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button onClick={saveArt} className="bg-primary text-black font-bold px-6 rounded flex items-center">
            <Save className="w-4 h-4 mr-2" /> SAVE
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="lg:col-span-1 bg-black/40 border border-border p-4 rounded-lg overflow-y-auto max-h-[600px]">
        <h3 className="font-bold font-mono text-primary mb-4 flex items-center"><Palette className="w-4 h-4 mr-2" /> GALLERY</h3>
        <div className="grid grid-cols-2 gap-4">
          {gallery.map(art => (
            <div key={art.id} className="group relative">
              <div
                onClick={() => loadArt(art.data)}
                className="aspect-square bg-muted/20 border border-border rounded cursor-pointer overflow-hidden grid"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
              >
                {JSON.parse(art.data).map((c, i) => (
                  <div key={i} style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="mt-2 text-xs font-mono text-center truncate">{art.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
