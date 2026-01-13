"use client"

import { useState } from "react"
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { HomeScreen } from "./components/quiz/HomeScreen"
import { QuizScreen } from "./components/quiz/QuizScreen"
import { QuizList } from "./components/quiz/QuizListScreen"
import { Header } from "./components/common/Header"
import AdminDashboard from "./components/admin/AdminDashboard"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { useAuth } from "./contexts/AuthContext"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAdmin } = useAuth()
  const [selectedQuizIds, setSelectedQuizIds] = useState<number[]>([])

  const handleQuizSelect = (quizIds: number[]) => {
    setSelectedQuizIds(quizIds)
    navigate("/quiz")
  }

  const handleAdminLogout = () => {
    navigate("/")
  }

  const getHeaderProps = () => {
    switch (location.pathname) {
      case "/":
        return {
          title: "",
          showBackToDreamlaw: true,
          showAdminButton: false,
          showLogout: !!user
        }
      case "/login":
      case "/register":
        return {
          title: "",
          showBackToDreamlaw: true,
          showAdminButton: false
        }
      case "/quizlist":
        return {
          title: "Choose Your Quiz",
          onBack: () => navigate("/"),
          showAdminButton: false,
          showLogout: true
        }
      case "/quiz":
        return {
          title: "Weekly Law Quiz",
          onBack: () => navigate("/quizlist"),
          showAdminButton: false,
          showLogout: true
        }
      case "/admin":
        return {
          title: "",
          onBack: () => navigate("/")
        }
      case "/admin/dashboard":
        return {
          title: ""
        }
      default:
        return {}
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-purple-100">
      {!location.pathname.startsWith('/login') && !location.pathname.startsWith('/register') && <Header {...getHeaderProps()} />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            {isAdmin ? <Navigate to="/admin/dashboard" replace /> : <HomeScreen onStart={() => navigate("/quizlist")} />}
          </ProtectedRoute>
        } />
        <Route
          path="/quizlist"
          element={
            <ProtectedRoute>
              <QuizList onSelect={handleQuizSelect} />
            </ProtectedRoute>
          }
        />
        <Route path="/quiz" element={
          <ProtectedRoute>
            <QuizScreen quizIds={selectedQuizIds} />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/dashboard" element={
          isAdmin ? (
            <AdminDashboard onLogout={handleAdminLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </div>
  )
}

export default App