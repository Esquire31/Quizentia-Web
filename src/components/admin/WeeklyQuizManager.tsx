import { useState } from 'react';
import { Card } from '../ui/base/card';
import { Button } from '../ui/base/button';
import QuizBasisView from './QuizBasisView';
import QuestionBasisView from './QuestionBasisView';
import { ArrowLeft } from 'lucide-react';

interface WeeklyQuizManagerProps {
  weekLabel: string;
  weekId: string;
  quizIds: number[];
  onBack: () => void;
  onLogout: () => void;
}

type ViewMode = 'quiz' | 'question';

export default function WeeklyQuizManager({ 
  weekLabel,
  weekId,
  quizIds, 
  onBack,
  onLogout 
}: WeeklyQuizManagerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('quiz');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-purple-100">
      <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-md hover:shadow-lg z-10"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      <Button
        onClick={onLogout}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-md hover:shadow-lg z-50 px-4 py-2 text-sm font-medium text-gray-700"
      >
        Logout
      </Button>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">{weekLabel}</h1>
          <p className="text-gray-600">
            Managing {quizIds.length} quizzes (IDs: {quizIds.join(', ')})
          </p>
        </div>

        {/* Toggle View Mode */}
        <Card className="p-4 mb-6 bg-white/70 backdrop-blur-xl rounded-2xl border-0">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">View Mode:</span>
            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode('quiz')}
                className={`px-6 py-2 rounded-lg transition ${
                  viewMode === 'quiz'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Quiz Basis
              </Button>
              <Button
                onClick={() => setViewMode('question')}
                className={`px-6 py-2 rounded-lg transition ${
                  viewMode === 'question'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Question Basis
              </Button>
            </div>
          </div>
        </Card>

        {/* Content based on view mode */}
        {viewMode === 'quiz' ? (
          <QuizBasisView weekId={weekId} />
        ) : (
          <QuestionBasisView weekId={weekId} />
        )}
      </div>
    </div>
  );
}
