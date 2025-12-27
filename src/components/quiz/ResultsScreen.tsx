import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Sparkles } from "lucide-react"

interface ResultsScreenProps {
  score: number
  totalQuestions: number
  onRestart: () => void
}

export function ResultsScreen({ score, totalQuestions, onRestart }: ResultsScreenProps) {
  const isPerfect = score === totalQuestions
  const percentage = Math.round((score / totalQuestions) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-purple-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
        <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 p-8 md:p-12 relative overflow-hidden">
          {isPerfect && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-pink-400 rounded-full"
                  initial={{
                    x: "50%",
                    y: "50%",
                    opacity: 1,
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.02,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 mb-6">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
            <p className="text-gray-600 text-lg">{isPerfect ? "Perfect Score!" : "Great effort!"}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <div className="inline-block bg-gray-50/80 rounded-2xl p-8 border border-gray-200/50">
              <p className="text-gray-600 text-sm uppercase tracking-wider mb-2">Your Score</p>
              <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                {score}/{totalQuestions}
              </p>
              <p className="text-gray-500 mt-2">{percentage}% correct</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <Button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold py-6 text-lg rounded-xl shadow-lg shadow-pink-200/30 transition-all hover:shadow-pink-200/50 hover:scale-105"
            >
              Try Again
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}