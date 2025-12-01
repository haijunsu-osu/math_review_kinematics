import React, { useState } from 'react';
import { Tab } from './types';
import CoordinateConverter from './components/CoordinateConverter';
import Atan2Visualizer from './components/Atan2Visualizer';
import VectorAlgebra from './components/VectorAlgebra';
import QuadraticSolver from './components/QuadraticSolver';
import TrigSolver from './components/TrigSolver';
import GeminiTutor from './components/GeminiTutor';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.COORDINATES);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.COORDINATES: return <CoordinateConverter />;
      case Tab.ATAN2: return <Atan2Visualizer />;
      case Tab.VECTORS: return <VectorAlgebra />;
      case Tab.QUADRATIC: return <QuadraticSolver />;
      case Tab.TRIG_SOLVER: return <TrigSolver />;
      case Tab.TUTOR: return <GeminiTutor />;
      default: return <CoordinateConverter />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-slate-900 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mathematical Foundations for Kinematics</h1>
          <p className="text-slate-400 mt-2">Interactive review of trigonometric and vector algebra tools for the Vector Loop Method</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2 overflow-x-auto">
          {Object.values(Tab).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap
                ${activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="transition-opacity duration-300">
          {renderContent()}
        </div>
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Kinematics Education Tool. Built with React, Recharts & Gemini API.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;