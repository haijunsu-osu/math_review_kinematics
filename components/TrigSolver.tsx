
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generateTrigFunctionData, solveTrigEquation, round } from '../utils/mathUtils';

const TrigSolver: React.FC = () => {
  const [A, setA] = useState(1);
  const [B, setB] = useState(1);
  const [C, setC] = useState(-1);

  const data = generateTrigFunctionData(A, B, C);
  const roots = solveTrigEquation(A, B, C);
  const discriminantTerm = A * A + B * B - C * C;

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

            <div className={`p-4 rounded-lg border text-sm font-medium ${discriminantTerm >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
              Discriminant Term (D'): {round(discriminantTerm)}
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
      
      <div className="mt-0 pt-6 border-t border-slate-200 bg-slate-50 p-6 rounded text-left">
        <h5 className="text-lg font-bold text-slate-800 mb-4">Derivation & Solution</h5>
        
        <div className="space-y-6 text-sm text-slate-700">
            <p>To solve the equation <b className="font-serif">A cos(θ) + B sin(θ) + C = 0</b>, we use the half-angle substitution:</p>
            
            <div className="bg-white p-4 rounded border border-slate-200 flex flex-col items-center gap-4">
                <div className="text-base">Let <b className="font-serif">t = tan(θ/2)</b></div>
                <div className="flex gap-12 font-serif text-base">
                    <div className="flex items-center gap-2">
                        <span>cos(θ) = </span>
                        <div className="flex flex-col items-center">
                            <span className="border-b border-slate-800 px-1">1 - t²</span>
                            <span>1 + t²</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>sin(θ) = </span>
                        <div className="flex flex-col items-center">
                            <span className="border-b border-slate-800 px-1">2t</span>
                            <span>1 + t²</span>
                        </div>
                    </div>
                </div>
            </div>

            <p>Substituting these into the original equation converts it into a quadratic polynomial in terms of <b className="font-serif">t</b>:</p>
            
            <div className="text-center font-serif text-lg bg-white p-3 rounded border border-slate-200 shadow-sm">
                (C - A)t² + 2Bt + (C + A) = 0
            </div>

            <p>The solution for <b className="font-serif">t</b> is given by the quadratic formula where the discriminant is determined by the term <b className="font-serif">Δ' = A² + B² - C²</b>:</p>

            <div className="flex justify-center">
                 <div className="flex items-center text-lg font-serif bg-white px-6 py-4 rounded border border-slate-200 shadow-sm">
                    <span className="mr-3">t = </span>
                    <div className="flex flex-col items-center">
                        <div className="border-b border-slate-800 px-2 pb-1 mb-1">
                             -B ± <span className="inline-block">√<span className="border-t border-slate-800 pt-px ml-0.5" style={{borderTopWidth: '1px'}}>A² + B² - C²</span></span>
                        </div>
                        <div>C - A</div>
                    </div>
                </div>
            </div>

            <h5 className="text-base font-bold text-slate-800 mt-8 mb-4 flex items-center gap-2">
               <span className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">!</span>
               Physical Interpretation of the Discriminant
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border-2 border-emerald-100 bg-emerald-50 shadow-sm">
                    <div className="text-emerald-700 font-bold mb-2">A² + B² - C² > 0</div>
                    <p className="text-xs text-slate-600 mb-2 font-bold uppercase tracking-wide">Two Real Solutions</p>
                    <p className="text-slate-700">The mechanism has <b>two distinct assembly modes</b> (e.g., "elbow-up" and "elbow-down"). Both configurations satisfy the loop closure.</p>
                </div>
                <div className="p-4 rounded-xl border-2 border-amber-100 bg-amber-50 shadow-sm">
                    <div className="text-amber-700 font-bold mb-2">A² + B² - C² = 0</div>
                    <p className="text-xs text-slate-600 mb-2 font-bold uppercase tracking-wide">One Real Solution</p>
                    <p className="text-slate-700">The mechanism is in a <b>limit position</b> or singular configuration. The two assembly modes have merged into one unique position.</p>
                </div>
                <div className="p-4 rounded-xl border-2 border-rose-100 bg-rose-50 shadow-sm">
                    <div className="text-rose-700 font-bold mb-2">A² + B² - C² &lt; 0</div>
                    <p className="text-xs text-slate-600 mb-2 font-bold uppercase tracking-wide">No Real Solutions</p>
                    <p className="text-slate-700">The mechanism <b>cannot be assembled</b>. The links are either too short to close the loop or too long to fit in the specified space.</p>
                </div>
            </div>
            
            <p className="italic text-slate-500 text-xs mt-4">
               Note: In planar kinematic analysis, A, B, and C are typically functions of link lengths and one or more independent angles (like the input crank angle). 
               Changing the input angle changes these coefficients, potentially moving the mechanism from a dual-solution region into a singular point and then into an impossible assembly region.
            </p>
        </div>
      </div>
    </div>
  );
};

export default TrigSolver;
