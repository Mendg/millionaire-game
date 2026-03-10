export interface Answer {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface Question {
  id: string;
  question: string;
  answers: Answer;
  correct: 'A' | 'B' | 'C' | 'D';
}
