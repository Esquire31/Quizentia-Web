import { useState, useEffect } from 'react';
import { Card } from '../ui/base/card';
import { Button } from '../ui/base/button';
import { Badge } from '../ui/base/badge';
import ErrorModal from '../ui/modal/ErrorModal';
import SuccessModal from '../ui/modal/SuccessModal';
import type { QuizQuestion } from '../../lib/quiz-types';
import { API_BASE_URL } from '../../lib/config';
import { useAuth } from '../../contexts/AuthContext';

interface QuestionWithMetadata extends QuizQuestion {
  quiz_id: number;
  quiz_title: string;
  question_index?: number; // Optional for compatibility
  index?: number; // Index from API response
  selected?: boolean; // Selection state from API
}

interface QuizInWeekResponse {
  quiz_definition_id: number;
  quiz_id: number;
  quiz_title: string;
  quiz_url: string;
  total_questions: number;
  selected_count: number;
  questions: Array<{
    index: number;
    selected: boolean;
    question: string;
    options: string[];
    correct_answer: string;
    hint?: string;
  }>;
}

interface WeekQuestionsResponse {
  week_id: string;
  total_quizzes: number;
  total_selected_questions: number;
  backup_pile_count: number;
  quizzes: QuizInWeekResponse[];
}

interface QuestionBasisViewProps {
  weekId: string;
  quizId?: number; // Optional - if provided, show questions for specific quiz
  onBack?: () => void; // Optional - for when viewing single quiz
}

