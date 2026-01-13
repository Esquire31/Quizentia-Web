import { motion } from "framer-motion"
import { ArrowLeft, LogOut } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import logo from "../../assets/logo.png"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

interface HeaderProps {
  title?: string
  onBack?: () => void
  showBackToDreamlaw?: boolean
  showLogout?: boolean
}

export function Header({ 
  title, 
  onBack, 
  showBackToDreamlaw,
  showLogout 
}: HeaderProps) {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
      const parts = name.trim().split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return parts[0].substring(0, 2).toUpperCase()
    }
    if (email) {
      return email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

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

        {/* Right side - User profile */}
        <div className="min-w-[120px] flex justify-end items-center gap-2">
          {showLogout && user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center font-semibold text-gray-800 cursor-pointer"
                title={user.displayName || user.email || 'User'}
              >
                {getInitials(user.displayName, user.email)}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}
