
export interface Vector2D {
  x: number;
  y: number;
}

export enum Tab {
  COORDINATES = 'Coordinates',
  ATAN2 = 'Atan2',
  VECTORS = 'Vectors',
  QUADRATIC = 'Quadratic',
  TRIG_SOLVER = 'Trig Solver',
  COSINE_LAW = 'Cosine Law',
  TUTOR = 'AI Tutor',
  QUIZ = 'Quiz'
}

export interface Point {
  x: number;
  y: number;
  label?: string;
}
