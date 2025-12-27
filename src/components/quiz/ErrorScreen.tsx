import { motion } from "framer-motion"

interface ErrorScreenProps {
  error: string
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-purple-100 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-16 h-16 border-4 border-red-300 border-t-red-500 rounded-full mx-auto mb-4" />
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </motion.div>
    </div>
  )
}