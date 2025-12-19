import { motion } from "framer-motion"

interface ErrorScreenProps {
  error: string
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full mx-auto mb-4" />
        <p className="text-red-400 text-lg font-medium">{error}</p>
      </motion.div>
    </div>
  )
}