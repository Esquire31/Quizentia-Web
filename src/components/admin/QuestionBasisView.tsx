import { useState, useEffect } from 'react';
import { Card } from '../ui/base/card';
import { Button } from '../ui/base/button';
import { Badge } from '../ui/base/badge';
import type { QuizQuestion } from '../../lib/quiz-types';
import QuestionEditModal from '../ui/modal/QuestionEditModal';
import DeleteConfirmModal from '../ui/modal/DeleteConfirmModal';
import DeleteSuccessModal from '../ui/modal/DeleteSuccessModal';
import { API_BASE_URL } from '../../lib/config';

interface QuestionWithMetadata extends QuizQuestion {
  quiz_id: number;
  quiz_title: string;
  question_index?: number; // Optional for compatibility
}

interface WeekQuestionsResponse {
  week_id: string;
  total_questions: number;
  questions: QuestionWithMetadata[];
}

interface QuizQuestionsResponse {
  quiz_id: number;
  title: string;
  url: string;
  week_id: string;
  total_questions: number;
  questions: QuizQuestion[];
}

interface QuestionBasisViewProps {
  weekId: string;
  quizId?: number; // Optional - if provided, show questions for specific quiz
  onBack?: () => void; // Optional - for when viewing single quiz
}

export default function QuestionBasisView({ weekId, quizId, onBack }: QuestionBasisViewProps) {
  const [questions, setQuestions] = useState<QuestionWithMetadata[]>([]);
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<{ question: QuestionWithMetadata; index: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingQuestionIndex, setDeletingQuestionIndex] = useState<number | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    fetchAllQuestions();
  }, [weekId, quizId]);

  const fetchAllQuestions = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }

      let response;
      
      if (quizId) {
        // Fetch questions for specific quiz
        response = await fetch(`${API_BASE_URL}/admin/quizzes/${quizId}/questions`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // Fetch all questions for the week
        response = await fetch(`${API_BASE_URL}/admin/weeks/${weekId}/questions`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
        } else {
          setError('Failed to load questions.');
        }
        return;
      }

      if (quizId) {
        // Handle quiz-specific response
        const data: QuizQuestionsResponse = await response.json();
        setQuizTitle(data.title);
        const questionsWithMetadata: QuestionWithMetadata[] = data.questions.map((q) => ({
          ...q,
          quiz_id: data.quiz_id,
          quiz_title: data.title
        }));
        setQuestions(questionsWithMetadata);
      } else {
        // Handle week-wide response
        const data: WeekQuestionsResponse = await response.json();
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionIndex: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      const question = questions[questionIndex];
      
      const response = await fetch(`${API_BASE_URL}/admin/quizzes/${question.quiz_id}/questions/${questionIndex}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setDeletingQuestionIndex(null);
        await fetchAllQuestions(); // Refresh the list
        setShowDeleteSuccess(true);
      } else {
        setDeletingQuestionIndex(null);
        if (response.status === 401) {
          alert('Session expired. Please login again.');
        } else {
          const data = await response.json();
          alert(data.detail || 'Failed to delete question');
        }
      }
    } catch (err) {
      setDeletingQuestionIndex(null);
      console.error('Error deleting question:', err);
      alert('Failed to delete question. Please try again.');
    }
  };

  const confirmDeleteQuestion = (questionIndex: number) => {
    setDeletingQuestionIndex(questionIndex);
  };

  const handleSaveQuestion = async (updatedQuestion: { quiz_id: number; question_index: number; question: string; options: string[]; correct_answer: string; hint?: string; }, questionIndex: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      const requestBody = {
        question: updatedQuestion.question,
        options: updatedQuestion.options,
        correct_answer: updatedQuestion.correct_answer,
        hint: updatedQuestion.hint || ''
      };

      const response = await fetch(`${API_BASE_URL}/admin/quizzes/${updatedQuestion.quiz_id}/questions/${questionIndex}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        await fetchAllQuestions(); // Refresh the list
        setEditingQuestion(null);
        setShowDeleteSuccess(true);
      } else {
        if (response.status === 401) {
          alert('Session expired. Please login again.');
        } else {
          const data = await response.json();
          alert(data.detail || 'Failed to update question');
        }
      }
    } catch (err) {
      console.error('Error updating question:', err);
      alert('Failed to update question. Please try again.');
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.quiz_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Loading questions...</p>
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
      {/* Back button for single quiz view */}
      {quizId && onBack && (
        <Button
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
        >
          ← Back to Quizzes
        </Button>
      )}

      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {quizId ? `Questions for: ${quizTitle}` : `All Questions (${questions.length})`}
          </h2>
          {quizId && (
            <p className="text-sm text-gray-600 mt-1">Quiz ID: {quizId}</p>
          )}
        </div>
        <div className="flex gap-2 flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <Button
            onClick={fetchAllQuestions}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
          >
            Refresh
          </Button>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <Card className="p-12 text-center bg-white/70 backdrop-blur-xl rounded-2xl border-0">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No questions match your search' : 'No questions found'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question, idx) => (
            <Card key={idx} className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl border-0 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {!quizId && (
                    <Badge className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                      Quiz {question.quiz_id}
                    </Badge>
                  )}
                  <Badge className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                    Question {idx + 1}
                  </Badge>
                </div>
              </div>

              {/* Quiz Title for week view */}
              {!quizId && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600">{question.quiz_title}</p>
                </div>
              )}

              {/* Question Text */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {question.question}
                </h3>

                {/* Options */}
                <div className="space-y-2 mb-3">
                  {question.options.map((option, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-lg ${
                        option === question.correct_answer
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <span className="font-medium text-gray-700">
                        {String.fromCharCode(65 + optIdx)}.{' '}
                      </span>
                      <span className="text-gray-800">{option}</span>
                      {option === question.correct_answer && (
                        <Badge className="ml-2 bg-green-600 text-white px-2 py-0.5 rounded text-xs">
                          Correct
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {/* Hint */}
                {question.hint && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-sm font-medium text-yellow-800">Hint: </span>
                    <span className="text-sm text-yellow-700">{question.hint}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setEditingQuestion({ question, index: idx })}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg shadow-lg transition"
                >
                  Edit Question
                </Button>
                <Button
                  onClick={() => confirmDeleteQuestion(idx)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                >
                  Delete Question
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingQuestion && (
        <QuestionEditModal
          isOpen={true}
          question={{ ...editingQuestion.question, question_index: editingQuestion.index }}
          onSave={(q) => handleSaveQuestion(q, editingQuestion.index)}
          onCancel={() => setEditingQuestion(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingQuestionIndex !== null}
        onConfirm={() => {
          if (deletingQuestionIndex !== null) {
            handleDeleteQuestion(deletingQuestionIndex);
          }
        }}
        onCancel={() => setDeletingQuestionIndex(null)}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
      />

      {/* Success Modal */}
      <DeleteSuccessModal
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        message="Operation completed successfully"
      />
    </div>
  );
}
