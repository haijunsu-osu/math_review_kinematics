import React, { useState, useRef } from 'react';
import { round } from '../utils/mathUtils';

const VectorAlgebra: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'dist'>('add');
  const svgRef = useRef<SVGSVGElement>(null);
  
  // State for Vector Addition
  const [v1, setV1] = useState({ x: 3, y: 2 });
  const [v2, setV2] = useState({ x: 2, y: 4 });
  
  // State for Distance
  const [p1, setP1] = useState({ x: -2, y: -2 });
  const [p2, setP2] = useState({ x: 4, y: 3 });

  // Dragging state
  const [dragging, setDragging] = useState<string | null>(null);

  const size = 350;
  const center = size / 2;
  const scale = 25;

  // Vector Result
  const vR = { x: v1.x + v2.x, y: v1.y + v2.y };
  
  // Distance Result
  const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(id);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const mathX = round((mouseX - center) / scale);
    const mathY = round(-(mouseY - center) / scale);

    if (activeTab === 'add') {
      if (dragging === 'v1') {
        // Dragging head of V1
        setV1({ x: mathX, y: mathY });
      } else if (dragging === 'v2') {
        // Dragging head of V2 (which is at V1 + V2)
        // New V2 = MousePos - V1
        setV2({ x: mathX - v1.x, y: mathY - v1.y });
      }
    } else {
      if (dragging === 'p1') {
        setP1({ x: mathX, y: mathY });
      } else if (dragging === 'p2') {
        setP2({ x: mathX, y: mathY });
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragging(null);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-3 font-semibold text-sm ${activeTab === 'add' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Vector Addition
        </button>
        <button 
          onClick={() => setActiveTab('dist')}
          className={`flex-1 py-3 font-semibold text-sm ${activeTab === 'dist' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Distance Between Points
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'add' ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 space-y-4">
              <h3 className="font-bold text-lg text-slate-800">Head-to-Tail Rule</h3>
              <p className="text-sm text-slate-600">Drag the vector heads to explore addition.</p>
              
              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                <div className="font-semibold text-blue-900 text-sm mb-2">Vector A</div>
                <div className="flex gap-2">
                  <input type="number" value={v1.x} onChange={e => setV1({...v1, x: parseFloat(e.target.value)||0})} className="w-1/2 p-1 border rounded text-sm" placeholder="x"/>
                  <input type="number" value={v1.y} onChange={e => setV1({...v1, y: parseFloat(e.target.value)||0})} className="w-1/2 p-1 border rounded text-sm" placeholder="y"/>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded border border-indigo-100">
                <div className="font-semibold text-indigo-900 text-sm mb-2">Vector B</div>
                <div className="flex gap-2">
                  <input type="number" value={v2.x} onChange={e => setV2({...v2, x: parseFloat(e.target.value)||0})} className="w-1/2 p-1 border rounded text-sm" placeholder="x"/>
                  <input type="number" value={v2.y} onChange={e => setV2({...v2, y: parseFloat(e.target.value)||0})} className="w-1/2 p-1 border rounded text-sm" placeholder="y"/>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded border border-emerald-100">
                <div className="font-semibold text-emerald-900 text-sm mb-1">Resultant R = A + B</div>
                <div className="font-mono text-lg">({round(vR.x)}, {round(vR.y)})</div>
              </div>
            </div>

            <div className="w-full md:w-2/3 flex justify-center">
               <svg 
                 ref={svgRef}
                 width={size} 
                 height={size} 
                 className="bg-slate-50 border rounded touch-none"
                 onPointerMove={handlePointerMove}
                 onPointerUp={handlePointerUp}
               >
                 <line x1={0} y1={center} x2={size} y2={center} stroke="#cbd5e1" className="pointer-events-none"/>
                 <line x1={center} y1={0} x2={center} y2={size} stroke="#cbd5e1" className="pointer-events-none"/>
                 
                 {/* Vector A */}
                 <line x1={center} y1={center} x2={center + v1.x * scale} y2={center - v1.y * scale} stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" className="pointer-events-none"/>
                 <text x={center + v1.x * scale / 2} y={center - v1.y * scale / 2} className="fill-blue-600 text-xs font-bold pointer-events-none" dy="-5">A</text>
                 <circle 
                    cx={center + v1.x * scale} 
                    cy={center - v1.y * scale} 
                    r="8" 
                    fill="rgba(59, 130, 246, 0.3)" 
                    className="cursor-move hover:fill-blue-400"
                    onPointerDown={(e) => handlePointerDown('v1', e)}
                 />

                 {/* Vector B (starts at A's head) */}
                 <line 
                   x1={center + v1.x * scale} 
                   y1={center - v1.y * scale} 
                   x2={center + (v1.x + v2.x) * scale} 
                   y2={center - (v1.y + v2.y) * scale} 
                   stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrow-indigo)" 
                   className="pointer-events-none"
                 />
                 <text x={center + (v1.x + v2.x/2) * scale} y={center - (v1.y + v2.y/2) * scale} className="fill-indigo-600 text-xs font-bold pointer-events-none" dy="-5">B</text>
                 <circle 
                    cx={center + (v1.x + v2.x) * scale} 
                    cy={center - (v1.y + v2.y) * scale} 
                    r="8" 
                    fill="rgba(99, 102, 241, 0.3)" 
                    className="cursor-move hover:fill-indigo-400"
                    onPointerDown={(e) => handlePointerDown('v2', e)}
                 />

                 {/* Resultant */}
                 <line x1={center} y1={center} x2={center + vR.x * scale} y2={center - vR.y * scale} stroke="#10b981" strokeWidth="3" opacity="0.5" markerEnd="url(#arrow-green)" className="pointer-events-none"/>
                 <text x={center + vR.x * scale / 2 + 10} y={center - vR.y * scale / 2 + 10} className="fill-emerald-600 text-xs font-bold pointer-events-none">R</text>

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
              <p className="text-sm text-slate-600">Drag points P1 and P2 to calculate the distance.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-2 border rounded bg-slate-50">
                  <div className="text-xs font-bold text-slate-500 mb-1">Point 1</div>
                  <input type="number" value={p1.x} onChange={e => setP1({...p1, x: parseFloat(e.target.value)||0})} className="w-full mb-1 p-1 text-sm border rounded" placeholder="x"/>
                  <input type="number" value={p1.y} onChange={e => setP1({...p1, y: parseFloat(e.target.value)||0})} className="w-full p-1 text-sm border rounded" placeholder="y"/>
                </div>
                <div className="p-2 border rounded bg-slate-50">
                  <div className="text-xs font-bold text-slate-500 mb-1">Point 2</div>
                  <input type="number" value={p2.x} onChange={e => setP2({...p2, x: parseFloat(e.target.value)||0})} className="w-full mb-1 p-1 text-sm border rounded" placeholder="x"/>
                  <input type="number" value={p2.y} onChange={e => setP2({...p2, y: parseFloat(e.target.value)||0})} className="w-full p-1 text-sm border rounded" placeholder="y"/>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded border border-orange-200">
                <div className="text-sm text-orange-800 font-semibold">Distance:</div>
                <div className="text-2xl font-mono text-orange-900">{round(distance)}</div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 flex justify-center">
               <svg 
                 ref={svgRef}
                 width={size} 
                 height={size} 
                 className="bg-slate-50 border rounded touch-none"
                 onPointerMove={handlePointerMove}
                 onPointerUp={handlePointerUp}
               >
                 <line x1={0} y1={center} x2={size} y2={center} stroke="#cbd5e1" className="pointer-events-none"/>
                 <line x1={center} y1={0} x2={center} y2={size} stroke="#cbd5e1" className="pointer-events-none"/>
                 
                 {/* Line connecting P1 and P2 */}
                 <line 
                   x1={center + p1.x * scale} 
                   y1={center - p1.y * scale} 
                   x2={center + p2.x * scale} 
                   y2={center - p2.y * scale} 
                   stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" 
                   className="pointer-events-none"
                 />

                 {/* Points */}
                 <circle 
                   cx={center + p1.x * scale} 
                   cy={center - p1.y * scale} 
                   r="8" fill="#64748b" 
                   className="cursor-move hover:fill-slate-600"
                   onPointerDown={(e) => handlePointerDown('p1', e)}
                 />
                 <text x={center + p1.x * scale + 8} y={center - p1.y * scale} className="text-xs fill-slate-700 font-bold pointer-events-none">P1</text>
                 
                 <circle 
                   cx={center + p2.x * scale} 
                   cy={center - p2.y * scale} 
                   r="8" fill="#64748b" 
                   className="cursor-move hover:fill-slate-600"
                   onPointerDown={(e) => handlePointerDown('p2', e)}
                 />
                 <text x={center + p2.x * scale + 8} y={center - p2.y * scale} className="text-xs fill-slate-700 font-bold pointer-events-none">P2</text>
               </svg>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-4 text-center">
        <h5 className="text-sm font-bold text-slate-700 mb-2">Mathematical Formula</h5>
        <div className="inline-block bg-white px-6 py-3 rounded border border-slate-200 shadow-sm">
           {activeTab === 'add' ? (
             <code className="text-lg font-serif">{'\\vec{R} = \\vec{A} + \\vec{B} = (A_x + B_x, A_y + B_y)'}</code>
           ) : (
             <code className="text-lg font-serif">{'d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}'}</code>
           )}
        </div>
      </div>
    </div>
  );
};

export default VectorAlgebra;