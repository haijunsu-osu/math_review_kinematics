import React, { useState, useRef } from 'react';
import { toDegrees, toRadians, round } from '../utils/mathUtils';

const CoordinateConverter: React.FC = () => {
  const [x, setX] = useState(3);
  const [y, setY] = useState(4);
  const [r, setR] = useState(5);
  const [theta, setTheta] = useState(53.13);
  
  const svgRef = useRef<SVGSVGElement>(null);

  // SVG dimensions
  const size = 300;
  const center = size / 2;
  const scale = 20; // pixels per unit

  const updateCartesian = (newX: number, newY: number) => {
    // Limit range to keep within SVG
    const clampedX = Math.max(-7, Math.min(7, newX));
    const clampedY = Math.max(-7, Math.min(7, newY));
    
    setX(round(clampedX));
    setY(round(clampedY));
    setR(round(Math.sqrt(clampedX * clampedX + clampedY * clampedY)));
    setTheta(round(toDegrees(Math.atan2(clampedY, clampedX))));
  };

  const updatePolar = (newR: number, newTheta: number) => {
    setR(newR);
    setTheta(newTheta);
    const rad = toRadians(newTheta);
    setX(round(newR * Math.cos(rad)));
    setY(round(newR * Math.sin(rad)));
  };

  const handlePointer = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    
    // Only process if primary button (left click) or touch
    if (e.buttons !== 1 && e.type !== 'pointerdown') return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert SVG coords to Math coords
    // x_svg = center + x * scale  => x = (x_svg - center) / scale
    // y_svg = center - y * scale  => y = -(y_svg - center) / scale
    const mathX = (mouseX - center) / scale;
    const mathY = -(mouseY - center) / scale;

    updateCartesian(mathX, mathY);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const pointX = center + x * scale;
  const pointY = center - y * scale; // SVG y is inverted

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-slate-800">Coordinates Visualizer</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">Cartesian (x, y)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600">X Component</label>
                  <input 
                    type="number" 
                    value={x} 
                    onChange={(e) => updateCartesian(parseFloat(e.target.value) || 0, y)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600">Y Component</label>
                  <input 
                    type="number" 
                    value={y} 
                    onChange={(e) => updateCartesian(x, parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <h4 className="font-semibold text-emerald-900 mb-2">Polar (r, θ)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600">Magnitude (r)</label>
                  <input 
                    type="number" 
                    value={r} 
                    onChange={(e) => updatePolar(parseFloat(e.target.value) || 0, theta)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600">Angle (θ°)</label>
                  <input 
                    type="number" 
                    value={theta} 
                    onChange={(e) => updatePolar(r, parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 italic">
              * Drag the vector point on the graph to change values interactively.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <svg 
            ref={svgRef}
            width={size} 
            height={size} 
            className="bg-white border rounded-lg shadow-inner cursor-crosshair touch-none"
            onPointerDown={handlePointer}
            onPointerMove={handlePointer}
          >
            {/* Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width={size} height={size} fill="url(#grid)" className="pointer-events-none" />

            {/* Axes */}
            <line x1={0} y1={center} x2={size} y2={center} stroke="#64748b" strokeWidth="2" className="pointer-events-none" />
            <line x1={center} y1={0} x2={center} y2={size} stroke="#64748b" strokeWidth="2" className="pointer-events-none" />
            
            {/* Vector */}
            <line x1={center} y1={center} x2={pointX} y2={pointY} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead)" className="pointer-events-none" />
            
            {/* Projections */}
            <line x1={pointX} y1={center} x2={pointX} y2={pointY} stroke="#94a3b8" strokeDasharray="4" className="pointer-events-none" />
            <line x1={center} y1={pointY} x2={pointX} y2={pointY} stroke="#94a3b8" strokeDasharray="4" className="pointer-events-none" />

            {/* Angle Arc */}
            {r > 0 && (
               <path d={`M ${center + 30} ${center} A 30 30 0 ${Math.abs(theta) > 180 ? 1 : 0} ${theta < 0 ? 1 : 0} ${center + 30 * Math.cos(toRadians(theta))} ${center - 30 * Math.sin(toRadians(theta))}`} fill="none" stroke="#ef4444" className="pointer-events-none" />
            )}

            {/* Interactive Handle */}
            <circle cx={pointX} cy={pointY} r="8" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" className="cursor-move" />

            {/* Labels */}
            <text x={pointX + 10} y={pointY - 10} className="text-xs font-bold fill-slate-700 pointer-events-none">P({x}, {y})</text>
            <text x={center + x * scale / 2} y={center - y * scale / 2 - 5} className="text-xs font-bold fill-blue-600 pointer-events-none">r={r}</text>
            <text x={center + 40} y={center - (theta > 0 ? 10 : -10)} className="text-xs fill-red-500 pointer-events-none">θ={theta}°</text>
            
            {/* Marker Definition */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* Formula Footer */}
      <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50 p-4 rounded text-center">
        <h5 className="text-sm font-bold text-slate-700 mb-2">Mathematical Formulas</h5>
        <div className="flex flex-col md:flex-row justify-center gap-6 text-sm font-serif">
          <div className="bg-white px-4 py-2 rounded border border-slate-200 shadow-sm">
            <span className="text-slate-500 font-sans text-xs block mb-1">Polar to Cartesian</span>
            x = r cos(θ)<br/>
            y = r sin(θ)
          </div>
          <div className="bg-white px-4 py-2 rounded border border-slate-200 shadow-sm">
            <span className="text-slate-500 font-sans text-xs block mb-1">Cartesian to Polar</span>
            r = √(x² + y²)<br/>
            θ = atan2(y, x)
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinateConverter;