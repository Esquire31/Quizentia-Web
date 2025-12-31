"use client"

import { motion } from "framer-motion"
import { QuizCard } from "../ui/quiz/QuizCard"
import { ArrowLeft } from "lucide-react"
import type { QuizData } from "../../lib/quiz-types"

interface QuizListProps {
  quizzes: QuizData[]
  onSelect?: (quizId?: string) => void
  onBack?: () => void
}

export function QuizList({ quizzes, onSelect, onBack }: QuizListProps) {
  if (quizzes.length === 0) return null

  const currentQuiz = quizzes[0]
  const previousQuizzes = quizzes.slice(1)

  return (
    <div>
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-md hover:shadow-lg z-10"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      )}
      <div className="max-w-4xl mx-auto px-4 pb-12 space-y-12">
        {/* Current Week Quiz */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <QuizCard quiz={currentQuiz} isCurrent={true} onSelect={onSelect} />
        </motion.div>

        {/* Previous Weeks */}
        {previousQuizzes.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-2xl font-medium text-gray-900 mb-6">Previous Weeks</h2>
            <div className="space-y-4">
              {previousQuizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <QuizCard quiz={quiz} onSelect={onSelect} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
