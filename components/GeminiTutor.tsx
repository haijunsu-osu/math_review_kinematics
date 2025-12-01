import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `
You are an expert tutor in Kinematic Analysis of Mechanisms. 
Your goal is to help students understand the mathematical foundations derived from the vector loop method.

Key Concepts to Cover:
1. Trigonometric Identities: 
   - Pythagorean: sin^2 + cos^2 = 1 (used to eliminate angles).
   - Half-Angle: cos(th) = (1-t^2)/(1+t^2), sin(th) = 2t/(1+t^2) where t=tan(th/2). Used to turn trig equations into polynomials.
2. Law of Cosines: c^2 = a^2 + b^2 - 2ab*cos(C).
3. Quadratic Equations: Roots physical meaning (Discriminant < 0 impossible assembly, D=0 limit position, D>0 two assembly modes).
4. Vector Algebra: 
   - Loop closure equation: Sum of vectors around loop is zero.
   - Atan2: Essential for resolving quadrant ambiguity vs standard atan.
   - Vector addition (head-to-tail) and dot products.

Keep answers concise, educational, and focused on planar linkages (4-bar mechanisms). Use Markdown for formatting.
`;

const GeminiTutor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your Kinematics Tutor. Ask me about vector loops, trig identities, or how to solve mechanism positions.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    const win = window as any;
    if (win.aistudio && win.aistudio.hasSelectedApiKey) {
      const has = await win.aistudio.hasSelectedApiKey();
      setHasKey(has);
    } else {
        // Fallback for dev environments where window.aistudio might not be mocked
        setHasKey(true); 
    }
  };

  const handleSelectKey = async () => {
    const win = window as any;
    if (win.aistudio && win.aistudio.openSelectKey) {
      await win.aistudio.openSelectKey();
      setHasKey(true); // Optimistic update as per instructions
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Re-instantiate to ensure key is fresh
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: userMsg });
      const responseText = result.text;

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again or check your API key." }]);
      const win = window as any;
      if (win.aistudio) {
          setHasKey(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-6 text-center space-y-4 bg-white rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800">AI Tutor Access</h3>
        <p className="text-slate-600 max-w-md">To use the AI Tutor, please select a valid Google Cloud API Key. This requires a paid project for certain models.</p>
        <button 
          onClick={handleSelectKey}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Select API Key
        </button>
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-sm text-blue-500 underline">
          Billing Documentation
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <h3 className="font-bold text-slate-800">Kinematics AI Tutor</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-slate-100 p-3 rounded-lg text-sm text-slate-500 italic animate-pulse">
               Thinking...
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about vector loops or solving equations..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiTutor;