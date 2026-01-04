import { useState, useEffect } from 'react';
import { Card } from '../ui/base/card';
import { Button } from '../ui/base/button';
import { Badge } from '../ui/base/badge';
import { API_BASE_URL } from '../../lib/config';
import QuestionBasisView from './QuestionBasisView';

interface AdminQuizItem {
  id: number;
  title: string;
  url: string;
  questions_count: number;
  week_id: string;
  quiz_definition_id: number;
  created_at: string;
}

interface AdminQuizzesResponse {
  week_id: string;
  total_quizzes: number;
  quizzes: AdminQuizItem[];
}

interface QuizBasisViewProps {
  weekId: string;
}

export default function QuizBasisView({ weekId }: QuizBasisViewProps) {
  const [quizzes, setQuizzes] = useState<AdminQuizItem[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, [weekId]);

  // If a quiz is selected, show QuestionBasisView for that quiz
  if (selectedQuizId) {
    return (
      <QuestionBasisView
        weekId={weekId}
        quizId={selectedQuizId}
        onBack={() => setSelectedQuizId(null)}
      />
    );
  }

  const fetchQuizzes = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/weeks/${weekId}/quizzes`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
        } else {
          setError('Failed to load quizzes.');
        }
        return;
      }

      const data: AdminQuizzesResponse = await response.json();
      setQuizzes(data.quizzes);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm(`Are you sure you want to delete this quiz? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      // TODO: API call to delete quiz
      // const response = await fetch(`http://localhost:8000/admin/quizzes/${quizId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // if (response.ok) {
      //   setQuizzes(quizzes.filter(q => q.id !== quizId));
      //   alert('Quiz deleted successfully');
      // } else {
      //   const data = await response.json();
      //   alert(data.detail || 'Failed to delete quiz');
      // }

      // Mock deletion for now
      setQuizzes(quizzes.filter(q => q.id !== quizId));
      alert('Quiz deleted successfully (API not yet implemented)');
    } catch (err) {
      console.error('Error deleting quiz:', err);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Individual Quizzes ({quizzes.length})
        </h2>
        <Button
          onClick={fetchQuizzes}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
        >
          Refresh
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <Card className="p-12 text-center bg-white/70 backdrop-blur-xl rounded-2xl border-0">
          <p className="text-gray-500 text-lg">No quizzes found for this week</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl border-0 hover:shadow-lg transition flex flex-col h-full">
              {/* Content area that will grow */}
              <div className="flex-1">
                {/* Title and Badges */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{quiz.title}</h3>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <Badge className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                      Quiz ID: {quiz.quiz_definition_id}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {quiz.questions_count} question{quiz.questions_count !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(quiz.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Article URL */}
                {quiz.url && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-1">Article URL:</p>
                    <a 
                      href={quiz.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-800 break-all underline"
                    >
                      {quiz.url}
                    </a>
                  </div>
                )}
              </div>

              {/* Actions - pinned to bottom */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => setSelectedQuizId(quiz.quiz_definition_id)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg shadow-lg transition"
                >
                  View/Edit
                </Button>
                <Button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                >
                  Delete Quiz
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
