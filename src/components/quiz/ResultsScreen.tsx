import { motion } from "framer-motion"
import { Button } from "../ui/base/button"
import { Card } from "../ui/base/card"
import { Sparkles, ArrowLeft, TrendingUp } from "lucide-react"
import type { QuizResultResponse } from "../../lib/quiz-types"

interface ResultsScreenProps {
  score: number
  totalQuestions: number
  onRestart: () => void
  onBack?: () => void
  quizResult?: QuizResultResponse | null
}

export function ResultsScreen({ score, totalQuestions, onRestart, onBack, quizResult }: ResultsScreenProps) {
  const isPerfect = score === totalQuestions
  const percentage = Math.round((score / totalQuestions) * 100)

  return (
    <>
      {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-md hover:shadow-lg z-10"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-purple-100 flex items-center justify-center p-4 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
          <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 p-8 md:p-12 relative overflow-hidden">
            {isPerfect && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-pink-400 rounded-full"
                    initial={{
                      x: "50%",
                      y: "50%",
                      opacity: 1,
                    }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.02,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            )}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 mb-6">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
              
              {/* Attempt and Best Score Badges */}
              {quizResult && (
                <div className="flex gap-2 justify-center mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Attempt #{quizResult.attempt_number}
                  </span>
                  {quizResult.is_new_best && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      New Best!
                    </span>
                  )}
                  {quizResult.is_best && !quizResult.is_new_best && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      Personal Best
                    </span>
                  )}
                </div>
              )}
              
              <p className="text-gray-600 text-lg">{isPerfect ? "Perfect Score!" : "Great effort!"}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <div className="inline-block bg-gray-50/80 rounded-2xl p-8 border border-gray-200/50">
                <p className="text-gray-600 text-sm uppercase tracking-wider mb-2">Your Score</p>
                <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  {score}/{totalQuestions}
                </p>
                <p className="text-gray-500 mt-2">{percentage}% correct</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <Button
                onClick={onRestart}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold py-6 text-lg rounded-xl shadow-lg shadow-pink-200/30 transition-all hover:shadow-pink-200/50 hover:scale-105"
              >
                Try Again
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </>
  )
}