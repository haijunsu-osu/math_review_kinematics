
import React, { useState, useMemo } from 'react';
import { toRadians, toDegrees, round } from '../utils/mathUtils';

const CosineLawVisualizer: React.FC = () => {
  // Input parameters: side a, side b, angle C, and side c
  const [a, setA] = useState(6);
  const [b, setB] = useState(5);
  const [angleC, setAngleC] = useState(60);
  const [sideC, setSideC] = useState(5.57); // Initial value for c at a=6, b=5, C=60
  
  // Track which mode we are in: 'solve-c' (C changed) or 'solve-angle' (c changed)
  const [lastManualChange, setLastManualChange] = useState<'angle' | 'side'>('angle');

  // Handle changes to a, b, or Angle C -> Calculate side c
  const updateSideC = (newA: number, newB: number, newAngleC: number) => {
    const rad = toRadians(newAngleC);
    const cSq = newA * newA + newB * newB - 2 * newA * newB * Math.cos(rad);
    const calculatedC = Math.sqrt(Math.max(0, cSq));
    setSideC(round(calculatedC, 3));
    setLastManualChange('angle');
  };

  // Handle changes to side c -> Calculate Angle C
  const updateAngleC = (newA: number, newB: number, newC: number) => {
    // Law of Cosines inverted: cos(C) = (a² + b² - c²) / (2ab)
    let cosC = (newA * newA + newB * newB - newC * newC) / (2 * newA * newB);
    // Clamp for safety
    cosC = Math.max(-1, Math.min(1, cosC));
    const rad = Math.acos(cosC);
    setAngleC(round(toDegrees(rad), 1));
    setLastManualChange('side');
  };

  // UI Handlers
  const handleA = (val: number) => {
    setA(val);
    if (lastManualChange === 'side') {
      // If we were dragging c, try to maintain c and update angle
      // Check if c is still valid for new a, b
      const minC = Math.abs(val - b) + 0.01;
      const maxC = (val + b) - 0.01;
      const validC = Math.max(minC, Math.min(maxC, sideC));
      setSideC(validC);
      updateAngleC(val, b, validC);
    } else {
      updateSideC(val, b, angleC);
    }
  };

  const handleB = (val: number) => {
    setB(val);
    if (lastManualChange === 'side') {
      const minC = Math.abs(a - val) + 0.01;
      const maxC = (a + val) - 0.01;
      const validC = Math.max(minC, Math.min(maxC, sideC));
      setSideC(validC);
      updateAngleC(a, val, validC);
    } else {
      updateSideC(a, val, angleC);
    }
  };

  const handleAngleC = (val: number) => {
    setAngleC(val);
    updateSideC(a, b, val);
  };

  const handleSideC = (val: number) => {
    setSideC(val);
    updateAngleC(a, b, val);
  };

  // Geometry for SVG
  const angleCRad = useMemo(() => toRadians(angleC), [angleC]);
  const size = 350;
  const padding = 50;
  const maxDim = Math.max(a, b, sideC, 8);
  const scale = (size - 2 * padding) / maxDim;

  const vC = { x: padding, y: size - padding };
  const vB = { x: padding + a * scale, y: size - padding };
  const vA = { 
    x: padding + b * Math.cos(angleCRad) * scale, 
    y: size - padding - b * Math.sin(angleCRad) * scale 
  };

  const labelA = { x: (vB.x + vC.x) / 2, y: (vB.y + vC.y) / 2 + 20 };
  const labelB = { x: (vA.x + vC.x) / 2 - 20, y: (vA.y + vC.y) / 2 };
  const labelC = { x: (vA.x + vB.x) / 2 + 10, y: (vA.y + vB.y) / 2 - 10 };

  // Calculate constraints for Side c slider
  const minC = Math.max(0.1, round(Math.abs(a - b) + 0.01, 2));
  const maxC = round(a + b - 0.01, 2);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Interactive Law of Cosines</h3>
        {/* Fix: Wrap text with less-than symbols in braces to avoid JSX tag ambiguity */}
        <p className="text-slate-600 text-sm mb-6">
          {"Change any side or angle to see how the others react. Side $c$ is constrained by the triangle inequality: $|a - b| < c < a + b$."}
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/5 space-y-6">
            {/* Input Controls */}
            <div className="bg-orange-50 p-5 rounded-lg border border-orange-100 space-y-5">
              <div>
                <label className="flex justify-between text-xs font-bold text-orange-900 mb-1 uppercase tracking-wider">
                  <span>Side a</span>
                  <span className="font-mono bg-white px-2 rounded border border-orange-200">{a}</span>
                </label>
                <input 
                  type="range" min="1" max="10" step="0.1" 
                  value={a} onChange={e => handleA(parseFloat(e.target.value))} 
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="flex justify-between text-xs font-bold text-orange-900 mb-1 uppercase tracking-wider">
                  <span>Side b</span>
                  <span className="font-mono bg-white px-2 rounded border border-orange-200">{b}</span>
                </label>
                <input 
                  type="range" min="1" max="10" step="0.1" 
                  value={b} onChange={e => handleB(parseFloat(e.target.value))} 
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="pt-2 border-t border-orange-100">
                <label className={`flex justify-between text-xs font-bold mb-1 uppercase tracking-wider ${lastManualChange === 'angle' ? 'text-blue-700' : 'text-slate-500'}`}>
                  <span>Included Angle C (deg)</span>
                  <span className={`font-mono px-2 rounded border ${lastManualChange === 'angle' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-slate-700 border-slate-200'}`}>{angleC}°</span>
                </label>
                <input 
                  type="range" min="1" max="179" step="1" 
                  value={angleC} onChange={e => handleAngleC(parseFloat(e.target.value))} 
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="pt-2">
                <label className={`flex justify-between text-xs font-bold mb-1 uppercase tracking-wider ${lastManualChange === 'side' ? 'text-blue-700' : 'text-slate-500'}`}>
                  <span>Opposite Side c</span>
                  <span className={`font-mono px-2 rounded border ${lastManualChange === 'side' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-slate-700 border-slate-200'}`}>{sideC}</span>
                </label>
                <input 
                  type="range" min={minC} max={maxC} step="0.01" 
                  value={sideC} onChange={e => handleSideC(parseFloat(e.target.value))} 
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Min: {minC}</span>
                  <span>Max: {maxC}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
               <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Active Relation</h4>
               {lastManualChange === 'angle' ? (
                 <p className="text-sm text-slate-700">Solving for <b>side c</b> given sides a, b and angle C.</p>
               ) : (
                 <p className="text-sm text-slate-700">Solving for <b>angle C</b> given three sides a, b, and c.</p>
               )}
            </div>
          </div>

          <div className="w-full lg:w-3/5 flex flex-col items-center">
            <div className="relative bg-slate-50 border border-slate-100 rounded-lg shadow-inner w-full flex justify-center p-4">
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm overflow-visible">
                <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#dotGrid)" />

                {/* Angle C arc */}
                <path 
                  d={`M ${vC.x + 30} ${vC.y} A 30 30 0 0 0 ${vC.x + 30 * Math.cos(angleCRad)} ${vC.y - 30 * Math.sin(angleCRad)}`} 
                  fill="none" stroke="#f97316" strokeWidth="2"
                />
                
                {/* Triangle Sides */}
                <line x1={vC.x} y1={vC.y} x2={vB.x} y2={vB.y} stroke="#64748b" strokeWidth="3" />
                <line x1={vC.x} y1={vC.y} x2={vA.x} y2={vA.y} stroke="#64748b" strokeWidth="3" />
                <line x1={vA.x} y1={vA.y} x2={vB.x} y2={vB.y} stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />

                {/* Vertices */}
                <circle cx={vC.x} cy={vC.y} r="5" fill="#f97316" />
                <circle cx={vB.x} cy={vB.y} r="4" fill="#64748b" />
                <circle cx={vA.x} cy={vA.y} r="4" fill="#64748b" />

                {/* Labels */}
                <text x={vC.x - 15} y={vC.y + 15} className="text-xs font-bold fill-orange-600">C</text>
                <text x={vB.x} y={vB.y + 15} className="text-xs font-bold fill-slate-500">B</text>
                <text x={vA.x} y={vA.y - 10} className="text-xs font-bold fill-slate-500">A</text>

                <text x={labelA.x} y={labelA.y} className="text-sm font-bold fill-slate-700 italic" textAnchor="middle">a={a}</text>
                <text x={labelB.x} y={labelB.y} className="text-sm font-bold fill-slate-700 italic" textAnchor="middle">b={b}</text>
                <text x={labelC.x} y={labelC.y} className="text-sm font-bold fill-blue-700 italic" textAnchor="middle">c={sideC}</text>
                <text x={vC.x + 35} y={vC.y - 10} className="text-[10px] fill-orange-700 font-bold">{angleC}°</text>
              </svg>
            </div>
            
            <div className="mt-6 w-full bg-slate-50 p-6 rounded-lg border border-slate-200">
               <h5 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest border-b pb-2">Active Step Calculation</h5>
               <div className="space-y-3 font-serif text-sm md:text-base text-slate-800">
                  {lastManualChange === 'angle' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="bg-white px-2 py-1 rounded border shadow-sm text-xs font-sans font-bold text-slate-500">Target:</span>
                        <code>c = √(a² + b² - 2ab cos(C))</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-white px-2 py-1 rounded border shadow-sm text-xs font-sans font-bold text-slate-500">Substitute:</span>
                        <code>c = √({a}² + {b}² - 2({a})({b}) cos({angleC}°))</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-white px-2 py-1 rounded border shadow-sm text-xs font-sans font-bold text-slate-500">Result:</span>
                        <code>c = <span className="text-blue-700 font-bold">{sideC}</span></code>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="bg-white px-2 py-1 rounded border shadow-sm text-xs font-sans font-bold text-slate-500">Target:</span>
                        <code>C = arccos((a² + b² - c²) / 2ab)</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-white px-2 py-1 rounded border shadow-sm text-xs font-sans font-bold text-slate-500">Substitute:</span>
                        <code>C = arccos(({a}² + {b}² - {sideC}²) / 2({a})({b}))</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-white px-2 py-1 rounded border shadow-sm text-xs font-sans font-bold text-slate-500">Result:</span>
                        <code>C = <span className="text-blue-700 font-bold">{angleC}°</span></code>
                      </div>
                    </>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CosineLawVisualizer;
