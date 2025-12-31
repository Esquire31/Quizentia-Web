"use client"

import { motion } from "framer-motion"
import { Card } from "../base/card"
import { Badge } from "../base/badge"
import { Button } from "../base/button"
import { ArrowRight, Flame } from "lucide-react"
import type { QuizData } from "../../../lib/quiz-types"

interface QuizCardProps {
  quiz: QuizData
  isCurrent?: boolean
  onSelect?: (quizId?: string) => void
}

export function QuizCard({ quiz, isCurrent = false, onSelect }: QuizCardProps) {
  const formatDateRange = (start?: string, end?: string) => {
    if (!start || !end) return "This Week"

    const startDate = new Date(start)
    const endDate = new Date(end)

    if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) {
      return "This Week"
    }

    const startMonth = startDate.toLocaleDateString("en-US", { month: "short" })
    const startDay = startDate.getDate()
    const endDay = endDate.getDate()
    return `${startMonth} ${startDay} – ${endDay}`
  }

  const handleSelect = () => {
    onSelect?.(quiz.id)
  }

  if (isCurrent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-0.5 opacity-75"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-0.5 opacity-0 animate-pulse"></div>

          <Card className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 md:p-10 border-0">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    Current Week
                  </Badge>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Flame className="w-5 h-5 text-orange-500" />
                  </motion.div>
                </div>
                <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-2">
                  {quiz.title || `${formatDateRange(quiz.startDate, quiz.endDate)} Quiz`}
                </h2>
              </div>
            </div>

            <p className="text-gray-600 font-thin text-lg mb-8">{formatDateRange(quiz.startDate, quiz.endDate)}</p>

            <Button
              onClick={handleSelect}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-light flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              Attempt Quiz
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Card>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <button type="button" onClick={handleSelect} className="w-full text-left">
        <Card className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border-0 cursor-pointer hover:shadow-lg transition-all">
          <h3 className="text-lg md:text-xl font-normal text-gray-900 mb-2">
            {quiz.title || `${formatDateRange(quiz.startDate, quiz.endDate)} Quiz`}
          </h3>
          <p className="text-gray-600 text-sm">{formatDateRange(quiz.startDate, quiz.endDate)}</p>
        </Card>
      </button>
    </motion.div>
  )
}
