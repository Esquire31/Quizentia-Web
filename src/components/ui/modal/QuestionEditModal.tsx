import React, { useState, useEffect } from 'react';
import { Button } from '../base/button';

interface QuestionEditModalProps {
  isOpen: boolean;
  question: {
    quiz_id: number;
    question_index: number;
    question: string;
    options: string[];
    correct_answer: string;
    hint?: string;
  } | null;
  onSave: (updatedQuestion: {
    quiz_id: number;
    question_index: number;
    question: string;
    options: string[];
    correct_answer: string;
    hint?: string;
  }, questionIndex: number) => void;
  onCancel: () => void;
}

const QuestionEditModal: React.FC<QuestionEditModalProps> = ({
  isOpen,
  question,
  onSave,
  onCancel
}) => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [hint, setHint] = useState('');

  useEffect(() => {
    if (question) {
      setQuestionText(question.question);
      setOptions([...question.options]);
      setCorrectAnswer(question.correct_answer);
      setHint(question.hint || '');
    }
  }, [question]);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const removedOption = options[index];
      const newOptions = options.filter((_, idx) => idx !== index);
      setOptions(newOptions);
      // Update correct answer if it was the removed option
      if (correctAnswer === removedOption) {
        setCorrectAnswer(newOptions[0]);
      }
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    const oldValue = newOptions[index];
    newOptions[index] = value;
    setOptions(newOptions);
    // Update correct answer if it matches the old value
    if (correctAnswer === oldValue) {
      setCorrectAnswer(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionText.trim()) {
      alert('Question text is required');
      return;
    }

    if (options.some(opt => !opt.trim())) {
      alert('All options must have text');
      return;
    }

    if (question) {
      onSave({
        quiz_id: question.quiz_id,
        question_index: question.question_index,
        question: questionText,
        options,
        correct_answer: correctAnswer,
        hint: hint || undefined
      }, question.question_index);
    }
  };

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border-0">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Edit Question
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Question Text *
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none text-gray-600"
              rows={3}
              placeholder="Enter your question here..."
              required
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Answer Options * (2-6 options)
              </label>
              {options.length < 6 && (
                <Button
                  type="button"
                  onClick={handleAddOption}
                  size="sm"
                  className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transition-all"
                >
                  + Add Option
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === option}
                    onChange={() => setCorrectAnswer(option)}
                    className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-600"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      title="Remove option"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Select the radio button to mark the correct answer
            </p>
          </div>

          {/* Hint */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hint (Optional)
            </label>
            <textarea
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none text-gray-600"
              rows={2}
              placeholder="Provide a helpful hint for this question..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 h-11 border-2 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionEditModal;
