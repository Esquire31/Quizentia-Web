import { Button } from '../base/button';

interface QuizRulesModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export default function QuizRulesModal({ isOpen, onAccept }: QuizRulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Rules</h2>
          <p className="text-gray-600">Please read and accept the following rules before starting the quiz</p>
        </div>

        <div className="space-y-4 mb-8 text-gray-700">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Total Questions</h3>
              <p>This quiz contains 100 questions covering various legal topics from the week.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Time Limit</h3>
              <p>There is no time limit. Take your time to think through each question carefully.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Answer Once</h3>
              <p>Once you select an answer, you cannot change it. Choose carefully before confirming.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Hints Available</h3>
              <p>Each question has a hint available if you need help. Use them wisely!</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
              5
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Progress Saved</h3>
              <p>Your progress is automatically saved for 1 hour. You can close and resume the quiz anytime within this period.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
              6
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Scoring</h3>
              <p>You'll receive your score at the end. Each correct answer counts as one point.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onAccept}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg transition font-semibold text-lg shadow-lg"
          >
            I Accept - Start Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
