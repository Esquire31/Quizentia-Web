"use client"

import { motion } from "framer-motion"
import { Button } from "../ui/base/button"

interface HomeScreenProps {
  onStart: () => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-1 justify-center px-4 pb-2 pt-24 md:pt-32 lg:pt-40 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Weekly Law Quiz
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Test your legal knowledge with our weekly quiz. One engaging quiz, every week.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              onClick={onStart}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start This Week's Quiz →
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
