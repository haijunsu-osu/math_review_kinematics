import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generateQuadraticData, solveQuadratic, round } from '../utils/mathUtils';

const QuadraticSolver: React.FC = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);

  const data = generateQuadraticData(a, b, c, 10);
  const roots = solveQuadratic(a, b, c);
  const discriminant = b * b - 4 * a * c;

  let rootType = "Two Real Roots";
  if (discriminant < 0) rootType = "No Real Roots";
  else if (discriminant === 0) rootType = "One Real Root (Repeated)";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Quadratic Equation Solver</h3>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg">
               <div className="text-center text-lg font-serif mb-4 italic">
                 {a}x² + {b}x + {c} = 0
               </div>
               
               <div className="grid grid-cols-3 gap-2">
                 <div>
                   <label className="text-xs text-slate-500 font-bold">a</label>
                   <input type="number" value={a} onChange={e => setA(parseFloat(e.target.value)||0)} className="w-full p-2 border rounded"/>
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 font-bold">b</label>
                   <input type="number" value={b} onChange={e => setB(parseFloat(e.target.value)||0)} className="w-full p-2 border rounded"/>
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 font-bold">c</label>
                   <input type="number" value={c} onChange={e => setC(parseFloat(e.target.value)||0)} className="w-full p-2 border rounded"/>
                 </div>
               </div>
            </div>

            <div className={`p-4 rounded-lg border ${discriminant >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h4 className="font-bold text-sm text-slate-700 mb-2">Discriminant (D = b² - 4ac)</h4>
              <div className="text-xl font-mono mb-1">{round(discriminant)}</div>
              <div className="text-sm font-semibold">{rootType}</div>
            </div>

            {roots.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-bold text-sm text-slate-700 mb-2">Roots</h4>
                <div className="flex gap-4">
                  {roots.map((r, i) => (
                    <div key={i} className="text-lg font-mono">x{i+1} = {round(r)}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-2/3 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" type="number" domain={['auto', 'auto']} allowDataOverflow={false} />
                <YAxis dataKey="y" />
                <Tooltip formatter={(val: number) => round(val)} labelFormatter={(label: number) => `x: ${round(label)}`}/>
                <ReferenceLine y={0} stroke="#000" />
                <ReferenceLine x={0} stroke="#000" />
                <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} strokeWidth={2} />
                {roots.map((root, idx) => (
                   <ReferenceLine key={idx} x={root} stroke="red" strokeDasharray="3 3" label={{ value: `x=${round(root)}`, position: 'top', fill: 'red', fontSize: 12 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-0 pt-4 border-t border-slate-200 bg-slate-50 p-4 text-center">
        <h5 className="text-sm font-bold text-slate-700 mb-2">Mathematical Formula</h5>
        <div className="inline-block bg-white px-8 py-4 rounded border border-slate-200 shadow-sm">
           <div className="flex items-center text-lg font-serif">
             <span className="mr-3">x = </span>
             <div className="flex flex-col items-center">
               <div className="border-b border-slate-800 pb-1 mb-1 px-1">
                 -b ± <span className="inline-block">√<span className="border-t border-slate-800 pt-px ml-0.5" style={{borderTopWidth: '1px'}}>b² - 4ac</span></span>
               </div>
               <div>2a</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QuadraticSolver;