"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "../ui/base/card"
import { Trophy, Calendar, CheckCircle2, XCircle } from "lucide-react"
import { fetchWeekResults } from "../../lib/api"
import { LoadingScreen } from "./LoadingScreen"
import { ErrorScreen } from "./ErrorScreen"
import type { WeekResultsResponse, WeekResultsAttempt } from "../../lib/quiz-types"
import Footer from "../common/Footer"

interface PreviousResultsScreenProps {
  weekId: string
}

export function PreviousResultsScreen({ weekId }: PreviousResultsScreenProps) {
  const [results, setResults] = useState<WeekResultsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAttempt, setSelectedAttempt] = useState<WeekResultsAttempt | null>(null)

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true)
        const data = await fetchWeekResults(weekId)
        setResults(data)
        // Select the best attempt by default
        const bestAttempt = data.attempts.find(a => a.is_best) || data.attempts[0]
        setSelectedAttempt(bestAttempt)
      } catch (err) {
        console.error('Error fetching week results:', err)
        setError(err instanceof Error ? err.message : 'Failed to load results')
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [weekId])

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen error={error} />
  }

  if (!results || !selectedAttempt) {
    return <ErrorScreen error="No results found" />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-blue-600"
    if (percentage >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-purple-100 p-4 pb-12">
      <div className="max-w-6xl mx-auto pt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Week {weekId} Results</h1>
          <p className="text-gray-600">Total Attempts: {results.total_attempts}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Attempts List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/80 border-gray-200/50 backdrop-blur-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Your Attempts
              </h2>
              <div className="space-y-3">
                {results.attempts.map((attempt) => (
                  <button
                    key={attempt.id}
                    onClick={() => setSelectedAttempt(attempt)}
                    className={`w-full text-left cursor-pointer p-4 rounded-lg transition-all ${
                      selectedAttempt.id === attempt.id
                        ? "bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-gray-200/50"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          Attempt #{attempt.attempt_number}
                        </span>
                        {attempt.is_best && (
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <span className={`text-2xl font-bold ${getScoreColor(attempt.percentage)}`}>
                        {attempt.percentage}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {attempt.score}/{attempt.total_questions} correct
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(attempt.completed_at)}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Selected Attempt Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/80 border-gray-200/50 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  Attempt #{selectedAttempt.attempt_number}
                  {selectedAttempt.is_best && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      Best Score
                    </span>
                  )}
                </h2>
              </div>

              {/* Score Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Score</div>
                  <div className={`text-3xl font-bold ${getScoreColor(selectedAttempt.percentage)}`}>
                    {selectedAttempt.percentage}%
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Correct</div>
                  <div className="text-3xl font-bold text-green-600">
                    {selectedAttempt.score}
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Incorrect</div>
                  <div className="text-3xl font-bold text-red-600">
                    {selectedAttempt.total_questions - selectedAttempt.score}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Total</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {selectedAttempt.total_questions}
                  </div>
                </div>
              </div>

              {/* Answer Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Details</h3>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {selectedAttempt.answers.map((answer) => (
                    <div
                      key={`${answer.quiz_id}-${answer.question_index}`}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        answer.is_correct ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {answer.is_correct ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Question {answer.question_index + 1}
                          </div>
                          <div className="text-xs text-gray-600">
                            Quiz ID: {answer.quiz_id}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 font-medium">
                        {answer.selected_answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
