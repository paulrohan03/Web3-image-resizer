import React from 'react';

export default function ResizeControls({ w, h, setW, setH }) {
  return (
    <div className="resize-controls">
      <label>
        Width (px):
        <input type="number" value={w} onChange={e => setW(+e.target.value)} />
      </label>
      <label>
        Height (px):
        <input type="number" value={h} onChange={e => setH(+e.target.value)} />
      </label>
    </div>
  );
}
