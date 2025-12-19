import { motion } from "framer-motion"

interface QuizHeaderProps {
  title: string
}

export function QuizHeader({ title }: QuizHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pt-8 pb-12 text-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-3">
        Quizentia
      </h1>
      <p className="text-slate-400 text-lg">{title}</p>
    </motion.header>
  )
}