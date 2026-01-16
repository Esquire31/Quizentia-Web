"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { QuizCard } from "../ui/quiz/QuizCard"
import { LoadingScreen } from "./LoadingScreen"
import { ErrorScreen } from "./ErrorScreen"
import type { QuizData, WeeklyQuizData } from "../../lib/quiz-types"
import { fetchWeeklyQuizzes } from "../../lib/api"

interface QuizListProps {
  onSelect?: (weekId: string) => void
}

export function QuizList({ onSelect }: QuizListProps) {
  const [weeklyData, setWeeklyData] = useState<WeeklyQuizData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadWeeklyQuizzes = async () => {
      try {
        const data = await fetchWeeklyQuizzes(10)
        setWeeklyData(data)
      } catch (err) {
        console.error('Error fetching weekly quizzes:', err)
        setError('Failed to load quizzes. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadWeeklyQuizzes()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen error={error} />
  }

  if (weeklyData.length === 0) return null

  // Get the first week (current week)
  const currentWeek = weeklyData[0]
  const previousWeeks = weeklyData.slice(1)

  const handleQuizSelect = (weekId: string) => {
    onSelect?.(weekId)
  }

  // Convert week to QuizData for display
  const createWeekQuizData = (week: WeeklyQuizData): QuizData => {
    return {
      id: week.week_label,
      title: week.week_label,
      questions: [],
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 max-lg:mx-2 pb-12 space-y-12">
        {/* Current Week Quiz */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <QuizCard 
            quiz={createWeekQuizData(currentWeek)} 
            isCurrent={true} 
            onSelect={() => handleQuizSelect(currentWeek.week_id)} 
          />
        </motion.div>

        {/* Previous Weeks */}
        {previousWeeks.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-2xl font-medium text-gray-900 mb-6">Previous Weeks</h2>
            <div className="space-y-4">
              {previousWeeks.map((week, index) => (
                <motion.div
                  key={week.week_label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <QuizCard 
                    quiz={createWeekQuizData(week)} 
                    onSelect={() => handleQuizSelect(week.week_id)} 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
    </div>
  )
}
