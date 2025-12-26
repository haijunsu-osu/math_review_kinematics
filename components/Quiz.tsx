
import React, { useState, useEffect } from 'react';
import { round, toDegrees, toRadians } from '../utils/mathUtils';

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
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [pendingSelection, setPendingSelection] = useState<number | null>(null);
  const [hintsUsed, setHintsUsed] = useState<boolean[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    generateNewQuiz();
  }, []);

  const generateNewQuiz = () => {
    const pool: Question[] = [];

    // 1. Vector Magnitude (Generated)
    const ax = Math.floor(Math.random() * 5) + 3;
    const ay = Math.floor(Math.random() * 5) + 3;
    const mag = round(Math.sqrt(ax * ax + ay * ay));
    pool.push(createDynamicQuestion(
      1,
      `Calculate the magnitude of vector A = (${ax}, ${ay}).`,
      [`${mag}`, `${round(mag + 1.2)}`, `${ax + ay}`, `${round(Math.abs(ax - ay))}`],
      "Magnitude = √(x² + y²).",
      `|A| = √(${ax}² + ${ay}²) = √(${ax * ax + ay * ay}) ≈ ${mag}.`
    ));

    // 2. Atan2 Quadrant (Static)
    pool.push({
      id: 2,
      text: "Why is atan2(y, x) preferred over atan(y/x) in kinematic analysis?",
      options: [
        "It is faster to compute.",
        "It handles the full 360° range and quadrant ambiguity.",
        "It only works with positive numbers.",
        "It is required by the Law of Sines."
      ],
      correctIndex: 1,
      hint: "Standard arctan loses sign information when dividing y by x.",
      explanation: "atan2(y, x) uses the individual signs of y and x to determine which of the 4 quadrants the vector is in, returning an angle from -180° to 180°."
    });

    // 3. Vector Addition (Generated)
    const v1 = { x: 2, y: 5 }, v2 = { x: -3, y: 1 };
    pool.push(createDynamicQuestion(
      3,
      `If Vector A = (${v1.x}, ${v1.y}) and Vector B = (${v2.x}, ${v2.y}), what is R = A + B?`,
      [`(${v1.x + v2.x}, ${v1.y + v2.y})`, `(${v1.x - v2.x}, ${v1.y - v2.y})`, `(${v1.x * v2.x}, ${v1.y * v2.y})`, "(0, 0)"],
      "Add the x-components and y-components separately.",
      `Rx = ${v1.x} + (${v2.x}) = ${v1.x + v2.x}, Ry = ${v1.y} + ${v2.y} = ${v1.y + v2.y}.`
    ));

    // 4. Cosine Law: Solve for Side (Generated)
    const sideA = 5, sideB = 8, angleC = 90;
    const sideC = round(Math.sqrt(sideA**2 + sideB**2 - 2*sideA*sideB*Math.cos(toRadians(angleC))));
    pool.push(createDynamicQuestion(
      4,
      `Using the Law of Cosines, find side 'c' if a=${sideA}, b=${sideB}, and angle C=${angleC}°.`,
      [`${sideC}`, `${sideA + sideB}`, `${round(sideC - 2.5)}`, `${round(sideC + 4.1)}`],
      "c² = a² + b² - 2ab cos(C).",
      `c = √(${sideA}² + ${sideB}² - 2·${sideA}·${sideB}·cos(${angleC}°)). Since cos(90°)=0, c = √(25+64) = √89 ≈ ${sideC}.`
    ));

    // 5. Trig Solver Identity (Static)
    pool.push({
      id: 5,
      text: "Which identity is correct when using the half-angle substitution t = tan(θ/2)?",
      options: [
        "cos(θ) = (1 - t²) / (1 + t²)",
        "cos(θ) = 2t / (1 + t²)",
        "sin(θ) = (1 - t²) / (1 + t²)",
        "tan(θ) = t / 2"
      ],
      correctIndex: 0,
      hint: "Cosine is the ratio involving the difference of squares in the numerator.",
      explanation: "The half-angle substitution yields cos(θ) = (1-t²)/(1+t²) and sin(θ) = 2t/(1+t²). This is vital for solving kinematic loop equations."
    });

    // 6. Quadratic Discriminant (Static)
    pool.push({
      id: 6,
      text: "A mechanism's position analysis leads to a quadratic with a negative discriminant (D < 0). What does this mean physically?",
      options: [
        "The mechanism is at a limit position.",
        "The mechanism cannot be assembled in that configuration.",
        "There are two possible assembly modes.",
        "The linkage is moving at constant velocity."
      ],
      correctIndex: 1,
      hint: "Think about the existence of real roots.",
      explanation: "A negative discriminant means there are no real solutions for the angles, indicating the lengths provided cannot form a closed loop (physically impossible assembly)."
    });

    // 7. Trig Solver Form (Static)
    pool.push({
      id: 7,
      text: "When solving A cos(θ) + B sin(θ) + C = 0 via t=tan(θ/2), what is the resulting coefficient for the t² term?",
      options: ["C - A", "C + A", "2B", "A + B + C"],
      correctIndex: 0,
      hint: "Look at the derivation: A(1-t²) + B(2t) + C(1+t²) = 0.",
      explanation: "Expanding A - At² + 2Bt + C + Ct² = 0 gives (C - A)t² + 2Bt + (C + A) = 0. The t² coefficient is (C - A)."
    });

    // 8. Cosine Law: Angle (Generated)
    pool.push(createDynamicQuestion(
      8,
      "If a triangle has sides a=3, b=4, and c=5, what is the angle C opposite to side c?",
      ["90°", "45°", "60°", "30°"],
      "Recall the Pythagorean triple (3, 4, 5).",
      "cos(C) = (3² + 4² - 5²) / (2·3·4) = (9 + 16 - 25) / 24 = 0. Therefore, C = arccos(0) = 90°."
    ));

    // 9. Quadratic Assembly Modes (Static)
    pool.push({
      id: 9,
      text: "A positive discriminant (D > 0) in a position analysis equation typically represents:",
      options: [
        "A single unique position.",
        "Two distinct assembly modes (e.g., 'elbow up' and 'elbow down').",
        "A singularity where the mechanism locks.",
        "An invalid linkage length."
      ],
      correctIndex: 1,
      hint: "D > 0 provides two real roots for the angle.",
      explanation: "Two real roots for 't' (and thus θ) correspond to the two different ways the linkage can be put together to satisfy the loop closure."
    });

    // 10. Vector Dot Product (Static)
    pool.push({
      id: 10,
      text: "The dot product of two perpendicular vectors is always:",
      options: ["1", "-1", "0", "Infinity"],
      correctIndex: 2,
      hint: "A · B = |A||B| cos(θ). What is cos(90°)?",
      explanation: "The dot product involves cos(θ). Since cos(90°) = 0, the dot product of perpendicular vectors is always zero."
    });

    setQuestions(pool);
    setCurrentIndex(0);
    setAnswers(new Array(pool.length).fill(null));
    setPendingSelection(null);
    setHintsUsed(new Array(pool.length).fill(false));
    setQuizCompleted(false);
  };

  const createDynamicQuestion = (id: number, text: string, options: string[], hint: string, explanation: string): Question => {
    const correctVal = options[0];
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    return {
      id,
      text,
      options: shuffled,
      correctIndex: shuffled.indexOf(correctVal),
      hint,
      explanation
    };
  };

  const handleOptionClick = (index: number) => {
    if (answers[currentIndex] !== null) return;
    setPendingSelection(index);
  };

  const handleSubmit = () => {
    if (pendingSelection === null || answers[currentIndex] !== null) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = pendingSelection;
    setAnswers(newAnswers);
  };

  const toggleHint = () => {
    const newHints = [...hintsUsed];
    newHints[currentIndex] = true;
    setHintsUsed(newHints);
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    // If the question was already answered, restore that selection as pending just in case 
    // (though handleSubmit won't let them change it)
    setPendingSelection(answers[index]);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setPendingSelection(answers[nextIdx]);
    } else {
      setQuizCompleted(true);
    }
  };

  const score = answers.reduce((acc, ans, idx) => {
    return ans === questions[idx]?.correctIndex ? acc + 1 : acc;
  }, 0);

  const allAnswered = answers.every(a => a !== null);

  if (questions.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const currentQ = questions[currentIndex];
  const submittedAnswer = answers[currentIndex];
  const isAnswered = submittedAnswer !== null;
  const showHint = hintsUsed[currentIndex];
  const isCorrect = isAnswered && submittedAnswer === currentQ.correctIndex;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto mt-4 transition-all duration-300">
      {!quizCompleted ? (
        <div className="p-8">
          {/* Question Navigation Bar */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {questions.map((_, idx) => {
              const answered = answers[idx] !== null;
              const active = currentIndex === idx;
              const correct = answered && answers[idx] === questions[idx].correctIndex;
              
              let navClass = "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all border-2 ";
              if (active) {
                navClass += "border-blue-600 bg-blue-50 text-blue-600 scale-110 shadow-sm ";
              } else if (answered) {
                navClass += correct ? "border-emerald-200 bg-emerald-50 text-emerald-600 " : "border-rose-200 bg-rose-50 text-rose-600 ";
              } else {
                navClass += "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-slate-100 ";
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => goToQuestion(idx)}
                  className={navClass}
                  title={`Go to question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
              <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500" 
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Running Score</span>
              <div className="text-blue-600 font-bold">{score} / {questions.length}</div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-8 leading-tight">{currentQ.text}</h3>

          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ";
              
              if (!isAnswered) {
                // Pre-submission state
                if (pendingSelection === idx) {
                  btnClass += "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-100";
                } else {
                  btnClass += "border-slate-100 bg-slate-50 hover:border-blue-300 hover:bg-blue-50 group";
                }
              } else {
                // Post-submission state
                if (idx === currentQ.correctIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-900";
                } else if (idx === submittedAnswer) {
                  btnClass += "border-red-500 bg-red-50 text-red-900";
                } else {
                  btnClass += "border-slate-50 opacity-40";
                }
              }

              return (
                <button 
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors
                    ${!isAnswered ? 
                      (pendingSelection === idx ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500') : 
                      (idx === currentQ.correctIndex ? 'bg-green-500 text-white' : 
                      idx === submittedAnswer ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-300')}
                  `}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-medium">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 min-h-[140px]">
            {!isAnswered ? (
               <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                    <button 
                      onClick={toggleHint}
                      className="text-sm text-amber-600 hover:text-amber-700 font-bold flex items-center gap-2 px-3 py-1 rounded-full border border-amber-200 bg-amber-50 transition-colors"
                    >
                      <span>💡</span> Get a Hint
                    </button>
                    
                    <button 
                      onClick={handleSubmit}
                      disabled={pendingSelection === null}
                      className="px-10 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                    >
                      Submit Answer
                    </button>
                 </div>
                 
                 {showHint && (
                   <div className="p-4 bg-amber-50 text-amber-900 text-sm rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-2 duration-300 w-full">
                     <p className="font-semibold mb-1">Tutor's Hint:</p>
                     {currentQ.hint}
                   </div>
                 )}
               </div>
            ) : (
              <div className={`p-5 rounded-xl border-2 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200 animate-in shake duration-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                   <span className={`text-xl font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                     {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                   </span>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed font-medium">
                  {currentQ.explanation}
                </div>
                <div className="mt-5 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium italic">Review complete. Move to the next question.</span>
                  <button 
                    onClick={nextQuestion}
                    className="px-8 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold shadow-lg transition-transform active:scale-95"
                  >
                    {currentIndex === questions.length - 1 ? (allAnswered ? 'Finish Quiz' : 'Final Results') : 'Next Question'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-gradient-to-b from-blue-50 to-white">
          <div className="text-7xl mb-6">🎓</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Review Complete!</h2>
          <p className="text-slate-500 mb-8 font-medium">You've finished the Kinematic Math Foundations Quiz.</p>
          
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8" 
                strokeDasharray={`${(score / questions.length) * 282.7} 282.7`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000 ease-out"
              />
              <text x="50" y="50" textAnchor="middle" dy="7" className="text-2xl font-bold fill-slate-800">
                {Math.round((score / questions.length) * 100)}%
              </text>
            </svg>
          </div>

          <div className="text-lg font-bold text-slate-700 mb-8">
            You scored <span className="text-blue-600 text-2xl px-1">{score}</span> out of {questions.length}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={generateNewQuiz}
              className="px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:-translate-y-1"
            >
              Retake Quiz
            </button>
            <button 
              onClick={() => {
                setQuizCompleted(false);
                setCurrentIndex(0);
                setPendingSelection(answers[0]);
              }}
              className="px-10 py-3 bg-white text-slate-600 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              Review My Answers
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
