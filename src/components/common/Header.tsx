import { motion } from "framer-motion"
import { ArrowLeft, LogOut } from "lucide-react"
import logo from "../../assets/logo.png"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

interface HeaderProps {
  title?: string
  onBack?: () => void
  showBackToDreamlaw?: boolean
  showAdminButton?: boolean
  onAdminClick?: () => void
  showLogout?: boolean
}

export function Header({ 
  title, 
  onBack, 
  showBackToDreamlaw, 
  showAdminButton, 
  onAdminClick,
  showLogout 
}: HeaderProps) {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full px-4"
    >
      {/* Single row with all elements */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Back buttons */}
        <div className="flex items-center gap-2 min-w-[120px]">
          {showBackToDreamlaw && (
            <button
              onClick={() => window.location.href = 'https://dreamlaw.in'}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm cursor-pointer hover:bg-white transition-all shadow-md hover:shadow-lg"
              aria-label="Back to Dreamlaw"
              title="Back to Dreamlaw"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm cursor-pointer hover:bg-white transition-all shadow-md hover:shadow-lg"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </div>

        {/* Center - Logo and Title */}
        <div className="flex flex-col items-center justify-center flex-1">
          <img src={logo} alt="Quizentia Logo" className="h-28 w-auto" />
          {title && <p className="text-gray-700 text-base mt-1">{title}</p>}
        </div>

        {/* Right side - Admin button or Logout */}
        <div className="min-w-[120px] flex justify-end items-center gap-2">
          {user && (
            <div className="text-sm text-gray-700 font-medium mr-2">
              {user.displayName || user.email}
            </div>
          )}
          {showAdminButton && onAdminClick && (
            <button
              onClick={onAdminClick}
              className="bg-gray-800 hover:bg-gray-900 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition font-medium text-sm"
            >
              Admin Login
            </button>
          )}
          {showLogout && user && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition font-medium text-sm flex items-center gap-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </motion.header>
  )
}
