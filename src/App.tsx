"use client"

import { useState } from "react"
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { HomeScreen } from "./components/quiz/HomeScreen"
import { QuizScreen } from "./components/quiz/QuizScreen"
import { QuizList } from "./components/quiz/QuizListScreen"
import { QuizHeader } from "./components/quiz/QuizHeader"
import AdminLogin from "./components/admin/AdminLogin"
import AdminDashboard from "./components/admin/AdminDashboard"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedQuizIds, setSelectedQuizIds] = useState<number[]>([])
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    // Check if admin token exists in localStorage on initial load
    const token = localStorage.getItem('adminToken')
    const expiry = localStorage.getItem('adminTokenExpiry')
    
    if (token && expiry) {
      const expiryTime = parseInt(expiry, 10)
      if (Date.now() < expiryTime) {
        return true
      }
      // Token expired, clear it
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminTokenType')
      localStorage.removeItem('adminTokenExpiry')
    }
    return false
  })

  const handleQuizSelect = (quizIds: number[]) => {
    setSelectedQuizIds(quizIds)
    navigate("/quiz")
  }

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true)
    navigate("/admin/dashboard")
  }

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false)
    navigate("/")
  }

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case "/":
        return ""
      case "/quizlist":
        return "Choose Your Quiz"
      case "/quiz":
        return "Weekly Law Quiz"
      case "/admin":
        return ""
      case "/admin/dashboard":
        return ""
      default:
        return ""
    }
  }

  const showAdminButton = location.pathname !== "/admin" && location.pathname !== "/admin/dashboard"

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-purple-100">
      {showAdminButton && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg transition font-medium"
          >
            Admin Login
          </button>
        </div>
      )}
      <QuizHeader title={getHeaderTitle()} />
      <Routes>
        <Route path="/" element={<HomeScreen onStart={() => navigate("/quizlist")} />} />
        <Route
          path="/quizlist"
          element={<QuizList onSelect={handleQuizSelect} onBack={() => navigate("/")} />}
        />
        <Route path="/quiz" element={<QuizScreen quizIds={selectedQuizIds} onBack={() => navigate("/quizlist")} />} />
        <Route path="/admin" element={<AdminLogin onLogin={handleAdminLogin} onBack={() => navigate("/")} />} />
        <Route path="/admin/dashboard" element={
          isAdminAuthenticated ? (
            <AdminDashboard onLogout={handleAdminLogout} />
          ) : (
            <Navigate to="/admin" replace />
          )
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App