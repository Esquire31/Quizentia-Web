// Get the API base URL from environment variables
// Falls back to localhost for development if not set
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Log the API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('API_BASE_URL:', API_BASE_URL);
}
