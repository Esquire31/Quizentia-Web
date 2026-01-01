export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  hint?: string;
}

export interface QuizData {
  id?: string;
  title: string;
  questions: QuizQuestion[];
  startDate?: string;
  endDate?: string;
  quiz_id?: number;
  created_at?: string;
}

export interface QuizListItem {
  quiz_id: string;
  title: string;
}

export interface WeeklyQuizItem {
  id: number;
  quiz_id: number;
  title: string;
  created_at: string;
}

export interface WeeklyQuizData {
  week_label: string;
  quiz_ids: number[];
  quizzes: WeeklyQuizItem[];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomQuizIds(quizIds: number[], count: number = 10): number[] {
  const shuffled = shuffleArray(quizIds);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}