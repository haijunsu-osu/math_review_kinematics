export const toDegrees = (rad: number) => (rad * 180) / Math.PI;
export const toRadians = (deg: number) => (deg * Math.PI) / 180;

export const round = (num: number, decimals: number = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

// Generates points for a quadratic function y = ax^2 + bx + c
export const generateQuadraticData = (a: number, b: number, c: number, range: number = 10) => {
  const data = [];
  const step = range / 50;
  for (let x = -range; x <= range; x += step) {
    data.push({ x, y: a * x * x + b * x + c });
  }
  return data;
};

// Generates points for the trig function y = Acos(th) + Bsin(th) + C
export const generateTrigFunctionData = (A: number, B: number, C: number) => {
  const data = [];
  // Plot from -180 to 180 degrees
  for (let deg = -180; deg <= 180; deg += 5) {
    const rad = toRadians(deg);
    data.push({ 
      theta: deg, 
      y: A * Math.cos(rad) + B * Math.sin(rad) + C 
    });
  }
  return data;
};

export const solveQuadratic = (a: number, b: number, c: number) => {
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return [];
  if (discriminant === 0) return [-b / (2 * a)];
  const sqrtD = Math.sqrt(discriminant);
  return [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)];
};

// Solves Acos(x) + Bsin(x) + C = 0 using half-angle substitution
export const solveTrigEquation = (A: number, B: number, C: number) => {
  // t = tan(theta/2)
  // cos(theta) = (1-t^2)/(1+t^2)
  // sin(theta) = 2t/(1+t^2)
  // A(1-t^2) + B(2t) + C(1+t^2) = 0
  // A - At^2 + 2Bt + C + Ct^2 = 0
  // (C - A)t^2 + (2B)t + (A + C) = 0
  
  const a_quad = C - A;
  const b_quad = 2 * B;
  const c_quad = A + C;

  // Special case: C = A, so coefficient of t^2 is 0. Linear equation 2Bt + (A+C) = 0
  if (Math.abs(a_quad) < 1e-10) {
    if (Math.abs(b_quad) < 1e-10) return []; // Degenerate
    const t = -c_quad / b_quad;
    const theta = 2 * Math.atan(t);
    return [toDegrees(theta)]; 
  }

  const roots_t = solveQuadratic(a_quad, b_quad, c_quad);
  return roots_t.map(t => {
    let theta = 2 * Math.atan(t);
    return toDegrees(theta);
  });
};