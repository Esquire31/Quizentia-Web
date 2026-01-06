"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { QuizCard } from "../ui/quiz/QuizCard"
import { ArrowLeft } from "lucide-react"
import { LoadingScreen } from "./LoadingScreen"
import { ErrorScreen } from "./ErrorScreen"
import type { QuizData, WeeklyQuizData } from "../../lib/quiz-types"
import { getRandomQuizIds } from "../../lib/quiz-types"
import { API_BASE_URL } from "../../lib/config"

interface QuizListProps {
  onSelect?: (quizIds: number[]) => void
  onBack?: () => void
}

export function QuizList({ onSelect, onBack }: QuizListProps) {
  const [weeklyData, setWeeklyData] = useState<WeeklyQuizData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeeklyQuizzes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/quizzes/weekly?max_weeks=10`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch weekly quizzes')
        }

        const data: WeeklyQuizData[] = await response.json()
        setWeeklyData(data)
      } catch (err) {
        console.error('Error fetching weekly quizzes:', err)
        setError('Failed to load quizzes. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchWeeklyQuizzes()
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

  const handleQuizSelect = (weekLabel: string, weekQuizIds: number[]) => {
    // Check if we already have stored quiz IDs for this week
    const storageKey = `quizentia-week-${weekLabel}`
    const storedIds = localStorage.getItem(storageKey)
    
    let selectedIds: number[]
    if (storedIds) {
      // Use existing quiz IDs for consistency
      selectedIds = JSON.parse(storedIds)
    } else {
      // Get 12 random quiz IDs from the selected week's quiz_ids
      selectedIds = getRandomQuizIds(weekQuizIds, 12)
      // Store them for this user
      localStorage.setItem(storageKey, JSON.stringify(selectedIds))
    }
    
    onSelect?.(selectedIds)
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
      <div className="max-w-4xl mx-auto px-4 max-lg:mx-2 pb-12 space-y-12">
        {/* Current Week Quiz */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <QuizCard 
            quiz={createWeekQuizData(currentWeek)} 
            isCurrent={true} 
            onSelect={() => handleQuizSelect(currentWeek.week_label, currentWeek.quiz_ids)} 
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
                    onSelect={() => handleQuizSelect(week.week_label, week.quiz_ids)} 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
