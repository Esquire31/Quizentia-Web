import { motion } from "framer-motion"

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-purple-100 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-16 h-16 border-4 border-pink-300 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-700 text-lg font-medium">Loading quiz...</p>
      </motion.div>
    </div>
  )
}