export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  hint?: string;
}

export interface QuizQuestionWithMetadata extends QuizQuestion {
  quiz_id: number;
  quiz_title: string;
  quiz_url: string;
}

export interface WeeklyQuestionsResponse {
  week_id: string;
  total_questions: number;
  questions: QuizQuestionWithMetadata[];
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
  week_id: string;
  week_label: string;
  quiz_ids: number[];
  quizzes: WeeklyQuizItem[];
}

export interface QuizAnswerSubmission {
  quiz_id: number;
  question_index: number;
  selected_answer: string;
}

export interface QuizResultSubmission {
  week_id: string;
  answers: QuizAnswerSubmission[];
}

export interface QuizResultResponse {
  id: number;
  user_id: string;
  week_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  attempt_number: number;
  is_best: boolean;
  is_new_best: boolean;
  completed_at: string;
}

export interface WeekResultAnswer {
  quiz_id: number;
  question_index: number;
  selected_answer: string;
  is_correct: boolean;
}

export interface WeekResultsAttempt {
  id: number;
  attempt_number: number;
  score: number;
  total_questions: number;
  percentage: number;
  is_best: boolean;
  completed_at: string;
  answers: WeekResultAnswer[];
}

export interface WeekResultsResponse {
  week_id: string;
  total_attempts: number;
  attempts: WeekResultsAttempt[];
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