import { useState } from 'react';
import { Card } from '../ui/base/card';
import { Button } from '../ui/base/button';
import { Badge } from '../ui/base/badge';
import type { QuizQuestion } from '../../lib/quiz-types';

interface QuestionWithMetadata extends QuizQuestion {
  quiz_id: number;
  question_index: number;
  quiz_title: string;
}

interface QuestionEditModalProps {
  question: QuestionWithMetadata;
  onSave: (question: QuestionWithMetadata) => void;
  onClose: () => void;
}

export default function QuestionEditModal({ question, onSave, onClose }: QuestionEditModalProps) {
  const [editedQuestion, setEditedQuestion] = useState<QuestionWithMetadata>({...question});
  const [errors, setErrors] = useState<string[]>([]);

  const handleSave = () => {
    const newErrors: string[] = [];

    // Validation
    if (!editedQuestion.question.trim()) {
      newErrors.push('Question text is required');
    }

    if (editedQuestion.options.length < 2) {
      newErrors.push('At least 2 options are required');
    }

    if (editedQuestion.options.some(opt => !opt.trim())) {
      newErrors.push('All options must have text');
    }

    if (!editedQuestion.correct_answer) {
      newErrors.push('Correct answer must be selected');
    }

    if (!editedQuestion.options.includes(editedQuestion.correct_answer)) {
      newErrors.push('Correct answer must be one of the options');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(editedQuestion);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  const addOption = () => {
    if (editedQuestion.options.length < 6) {
      setEditedQuestion({
        ...editedQuestion,
        options: [...editedQuestion.options, '']
      });
    }
  };

  const removeOption = (index: number) => {
    if (editedQuestion.options.length > 2) {
      const newOptions = editedQuestion.options.filter((_, idx) => idx !== index);
      let newCorrectAnswer = editedQuestion.correct_answer;
      
      // If we're removing the correct answer, reset it
      if (editedQuestion.correct_answer === editedQuestion.options[index]) {
        newCorrectAnswer = '';
      }
      
      setEditedQuestion({
        ...editedQuestion,
        options: newOptions,
        correct_answer: newCorrectAnswer
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white/95 backdrop-blur-xl rounded-2xl border-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Edit Question</h2>
            <div className="flex gap-2">
              <Badge className="bg-purple-100 text-purple-800 px-3 py-1 rounded">
                Quiz {editedQuestion.quiz_id}
              </Badge>
              <Badge className="bg-gray-100 text-gray-700 px-3 py-1 rounded">
                Question {editedQuestion.question_index + 1}
              </Badge>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </Button>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Question Text */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text
          </label>
          <textarea
            value={editedQuestion.question}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
            rows={3}
            placeholder="Enter the question..."
          />
        </div>

        {/* Options */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Answer Options
            </label>
            <Button
              onClick={addOption}
              disabled={editedQuestion.options.length >= 6}
              className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Option
            </Button>
          </div>

          <div className="space-y-3">
            {editedQuestion.options.map((option, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  />
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={editedQuestion.correct_answer === option}
                      onChange={() => setEditedQuestion({ ...editedQuestion, correct_answer: option })}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Correct</span>
                  </label>
                </div>
                {editedQuestion.options.length > 2 && (
                  <Button
                    onClick={() => removeOption(idx)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hint */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hint (Optional)
          </label>
          <textarea
            value={editedQuestion.hint || ''}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, hint: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
            rows={2}
            placeholder="Enter a hint to help users..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg shadow-lg transition font-medium"
          >
            Save Changes
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition font-medium"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
