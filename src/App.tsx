"use client"

import { useState } from "react"
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { HomeScreen } from "./components/quiz/HomeScreen"
import { QuizScreen } from "./components/quiz/QuizScreen"
import { QuizList } from "./components/quiz/QuizListScreen"
import { QuizHeader } from "./components/quiz/QuizHeader"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedQuizIds, setSelectedQuizIds] = useState<number[]>([])

  const handleQuizSelect = (quizIds: number[]) => {
    setSelectedQuizIds(quizIds)
    navigate("/quiz")
  }

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
          element={<QuizList onSelect={handleQuizSelect} onBack={() => navigate("/")} />}
        />
        <Route path="/quiz" element={<QuizScreen quizIds={selectedQuizIds} onBack={() => navigate("/quizlist")} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App