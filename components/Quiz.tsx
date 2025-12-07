import React, { useState, useEffect } from 'react';
import { round, toDegrees, toRadians, solveQuadratic } from '../utils/mathUtils';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    generateNewQuiz();
  }, []);

  const generateNewQuiz = () => {
    const newQuestions: Question[] = [];

    // 1. Vector Magnitude
    const ax = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const ay = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const mag = round(Math.sqrt(ax * ax + ay * ay));
    const distractor1 = round(mag + 1.5);
    const distractor2 = round(ax + ay);
    const distractor3 = round(Math.abs(ax - ay));
    
    newQuestions.push({
      id: 1,
      text: `Calculate the magnitude of vector A = (${ax}, ${ay}).`,
      options: shuffle([`${mag}`, `${distractor1}`, `${distractor2}`, `${distractor3}`]),
      correctIndex: 0, // Will be fixed after shuffle logic
      hint: "The magnitude is the length of the hypotenuse: √(x² + y²).",
      explanation: `Magnitude = √(${ax}² + ${ay}²) = √(${ax*ax + ay*ay}) ≈ ${mag}`
    });

    // 2. Atan2 Quadrant
    newQuestions.push({
      id: 2,
      text: "Which function should be used to find the angle of a vector (-1, -1) to ensure the correct quadrant is identified?",
      options: ["atan(y/x)", "atan2(y, x)", "sin(x)", "cos(y)"],
      correctIndex: 1,
      hint: "Standard arctan loses quadrant information because (-1)/(-1) = 1, same as 1/1.",
      explanation: "atan2(y, x) accounts for the signs of both coordinates, correctly placing the angle in Quadrant III (-135°), whereas atan(-1/-1) would return 45° (Quadrant I)."
    });

    // 3. Vector Addition
    const v1x = 2, v1y = 1;
    const v2x = 1, v2y = 3;
    const rx = v1x + v2x;
    const ry = v1y + v2y;
    newQuestions.push({
      id: 3,
      text: `Given Vector A=(${v1x}, ${v1y}) and Vector B=(${v2x}, ${v2y}), what are the coordinates of the resultant R = A + B?`,
      options: shuffle([`(${rx}, ${ry})`, `(${rx-1}, ${ry})`, `(${v1x*v2x}, ${v1y*v2y})`, `(${Math.abs(v1x-v2x)}, ${Math.abs(v1y-v2y)})`]),
      correctIndex: 0,
      hint: "Add the components separately: Rx = Ax + Bx, Ry = Ay + By.",
      explanation: `Rx = ${v1x}+${v2x}=${rx}, Ry = ${v1y}+${v2y}=${ry}.`
    });

    // 4. Quadratic Roots
    const a = 1, b = -4, c = 4; // x^2 - 4x + 4 = 0, D=0
    newQuestions.push({
      id: 4,
      text: `For the equation x² - 4x + 4 = 0, what does the discriminant (D = b² - 4ac) indicate?`,
      options: ["No real roots", "Two distinct real roots", "One repeated real root", "Infinite roots"],
      correctIndex: 2,
      hint: "Calculate b² - 4ac. If it's zero, the parabola touches the x-axis at exactly one point.",
      explanation: `D = (-4)² - 4(1)(4) = 16 - 16 = 0. A discriminant of zero means there is exactly one real root (a limiting position in kinematics).`
    });

    // 5. Trig Solver Concept
    newQuestions.push({
      id: 5,
      text: "In the context of the Vector Loop Method, what substitution is used to convert A cos(θ) + B sin(θ) + C = 0 into a polynomial?",
      options: ["t = tan(θ)", "t = sin(θ)", "t = tan(θ/2)", "t = cos(2θ)"],
      correctIndex: 2,
      hint: "It involves a half-angle identity to express both sine and cosine as rational functions of 't'.",
      explanation: "The tangent half-angle substitution t = tan(θ/2) allows us to write cos(θ) = (1-t²)/(1+t²) and sin(θ) = 2t/(1+t²)."
    });

    // Fix indices after shuffle
    const finalQuestions = newQuestions.map(q => {
      // Find the correct answer string from the originally created correct option (which was index 0 before shuffle for dynamically created ones)
      // For static ones, I need to be careful.
      // Simplification: Let's not shuffle correctly for this quick implementation or handle it carefully.
      // Re-implementing simplified shuffle:
      if(q.id === 2 || q.id === 4 || q.id === 5) return q; // Static options, don't shuffle to keep logic simple

      const correctVal = q.options[0]; // Logic above assumed 0 was correct for generated ones
      const shuffled = [...q.options].sort(() => Math.random() - 0.5);
      const newIndex = shuffled.indexOf(correctVal);
      return { ...q, options: shuffled, correctIndex: newIndex };
    });

    setQuestions(finalQuestions);
    setCurrentIndex(0);
    setScore(0);
    setQuizCompleted(false);
    resetState();
  };

  const shuffle = (array: string[]) => {
    // Basic shuffle
    return array; // We handle shuffle logic in the map above to track index
  };

  const resetState = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowHint(false);
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    const correct = index === questions[currentIndex].correctIndex;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      resetState();
    } else {
      setQuizCompleted(true);
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto mt-4">
      {!quizCompleted ? (
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-sm font-bold text-blue-600">Score: {score}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-6">{currentQ.text}</h3>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full p-4 text-left rounded-lg border-2 transition-all ";
              if (selectedOption === null) {
                btnClass += "border-slate-200 hover:border-blue-400 hover:bg-blue-50";
              } else {
                if (idx === currentQ.correctIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-900";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-500 bg-red-50 text-red-900";
                } else {
                  btnClass += "border-slate-100 opacity-50";
                }
              }

              return (
                <button 
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={selectedOption !== null}
                  className={btnClass}
                >
                  <div className="flex items-center">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 text-sm font-bold
                      ${idx === currentQ.correctIndex && selectedOption !== null ? 'bg-green-500 text-white border-green-500' : 'border-slate-300 text-slate-500'}
                    `}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 min-h-[100px]">
            {selectedOption === null ? (
               <div className="flex items-center">
                 <button 
                   onClick={() => setShowHint(true)}
                   className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                 >
                   <span className="text-lg">💡</span> Need a hint?
                 </button>
                 {showHint && (
                   <div className="ml-4 p-3 bg-amber-50 text-amber-800 text-sm rounded border border-amber-100 animate-fadeIn">
                     {currentQ.hint}
                   </div>
                 )}
               </div>
            ) : (
              <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="font-bold mb-1">{isCorrect ? 'Correct!' : 'Incorrect'}</div>
                <div className="text-sm">{currentQ.explanation}</div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={nextQuestion}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold"
                  >
                    {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
          <p className="text-slate-600 mb-8">You scored {score} out of {questions.length}</p>
          
          <div className="w-full bg-slate-100 rounded-full h-4 mb-8 overflow-hidden">
             <div 
               className="bg-blue-600 h-full transition-all duration-1000"
               style={{ width: `${(score / questions.length) * 100}%` }}
             ></div>
          </div>

          <button 
            onClick={generateNewQuiz}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;