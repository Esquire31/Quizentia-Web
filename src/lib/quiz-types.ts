export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  hint?: string;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}