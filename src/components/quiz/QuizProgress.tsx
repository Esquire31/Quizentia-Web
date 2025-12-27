import { motion } from "framer-motion"

interface QuizProgressProps {
  current: number
  total: number
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const progress = ((current + 1) / total) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      className="max-w-4xl mx-auto mb-8"
    >
      <div className="bg-gray-200 h-2 rounded-full overflow-hidden backdrop-blur">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <p className="text-gray-600 text-sm mt-2 text-center">
        Question {current + 1} of {total}
      </p>
    </motion.div>
  )
}