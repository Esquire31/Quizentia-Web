import { auth } from './firebase';
import { API_BASE_URL } from './config';
import type { WeeklyQuizData, QuizData } from './quiz-types';

/**
 * Get authentication headers with Firebase ID token
 * @returns Headers object with Authorization and Content-Type
 * @throws Error if user is not authenticated
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const idToken = await user.getIdToken();
  return {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  };
}

/**
 * Fetch weekly quizzes from the API
 * @param maxWeeks - Maximum number of weeks to fetch (default: 10)
 * @returns Array of weekly quiz data
 */
export async function fetchWeeklyQuizzes(maxWeeks: number = 10): Promise<WeeklyQuizData[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/quizzes/weekly?max_weeks=${maxWeeks}`, {
    headers
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch weekly quizzes: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Get specific quizzes by their IDs and merge them into a single quiz
 * @param quizIds - Array of quiz IDs to fetch
 * @returns Merged quiz data
 */
export async function getQuizzes(quizIds: number[]): Promise<QuizData> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/quizzes/get`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ quiz_ids: quizIds })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch quizzes: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Generate a new quiz from a URL
 * @param url - URL to generate quiz from
 * @returns Generated quiz data
 */
export async function generateQuiz(url: string): Promise<QuizData> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/generate_quiz`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ url })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to generate quiz: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Generic API call helper with authentication
 * @param endpoint - API endpoint (relative to API_BASE_URL)
 * @param options - Fetch options
 * @returns Response data
 */
export async function authenticatedFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Check if user is authenticated
 * @returns true if user is authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}
