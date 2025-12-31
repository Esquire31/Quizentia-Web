"use client"

import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { HomeScreen } from "./components/quiz/HomeScreen"
import { QuizScreen } from "./components/quiz/QuizScreen"
import { QuizList } from "./components/quiz/QuizListScreen"
import { QuizHeader } from "./components/quiz/QuizHeader"
import type { QuizData } from "./lib/quiz-types"

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const demoQuizzes: QuizData[] = [
    {
      id: "current-week",
      title: "Current Week Quiz",
      startDate: "2025-12-29",
      endDate: "2026-01-04",
      questions: [],
    },
    {
      id: "week-1",
      title: "Week 1 Recap",
      startDate: "2025-12-22",
      endDate: "2025-12-28",
      questions: [],
    },
  ]

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case "/":
        return ""
      case "/quizlist":
        return "Choose Your Quiz"
      case "/quiz":
        return "Weekly Law Quiz"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-purple-100">
      <QuizHeader title={getHeaderTitle()} />
      <Routes>
        <Route path="/" element={<HomeScreen onStart={() => navigate("/quizlist")} />} />
        <Route
          path="/quizlist"
          element={<QuizList quizzes={demoQuizzes} onSelect={() => navigate("/quiz")} onBack={() => navigate("/")} />}
        />
        <Route path="/quiz" element={<QuizScreen onBack={() => navigate("/quizlist")} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App