export default function QuestionBasisView({ weekId, quizId, onBack }: QuestionBasisViewProps) {
  const { idToken } = useAuth();
  const [questions, setQuestions] = useState<QuestionWithMetadata[]>([]);
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // const [editingQuestion, setEditingQuestion] = useState<{ question: QuestionWithMetadata; index: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // const [deletingQuestionIndex, setDeletingQuestionIndex] = useState<number | null>(null);
  // const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [initialSelectedQuestions, setInitialSelectedQuestions] = useState<Set<number>>(new Set());
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAllQuestions();
  }, [weekId, quizId]);

  const fetchAllQuestions = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!idToken) {
        setError('Authentication required. Please login again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/weeks/${weekId}/questions/all`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
        } else {
          setError('Failed to load questions.');
        }
        return;
      }

      // Handle week-wide response with nested structure
      const data: WeekQuestionsResponse = await response.json();
      
      // Flatten quizzes into questions with metadata
      const allQuestions: QuestionWithMetadata[] = [];
      const preSelectedIndices = new Set<number>();
      
      data.quizzes.forEach((quiz) => {
        // If quizId is specified, only process that quiz
        if (quizId && quiz.quiz_id !== quizId) {
          return;
        }
        
        // Set quiz title when viewing specific quiz
        if (quizId && quiz.quiz_id === quizId) {
          setQuizTitle(quiz.quiz_title);
        }
        
        quiz.questions.forEach((question) => {
          const questionWithMetadata: QuestionWithMetadata = {
            question: question.question,
            options: question.options,
            correct_answer: question.correct_answer,
            hint: question.hint,
            quiz_id: quiz.quiz_id,
            quiz_title: quiz.quiz_title,
            index: question.index,
            selected: question.selected
          };
          
          // Track which questions should be pre-selected
          if (question.selected) {
            preSelectedIndices.add(allQuestions.length);
          }
          
          allQuestions.push(questionWithMetadata);
        });
      });
      
      setQuestions(allQuestions);
      setSelectedQuestions(preSelectedIndices);
      setInitialSelectedQuestions(preSelectedIndices);
    } catch (err) {
      setError('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleDeleteQuestion = async (questionIndex: number) => {
  //   try {
  //     if (!idToken) {
  //       alert('Authentication required. Please login again.');
  //       return;
  //     }

  //     const question = questions[questionIndex];
  //     
  //     const response = await fetch(`${API_BASE_URL}/admin/quizzes/${question.quiz_id}/questions/${questionIndex}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'accept': 'application/json',
  //         'Authorization': `Bearer ${idToken}`
  //       }
  //     });

  //     if (response.ok) {
  //       setDeletingQuestionIndex(null);
  //       await fetchAllQuestions(); // Refresh the list
  //       setShowDeleteSuccess(true);
  //     } else {
  //       setDeletingQuestionIndex(null);
  //       if (response.status === 401) {
  //         alert('Session expired. Please login again.');
  //       } else {
  //         const data = await response.json();
  //         alert(data.detail || 'Failed to delete question');
  //       }
  //     }
  //   } catch (err) {
  //     setDeletingQuestionIndex(null);
  //     console.error('Error deleting question:', err);
  //     alert('Failed to delete question. Please try again.');
  //   }
  // };

  // const confirmDeleteQuestion = (questionIndex: number) => {
  //   setDeletingQuestionIndex(questionIndex);
  // };

  // const handleSaveQuestion = async (updatedQuestion: { quiz_id: number; question_index: number; question: string; options: string[]; correct_answer: string; hint?: string; }, questionIndex: number) => {
  //   try {
  //     if (!idToken) {
  //       alert('Authentication required. Please login again.');
  //       return;
  //     }

  //     const requestBody = {
  //       question: updatedQuestion.question,
  //       options: updatedQuestion.options,
  //       correct_answer: updatedQuestion.correct_answer,
  //       hint: updatedQuestion.hint || ''
  //     };

  //     const response = await fetch(`${API_BASE_URL}/admin/quizzes/${updatedQuestion.quiz_id}/questions/${questionIndex}`, {
  //       method: 'PUT',
  //       headers: {
  //         'accept': 'application/json',
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${idToken}`
  //       },
  //       body: JSON.stringify(requestBody)
  //     });

  //     if (response.ok) {
  //       await fetchAllQuestions(); // Refresh the list
  //       setEditingQuestion(null);
  //       setShowDeleteSuccess(true);
  //     } else {
  //       if (response.status === 401) {
  //         alert('Session expired. Please login again.');
  //       } else {
  //         const data = await response.json();
  //         alert(data.detail || 'Failed to update question');
  //       }
  //     }
  //   } catch (err) {
  //     console.error('Error updating question:', err);
  //     alert('Failed to update question. Please try again.');
  //   }
  // };

  const hasSelectionChanged = () => {
    if (selectedQuestions.size !== initialSelectedQuestions.size) {
      return true;
    }
    for (const idx of selectedQuestions) {
      if (!initialSelectedQuestions.has(idx)) {
        return true;
      }
    }
    return false;
  };

  const toggleQuestionSelection = (idx: number) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(idx)) {
      newSelected.delete(idx);
    } else {
      newSelected.add(idx);
    }
    setSelectedQuestions(newSelected);
  };

  const selectAllQuestions = () => {
    if (selectedQuestions.size === filteredQuestions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(filteredQuestions.map((_, idx) => idx)));
    }
  };

  const handleSaveSelection = async () => {
    try {
      if (!idToken) {
        alert('Authentication required. Please login again.');
        return;
      }

      const selectedIndices = Array.from(selectedQuestions).sort((a, b) => a - b);

      // Build request body
      let requestBody: any;
      
      if (quizId) {
        // Saving for specific quiz - still use single quiz format
        requestBody = {
          quiz_definition_id: quizId,
          selected_indices: selectedIndices
        };
      } else {
        // Saving for all questions - build selections array
        const selectionsByQuiz: { [quizId: number]: number[] } = {};
        
        selectedIndices.forEach(idx => {
          const question = questions[idx];
          if (question && question.quiz_id !== undefined && question.index !== undefined) {
            if (!selectionsByQuiz[question.quiz_id]) {
              selectionsByQuiz[question.quiz_id] = [];
            }
            selectionsByQuiz[question.quiz_id].push(question.index);
          }
        });
        
        // Convert to selections array format
        const selections = Object.entries(selectionsByQuiz).map(([quizId, indices]) => ({
          quiz_definition_id: parseInt(quizId),
          selected_indices: indices.sort((a, b) => a - b)
        }));
        
        requestBody = {
          selections: selections
        };
      }

      const response = await fetch(`${API_BASE_URL}/admin/weeks/${weekId}/questions/selection`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(`Selection saved successfully! ${selectedIndices.length} question(s) selected.`);
        setSuccessModalOpen(true);
        console.log('Save response:', data);
        // Update initial selections to reflect saved state
        setInitialSelectedQuestions(new Set(selectedQuestions));
      } else {
        const data = await response.json();
        if (response.status === 401) {
          alert('Session expired. Please login again.');
        } else if (response.status === 400) {
          // Show modal for 400 errors
          setErrorMessage(data.detail || 'Bad request. Please check your selection.');
          setErrorModalOpen(true);
        } else {
          alert(data.detail || 'Failed to save selection');
        }
      }
    } catch (err) {
      console.error('Error saving selection:', err);
      alert('Failed to save selection. Please try again.');
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
    <div className="space-y-6 px-6">
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
          {selectedQuestions.size > 0 && (
            <p className="text-sm text-purple-600 mt-1 font-medium">
              {selectedQuestions.size} question{selectedQuestions.size !== 1 ? 's' : ''} selected
            </p>
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
            onClick={selectAllQuestions}
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition whitespace-nowrap"
          >
            {selectedQuestions.size === filteredQuestions.length ? 'Deselect All' : 'Select All'}
          </Button>
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
                  <input
                    type="checkbox"
                    checked={selectedQuestions.has(idx)}
                    onChange={() => toggleQuestionSelection(idx)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                  />
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
              {/* <div className="flex gap-2">
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
              </div> */}
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {/* {editingQuestion && (
        <QuestionEditModal
          isOpen={true}
          question={{ ...editingQuestion.question, question_index: editingQuestion.index }}
          onSave={(q) => handleSaveQuestion(q, editingQuestion.index)}
          onCancel={() => setEditingQuestion(null)}
        />
      )} */}

      {/* Delete Confirmation Modal */}
      {/* <DeleteConfirmModal
        isOpen={deletingQuestionIndex !== null}
        onConfirm={() => {
          if (deletingQuestionIndex !== null) {
            handleDeleteQuestion(deletingQuestionIndex);
          }
        }}
        onCancel={() => setDeletingQuestionIndex(null)}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
      /> */}

      {/* Success Modal */}
      {/* <DeleteSuccessModal
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        message="Operation completed successfully"
      /> */}

      {/* Fixed Bottom Bar with Selection Counter and Save Button */}
      {!quizId && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className={`${
              selectedQuestions.size === 100
                ? 'bg-green-500'
                : 'bg-red-500'
            } text-white px-6 py-3 rounded-lg font-semibold text-lg`}>
              {selectedQuestions.size}/100 questions selected
            </div>
            <Button
              onClick={handleSaveSelection}
              disabled={!hasSelectionChanged()}
              className={`${
                !hasSelectionChanged()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
              } px-6 py-3 rounded-lg transition whitespace-nowrap font-semibold`}
            >
              Save Selection
            </Button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModalOpen}
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        message={successMessage}
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  );
}
