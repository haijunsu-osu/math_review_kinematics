
import React, { useState, useEffect } from 'react';
import { Tab } from './types';
import CoordinateConverter from './components/CoordinateConverter';
import Atan2Visualizer from './components/Atan2Visualizer';
import VectorAlgebra from './components/VectorAlgebra';
import QuadraticSolver from './components/QuadraticSolver';
import TrigSolver from './components/TrigSolver';
import CosineLawVisualizer from './components/CosineLawVisualizer';
import GeminiTutor from './components/GeminiTutor';
import Quiz from './components/Quiz';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.COORDINATES);
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    
    // Check for embed mode
    const embedMode = params.get('embed') === 'true' || params.get('mode') === 'embed';
    setIsEmbed(embedMode);

    // Check for specific tab
    const tabParam = params.get('tab');
    if (tabParam) {
      // Normalize string to match Enum values (e.g. 'trig_solver' -> 'Trig Solver')
      const normalizedParam = tabParam.toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');
      const foundTab = Object.values(Tab).find(t => 
        t.toLowerCase() === normalizedParam || 
        t.toLowerCase().replace(' ', '') === normalizedParam
      );
      if (foundTab) setActiveTab(foundTab);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.COORDINATES: return <CoordinateConverter />;
      case Tab.ATAN2: return <Atan2Visualizer />;
      case Tab.VECTORS: return <VectorAlgebra />;
      case Tab.QUADRATIC: return <QuadraticSolver />;
      case Tab.TRIG_SOLVER: return <TrigSolver />;
      case Tab.COSINE_LAW: return <CosineLawVisualizer />;
      case Tab.TUTOR: return <GeminiTutor />;
      case Tab.QUIZ: return <Quiz />;
      default: return <CoordinateConverter />;
    }
  };

  // Embed Layout: Minimalist, no header/footer, sticky compact nav
  if (isEmbed) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 px-2 py-2 shadow-sm overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar">
          {Object.values(Tab).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex-shrink-0
                ${activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="p-2">
           {renderContent()}
        </div>
      </div>
    );
  }

  // Standalone Layout: Full Header & Footer
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
