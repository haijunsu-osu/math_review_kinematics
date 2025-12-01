import React, { useState, useRef } from 'react';
import { toDegrees, round } from '../utils/mathUtils';

const Atan2Visualizer: React.FC = () => {
  const [x, setX] = useState(-3);
  const [y, setY] = useState(3);
  const svgRef = useRef<SVGSVGElement>(null);

  const atanResult = round(toDegrees(Math.atan(y / x)));
  const atan2Result = round(toDegrees(Math.atan2(y, x)));

  const size = 300;
  const center = size / 2;
  const scale = 30;

  const pointX = center + x * scale;
  const pointY = center - y * scale;

  const handlePointer = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    if (e.buttons !== 1 && e.type !== 'pointerdown') return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const mathX = (mouseX - center) / scale;
    const mathY = -(mouseY - center) / scale;
    
    // Clamp to canvas area approximately
    const clampedX = Math.max(-4.8, Math.min(4.8, mathX));
    const clampedY = Math.max(-4.8, Math.min(4.8, mathY));

    setX(round(clampedX));
    setY(round(clampedY));
    
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">The Ambiguity of Atan</h3>
            <p className="text-slate-600 text-sm">
              Standard <code className="bg-slate-100 px-1 rounded">atan(y/x)</code> loses quadrant information. It cannot distinguish between Quadrant I (+/+) and Quadrant III (-/-).
            </p>
            <p className="text-slate-600 text-sm mt-2">
              <code className="bg-slate-100 px-1 rounded">atan2(y, x)</code> solves this by checking the signs of both inputs to return a unique angle in the (-180°, 180°] range.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">X Value: {x}</label>
              <input 
                type="range" min="-5" max="5" step="0.1" 
                value={x} onChange={(e) => setX(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Y Value: {y}</label>
              <input 
                type="range" min="-5" max="5" step="0.1" 
                value={y} onChange={(e) => setY(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
              <div className="text-xs uppercase font-bold text-red-800 mb-1">Standard Atan</div>
              <div className="text-2xl font-mono text-red-900">{isNaN(atanResult) ? 'Undef' : atanResult + '°'}</div>
              <div className="text-xs text-red-600 mt-1">Range: (-90°, +90°)</div>
            </div>
            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
               <div className="text-xs uppercase font-bold text-green-800 mb-1">Atan2 (Correct)</div>
               <div className="text-2xl font-mono text-green-900">{atan2Result}°</div>
               <div className="text-xs text-green-600 mt-1">Range: (-180°, +180°]</div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center relative">
          <svg 
            ref={svgRef}
            width={size} 
            height={size} 
            className="bg-slate-50 border rounded-lg cursor-crosshair touch-none"
            onPointerDown={handlePointer}
            onPointerMove={handlePointer}
          >
             <line x1={0} y1={center} x2={size} y2={center} stroke="#cbd5e1" strokeWidth="2" className="pointer-events-none"/>
             <line x1={center} y1={0} x2={center} y2={size} stroke="#cbd5e1" strokeWidth="2" className="pointer-events-none"/>
             
             {/* Quadrant Labels */}
             <text x={size - 30} y={30} className="text-xs fill-slate-400 pointer-events-none">Q I</text>
             <text x={30} y={30} className="text-xs fill-slate-400 pointer-events-none">Q II</text>
             <text x={30} y={size - 20} className="text-xs fill-slate-400 pointer-events-none">Q III</text>
             <text x={size - 30} y={size - 20} className="text-xs fill-slate-400 pointer-events-none">Q IV</text>

             {/* Vector */}
             <line x1={center} y1={center} x2={pointX} y2={pointY} stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrowhead-black)" className="pointer-events-none"/>
             
             {/* Drag Handle */}
             <circle cx={pointX} cy={pointY} r="10" fill="rgba(15, 23, 42, 0.1)" stroke="#0f172a" strokeWidth="1" className="cursor-move" />

             <defs>
              <marker id="arrowhead-black" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#0f172a" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50 p-4 rounded text-center">
        <h5 className="text-sm font-bold text-slate-700 mb-2">Mathematical Formula</h5>
        <div className="inline-block bg-white px-6 py-3 rounded border border-slate-200 shadow-sm">
          <code className="text-lg font-serif">θ = atan2(y, x)</code>
        </div>
        <p className="text-xs text-slate-500 mt-2">Returns the angle in radians between the positive x-axis and the vector (x, y).</p>
      </div>
    </div>
  );
};

export default Atan2Visualizer;