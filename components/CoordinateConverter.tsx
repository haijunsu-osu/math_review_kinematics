
import React, { useState, useRef, useEffect } from 'react';
import { toDegrees, toRadians, round } from '../utils/mathUtils';

const CoordinateConverter: React.FC = () => {
  const [coords, setCoords] = useState({ x: 3, y: 4 });
  const [str, setStr] = useState({ x: '3', y: '4', r: '5', th: '53.13' });
  
  const svgRef = useRef<SVGSVGElement>(null);
  const size = 300;
  const center = size / 2;
  const scale = 20;

  // Sync strings with coords state (from dragging or external updates)
  useEffect(() => {
    const r = Math.sqrt(coords.x**2 + coords.y**2);
    const th = toDegrees(Math.atan2(coords.y, coords.x));
    setStr({
      x: coords.x.toString(),
      y: coords.y.toString(),
      r: round(r).toString(),
      th: round(th).toString()
    });
  }, [coords]);

  const commit = (mode: 'cartesian' | 'polar') => {
    if (mode === 'cartesian') {
      const newX = parseFloat(str.x) || 0;
      const newY = parseFloat(str.y) || 0;
      setCoords({ x: round(Math.max(-7, Math.min(7, newX))), y: round(Math.max(-7, Math.min(7, newY))) });
    } else {
      const r = parseFloat(str.r) || 0;
      const th = parseFloat(str.th) || 0;
      const rad = toRadians(th);
      setCoords({ x: round(r * Math.cos(rad)), y: round(r * Math.sin(rad)) });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, mode: 'cartesian' | 'polar') => {
    if (e.key === 'Enter') {
      commit(mode);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handlePointer = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    if (e.buttons !== 1 && e.type !== 'pointerdown') return;

    const rect = svgRef.current.getBoundingClientRect();
    const mathX = (e.clientX - rect.left - center) / scale;
    const mathY = -(e.clientY - rect.top - center) / scale;

    setCoords({ x: round(Math.max(-7, Math.min(7, mathX))), y: round(Math.max(-7, Math.min(7, mathY))) });
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const pointX = center + coords.x * scale;
  const pointY = center - coords.y * scale;
  const r = round(Math.sqrt(coords.x**2 + coords.y**2));
  const th = round(toDegrees(Math.atan2(coords.y, coords.x)));

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-slate-800">Coordinates Visualizer</h3>
          <p className="text-xs text-slate-500 italic">Drag the vector or type values and press <b>Enter</b> to sync.</p>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">Cartesian (x, y)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">X Component</label>
                  <input type="text" value={str.x} onChange={e => setStr({...str, x: e.target.value})} onBlur={() => commit('cartesian')} onKeyDown={e => handleKeyDown(e, 'cartesian')} className="w-full mt-1 px-3 py-2 border rounded-md bg-white text-slate-900 shadow-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Y Component</label>
                  <input type="text" value={str.y} onChange={e => setStr({...str, y: e.target.value})} onBlur={() => commit('cartesian')} onKeyDown={e => handleKeyDown(e, 'cartesian')} className="w-full mt-1 px-3 py-2 border rounded-md bg-white text-slate-900 shadow-sm"/>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <h4 className="font-semibold text-emerald-900 mb-2">Polar (r, θ)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Magnitude (r)</label>
                  <input type="text" value={str.r} onChange={e => setStr({...str, r: e.target.value})} onBlur={() => commit('polar')} onKeyDown={e => handleKeyDown(e, 'polar')} className="w-full mt-1 px-3 py-2 border rounded-md bg-white text-slate-900 shadow-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Angle (θ°)</label>
                  <input type="text" value={str.th} onChange={e => setStr({...str, th: e.target.value})} onBlur={() => commit('polar')} onKeyDown={e => handleKeyDown(e, 'polar')} className="w-full mt-1 px-3 py-2 border rounded-md bg-white text-slate-900 shadow-sm"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <svg ref={svgRef} width={size} height={size} className="bg-white border rounded-lg shadow-inner cursor-crosshair touch-none" onPointerDown={handlePointer} onPointerMove={handlePointer}>
            <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1"/></pattern></defs>
            <rect width={size} height={size} fill="url(#grid)" className="pointer-events-none" />
            <line x1={0} y1={center} x2={size} y2={center} stroke="#64748b" strokeWidth="2" className="pointer-events-none" />
            <line x1={center} y1={0} x2={center} y2={size} stroke="#64748b" strokeWidth="2" className="pointer-events-none" />
            <line x1={center} y1={center} x2={pointX} y2={pointY} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead)" className="pointer-events-none" />
            {r > 0 && <path d={`M ${center + 30} ${center} A 30 30 0 ${Math.abs(th) > 180 ? 1 : 0} ${th < 0 ? 1 : 0} ${center + 30 * Math.cos(toRadians(th))} ${center - 30 * Math.sin(toRadians(th))}`} fill="none" stroke="#ef4444" className="pointer-events-none" />}
            <circle cx={pointX} cy={pointY} r="8" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" className="cursor-move" />
            <text x={pointX + 10} y={pointY - 10} className="text-xs font-bold fill-slate-700 pointer-events-none">P({coords.x}, {coords.y})</text>
            <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" /></marker></defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CoordinateConverter;
