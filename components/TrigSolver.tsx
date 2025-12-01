import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generateTrigFunctionData, solveTrigEquation, round } from '../utils/mathUtils';

const TrigSolver: React.FC = () => {
  const [A, setA] = useState(1);
  const [B, setB] = useState(1);
  const [C, setC] = useState(-1);

  const data = generateTrigFunctionData(A, B, C);
  const roots = solveTrigEquation(A, B, C);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Kinematic Loop Solver</h3>
        <p className="text-slate-600 text-sm mb-6">Solving the fundamental equation for planar linkages using half-angle substitution.</p>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
               <div className="grid grid-cols-1 gap-4">
                 <div>
                   <label className="flex justify-between text-sm font-bold text-indigo-900 mb-1">
                      <span>Coefficient A</span>
                      <span className="font-mono font-normal">{A}</span>
                   </label>
                   <input type="range" min="-10" max="10" step="0.1" value={A} onChange={e => setA(parseFloat(e.target.value))} className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"/>
                 </div>
                 <div>
                   <label className="flex justify-between text-sm font-bold text-indigo-900 mb-1">
                      <span>Coefficient B</span>
                      <span className="font-mono font-normal">{B}</span>
                   </label>
                   <input type="range" min="-10" max="10" step="0.1" value={B} onChange={e => setB(parseFloat(e.target.value))} className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"/>
                 </div>
                 <div>
                   <label className="flex justify-between text-sm font-bold text-indigo-900 mb-1">
                      <span>Constant C</span>
                      <span className="font-mono font-normal">{C}</span>
                   </label>
                   <input type="range" min="-10" max="10" step="0.1" value={C} onChange={e => setC(parseFloat(e.target.value))} className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"/>
                 </div>
               </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
              <h4 className="font-bold text-sm text-slate-700 mb-3 border-b pb-2">Solutions (θ in degrees)</h4>
              {roots.length === 0 ? (
                  <div className="text-red-500 text-sm">No real solutions (Mechanism cannot be assembled).</div>
              ) : (
                  <ul className="space-y-2">
                      {roots.map((r, i) => (
                          <li key={i} className="flex justify-between items-center text-sm">
                              <span className="font-semibold text-slate-600">Root {i+1}:</span>
                              <span className="font-mono text-lg text-emerald-600 font-bold">{round(r)}°</span>
                          </li>
                      ))}
                  </ul>
              )}
            </div>
          </div>

          <div className="w-full lg:w-2/3 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="theta" type="number" label={{ value: 'Angle (deg)', position: 'insideBottomRight', offset: -5 }} domain={[-180, 180]} />
                <YAxis label={{ value: 'f(θ)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(val: number) => round(val)} labelFormatter={(label: number) => `${round(label)}°`}/>
                <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
                <Line type="monotone" dataKey="y" stroke="#8b5cf6" dot={false} strokeWidth={3} />
                {roots.map((root, idx) => (
                   <ReferenceLine key={idx} x={root} stroke="#ef4444" strokeDasharray="3 3" />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-0 pt-4 border-t border-slate-200 bg-slate-50 p-4 text-center">
        <h5 className="text-sm font-bold text-slate-700 mb-2">Mathematical Formula</h5>
        <div className="inline-block bg-white px-6 py-3 rounded border border-slate-200 shadow-sm">
           <code className="text-lg font-serif">A cos(θ) + B sin(θ) + C = 0</code>
        </div>
        <p className="text-xs text-slate-500 mt-2">Converted to polynomial via substitution: <code className="bg-slate-200 px-1 rounded">t = tan(θ/2)</code></p>
      </div>
    </div>
  );
};

export default TrigSolver;