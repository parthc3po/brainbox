'use client';

import { useRef, useState, useEffect } from 'react';
import { Save, Trash2, Undo } from 'lucide-react';

export default function CyberCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#00ff41'); // Neon Green
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = `cyber-art-${Date.now()}.png`;
    link.href = image;
    link.click();
  };

  const colors = ['#00ff41', '#00f3ff', '#bd00ff', '#ff0055', '#ffff00', '#ffffff'];

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="flex justify-between items-center p-4 bg-muted/40 border-b border-border">
        <div className="flex space-x-2">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-white' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="range" min="1" max="20"
            value={brushSize} onChange={(e) => setBrushSize(e.target.value)}
            className="w-24 accent-primary"
          />
          <span className="text-xs font-bold text-gray-500">SIZE: {brushSize}</span>
        </div>

        <div className="flex space-x-2">
          <button onClick={clearCanvas} className="p-2 hover:text-destructive transition-colors"><Trash2 className="w-5 h-5" /></button>
          <button onClick={saveDrawing} className="p-2 hover:text-primary transition-colors"><Save className="w-5 h-5" /></button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="flex-1 w-full touch-none cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}
