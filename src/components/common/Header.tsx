import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import logo from "../../assets/logo.png"

interface HeaderProps {
  title?: string
  onBack?: () => void
  showBackToDreamlaw?: boolean
  showAdminButton?: boolean
  onAdminClick?: () => void
}

export function Header({ 
  title, 
  onBack, 
  showBackToDreamlaw, 
  showAdminButton, 
  onAdminClick 
}: HeaderProps) {
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

        {/* Right side - Admin button */}
        <div className="min-w-[120px] flex justify-end">
          {showAdminButton && onAdminClick && (
            <button
              onClick={onAdminClick}
              className="bg-gray-800 hover:bg-gray-900 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition font-medium text-sm"
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </motion.header>
  )
}
