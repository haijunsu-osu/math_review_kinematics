
import React, { useState, useRef, useEffect } from 'react';
import { round, toDegrees, toRadians } from '../utils/mathUtils';

const VectorAlgebra: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'dist'>('add');
  const svgRef = useRef<SVGSVGElement>(null);
  
  // State for Vector Addition (Cartesian source of truth)
  const [v1, setV1] = useState({ x: 3, y: 2 });
  const [v2, setV2] = useState({ x: 2, y: 4 });
  
  // Local string inputs for Vector A & B to allow arbitrary typing
  const [v1Str, setV1Str] = useState({ x: '3', y: '2', r: '3.61', th: '33.69' });
  const [v2Str, setV2Str] = useState({ x: '2', y: '4', r: '4.47', th: '63.43' });

  // State for Distance Points
  const [p1, setP1] = useState({ x: -2, y: -2 });
  const [p2, setP2] = useState({ x: 4, y: 3 });
  const [p1Str, setP1Str] = useState({ x: '-2', y: '-2' });
  const [p2Str, setP2Str] = useState({ x: '4', y: '3' });

  // Sync string inputs when coordinate state changes (e.g., from dragging)
  useEffect(() => {
    const r1 = Math.sqrt(v1.x**2 + v1.y**2);
    const th1 = toDegrees(Math.atan2(v1.y, v1.x));
    setV1Str({ x: v1.x.toString(), y: v1.y.toString(), r: round(r1).toString(), th: round(th1).toString() });
  }, [v1]);

  useEffect(() => {
    const r2 = Math.sqrt(v2.x**2 + v2.y**2);
    const th2 = toDegrees(Math.atan2(v2.y, v2.x));
    setV2Str({ x: v2.x.toString(), y: v2.y.toString(), r: round(r2).toString(), th: round(th2).toString() });
  }, [v2]);

  useEffect(() => {
    setP1Str({ x: p1.x.toString(), y: p1.y.toString() });
  }, [p1]);

  useEffect(() => {
    setP2Str({ x: p2.x.toString(), y: p2.y.toString() });
  }, [p2]);

  // Handle committing values from inputs
  const commitV1 = (mode: 'cartesian' | 'polar') => {
    if (mode === 'cartesian') {
      setV1({ x: parseFloat(v1Str.x) || 0, y: parseFloat(v1Str.y) || 0 });
    } else {
      const r = parseFloat(v1Str.r) || 0;
      const th = parseFloat(v1Str.th) || 0;
      const rad = toRadians(th);
      setV1({ x: round(r * Math.cos(rad)), y: round(r * Math.sin(rad)) });
    }
  };

  const commitV2 = (mode: 'cartesian' | 'polar') => {
    if (mode === 'cartesian') {
      setV2({ x: parseFloat(v2Str.x) || 0, y: parseFloat(v2Str.y) || 0 });
    } else {
      const r = parseFloat(v2Str.r) || 0;
      const th = parseFloat(v2Str.th) || 0;
      const rad = toRadians(th);
      setV2({ x: round(r * Math.cos(rad)), y: round(r * Math.sin(rad)) });
    }
  };

  const commitP1 = () => setP1({ x: parseFloat(p1Str.x) || 0, y: parseFloat(p1Str.y) || 0 });
  const commitP2 = () => setP2({ x: parseFloat(p2Str.x) || 0, y: parseFloat(p2Str.y) || 0 });

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter') {
      callback();
      (e.target as HTMLInputElement).blur();
    }
  };

  // Dragging state
  const [dragging, setDragging] = useState<string | null>(null);

  const size = 350;
  const center = size / 2;
  const scale = 25;

  const vR = { x: v1.x + v2.x, y: v1.y + v2.y };
  const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragging(id);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mathX = round((e.clientX - rect.left - center) / scale);
    const mathY = round(-(e.clientY - rect.top - center) / scale);

    if (activeTab === 'add') {
      if (dragging === 'v1') setV1({ x: mathX, y: mathY });
      else if (dragging === 'v2') setV2({ x: mathX - v1.x, y: mathY - v1.y });
    } else {
      if (dragging === 'p1') setP1({ x: mathX, y: mathY });
      else if (dragging === 'p2') setP2({ x: mathX, y: mathY });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveTab('add')} className={`flex-1 py-3 font-semibold text-sm ${activeTab === 'add' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>Vector Addition</button>
        <button onClick={() => setActiveTab('dist')} className={`flex-1 py-3 font-semibold text-sm ${activeTab === 'dist' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>Distance Between Points</button>
      </div>

      <div className="p-6">
        {activeTab === 'add' ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 space-y-4">
              <h3 className="font-bold text-lg text-slate-800">Vector Addition Tools</h3>
              <p className="text-xs text-slate-600 italic">Press <b>Enter</b> to confirm changes and sync coordinate systems.</p>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="font-bold text-blue-900 text-sm mb-3">Vector A</div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[10px] font-bold text-blue-700 uppercase">Cartesian x</label>
                    <input type="text" value={v1Str.x} onChange={e => setV1Str({...v1Str, x: e.target.value})} onBlur={() => commitV1('cartesian')} onKeyDown={e => handleKeyDown(e, () => commitV1('cartesian'))} className="w-full p-2 border rounded text-sm bg-white text-slate-900 shadow-sm"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-blue-700 uppercase">Cartesian y</label>
                    <input type="text" value={v1Str.y} onChange={e => setV1Str({...v1Str, y: e.target.value})} onBlur={() => commitV1('cartesian')} onKeyDown={e => handleKeyDown(e, () => commitV1('cartesian'))} className="w-full p-2 border rounded text-sm bg-white text-slate-900 shadow-sm"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-blue-700 uppercase">Magnitude r</label>
                    <input type="text" value={v1Str.r} onChange={e => setV1Str({...v1Str, r: e.target.value})} onBlur={() => commitV1('polar')} onKeyDown={e => handleKeyDown(e, () => commitV1('polar'))} className="w-full p-2 border rounded text-sm bg-white text-slate-900 shadow-sm"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-blue-700 uppercase">Angle θ°</label>
                    <input type="text" value={v1Str.th} onChange={e => setV1Str({...v1Str, th: e.target.value})} onBlur={() => commitV1('polar')} onKeyDown={e => handleKeyDown(e, () => commitV1('polar'))} className="w-full p-2 border rounded text-sm bg-white text-slate-900 shadow-sm"/>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="font-bold text-indigo-900 text-sm mb-3">Vector B</div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[10px] font-bold text-indigo-700 uppercase">Cartesian x</label>
                    <input type="text" value={v2Str.x} onChange={e => setV2Str({...v2Str, x: e.target.value})} onBlur={() => commitV2('cartesian')} onKeyDown={e => handleKeyDown(e, () => commitV2('cartesian'))} className="w-full p-2 border rounded text-sm bg-white text-slate-900 shadow-sm"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-indigo-700 uppercase">Cartesian y</label>
                    <input type="text" value={v2Str.y} onChange={e => setV2Str({...v2Str, y: e.target.value})} onBlur={() => commitV2('cartesian')} onKeyDown={e => handleKeyDown(e, () => commitV2('cartesian'))} className="w-full p-2 border rounded text-sm bg-white text-slate-900 shadow-sm"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-indigo-700 uppercase">Magnitude r</label>
                    <input type="text" value={v2Str.r} onChange={e => setV2Str({...v2Str, r: e.target.value})} onBlur={() => commitV2('polar')} onKeyDown={e => handleKeyDown(e, () => commitV2('polar'))} className="w-full p-2 border rounded text-sm bg-white text-slate-900 shadow-sm"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-indigo-700 uppercase">Angle θ°</label>
                    <input type="text" value={v2Str.th} onChange={e => setV2Str({...v2Str, th: e.target.value})} onBlur={() => commitV2('polar')} onKeyDown={e => handleKeyDown(e, () => commitV2('polar'))} className="w-full p-2 border rounded text-sm bg-white text-slate-900 shadow-sm"/>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 shadow-sm">
                <div className="font-bold text-emerald-900 text-xs mb-1 uppercase tracking-wider">Resultant R = A + B</div>
                <div className="flex justify-between items-end font-mono">
                  <div className="text-lg font-bold text-emerald-800">({round(vR.x)}, {round(vR.y)})</div>
                  <div className="text-[10px] text-emerald-600 font-bold uppercase">r={round(Math.sqrt(vR.x**2 + vR.y**2))}, θ={round(toDegrees(Math.atan2(vR.y, vR.x)))}°</div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3 flex justify-center">
               <svg ref={svgRef} width={size} height={size} className="bg-slate-50 border rounded-xl shadow-inner touch-none cursor-crosshair" onPointerMove={handlePointerMove} onPointerUp={() => setDragging(null)}>
                 <line x1={0} y1={center} x2={size} y2={center} stroke="#cbd5e1" className="pointer-events-none"/><line x1={center} y1={0} x2={center} y2={size} stroke="#cbd5e1" className="pointer-events-none"/>
                 <line x1={center} y1={center} x2={center + v1.x * scale} y2={center - v1.y * scale} stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" className="pointer-events-none"/>
                 <circle cx={center + v1.x * scale} cy={center - v1.y * scale} r="10" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" className="cursor-move" onPointerDown={e => handlePointerDown('v1', e)}/>
                 <line x1={center + v1.x * scale} y1={center - v1.y * scale} x2={center + (v1.x + v2.x) * scale} y2={center - (v1.y + v2.y) * scale} stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrow-indigo)" className="pointer-events-none"/>
                 <circle cx={center + (v1.x + v2.x) * scale} cy={center - (v1.y + v2.y) * scale} r="10" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" className="cursor-move" onPointerDown={e => handlePointerDown('v2', e)}/>
                 <line x1={center} y1={center} x2={center + vR.x * scale} y2={center - vR.y * scale} stroke="#10b981" strokeWidth="3" opacity="0.6" markerEnd="url(#arrow-green)" className="pointer-events-none"/>
                 <defs>
                   <marker id="arrow-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" /></marker>
                   <marker id="arrow-indigo" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" /></marker>
                   <marker id="arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#10b981" /></marker>
                 </defs>
               </svg>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 space-y-4">
              <h3 className="font-bold text-lg text-slate-800">Euclidean Distance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg bg-slate-50 border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Point 1</div>
                  <input type="text" value={p1Str.x} onChange={e => setP1Str({...p1Str, x: e.target.value})} onBlur={commitP1} onKeyDown={e => handleKeyDown(e, commitP1)} className="w-full mb-2 p-2 text-sm border rounded bg-white text-slate-900 shadow-sm" placeholder="x"/>
                  <input type="text" value={p1Str.y} onChange={e => setP1Str({...p1Str, y: e.target.value})} onBlur={commitP1} onKeyDown={e => handleKeyDown(e, commitP1)} className="w-full p-2 text-sm border rounded bg-white text-slate-900 shadow-sm" placeholder="y"/>
                </div>
                <div className="p-3 border rounded-lg bg-slate-50 border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Point 2</div>
                  <input type="text" value={p2Str.x} onChange={e => setP2Str({...p2Str, x: e.target.value})} onBlur={commitP2} onKeyDown={e => handleKeyDown(e, commitP2)} className="w-full mb-2 p-2 text-sm border rounded bg-white text-slate-900 shadow-sm" placeholder="x"/>
                  <input type="text" value={p2Str.y} onChange={e => setP2Str({...p2Str, y: e.target.value})} onBlur={commitP2} onKeyDown={e => handleKeyDown(e, commitP2)} className="w-full p-2 text-sm border rounded bg-white text-slate-900 shadow-sm" placeholder="y"/>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
                <div className="text-xs text-orange-800 font-bold uppercase tracking-widest mb-1">Distance Result</div>
                <div className="text-3xl font-mono text-orange-900 font-bold">{round(distance)}</div>
              </div>
            </div>
            <div className="w-full md:w-2/3 flex justify-center">
               <svg ref={svgRef} width={size} height={size} className="bg-slate-50 border rounded-xl shadow-inner touch-none cursor-crosshair" onPointerMove={handlePointerMove} onPointerUp={() => setDragging(null)}>
                 <line x1={0} y1={center} x2={size} y2={center} stroke="#cbd5e1" className="pointer-events-none"/><line x1={center} y1={0} x2={center} y2={size} stroke="#cbd5e1" className="pointer-events-none"/>
                 <line x1={center + p1.x * scale} y1={center - p1.y * scale} x2={center + p2.x * scale} y2={center - p2.y * scale} stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" className="pointer-events-none"/>
                 <circle cx={center + p1.x * scale} cy={center - p1.y * scale} r="10" fill="rgba(100, 116, 139, 0.2)" stroke="#64748b" className="cursor-move" onPointerDown={e => handlePointerDown('p1', e)}/>
                 <circle cx={center + p2.x * scale} cy={center - p2.y * scale} r="10" fill="rgba(100, 116, 139, 0.2)" stroke="#64748b" className="cursor-move" onPointerDown={e => handlePointerDown('p2', e)}/>
               </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VectorAlgebra;
