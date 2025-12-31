import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/base/button"
import { Card } from "../ui/base/card"
import { Check, X } from "lucide-react"
import type { QuizQuestion } from "../../lib/quiz-types"

interface QuestionCardProps {
  question: QuizQuestion
  currentQuestion: number
  selectedOption: string | null
  answered: boolean
  showHint: boolean
  onOptionClick: (option: string) => void
  onToggleHint: () => void
  onNext: () => void
  isLastQuestion: boolean
}

export function QuestionCard({
  question,
  currentQuestion,
  selectedOption,
  answered,
  showHint,
  onOptionClick,
  onToggleHint,
  onNext,
  isLastQuestion,
}: QuestionCardProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 p-6 md:p-10 shadow-2xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-relaxed">
                {question.question}
              </h2>

              {/* Hint Button */}
              {question.hint && !showHint && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <Button
                    onClick={onToggleHint}
                    variant="outline"
                    className="border-pink-300/50 text-pink-600 hover:bg-pink-100/50 hover:border-pink-400/70 rounded-lg bg-transparent"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      💡
                    </motion.span>
                    <span className="ml-2">Need a hint?</span>
                  </Button>
                </motion.div>
              )}

              {/* Hint Display */}
              <AnimatePresence>
                {showHint && question.hint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="mb-6 bg-pink-100/50 border border-pink-300/50 rounded-lg p-4"
                  >
                    <p className="text-pink-700 text-sm">
                      <span className="font-semibold">Hint:</span> {question.hint}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 items-stretch">
                {question.options.map((option, index) => {
                  const isSelected = selectedOption === option
                  const isCorrectOption = option === question.correct_answer
                  const showCorrect = answered && isCorrectOption
                  const showWrong = answered && isSelected && !isCorrectOption

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={!answered ? { scale: 1.02 } : {}}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                    >
                      <button
                        onClick={() => onOptionClick(option)}
                        disabled={answered}
                        className={`
                          w-full h-full min-h-[120px] p-6 rounded-xl text-left font-medium transition-all duration-300 items-center
                          ${
                            !answered
                              ? "bg-gray-50 border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50/50 hover:shadow-lg hover:shadow-pink-200/30"
                              : ""
                          }
                          ${
                            showCorrect
                              ? "bg-emerald-100/50 border-2 border-emerald-300 shadow-lg shadow-emerald-200/30"
                              : ""
                          }
                          ${showWrong ? "bg-red-100/50 border-2 border-red-300 shadow-lg shadow-red-200/30" : ""}
                          ${
                            answered && !showCorrect && !showWrong
                              ? "bg-gray-100/50 border-2 border-gray-200/30 opacity-50"
                              : ""
                          }
                        `}
                      >
                        <motion.div
                          animate={
                            showWrong
                              ? {
                                  x: [-10, 10, -10, 10, 0],
                                  transition: { duration: 0.4 },
                                }
                              : {}
                          }
                          className="flex items-center justify-between w-full"
                        >
                          <span
                            className={`
                              ${!answered ? "text-gray-700" : ""}
                              ${showCorrect ? "text-emerald-600" : ""}
                              ${showWrong ? "text-red-600" : ""}
                              ${answered && !showCorrect && !showWrong ? "text-gray-500" : ""}
                            `}
                          >
                            {option}
                          </span>
                          {showCorrect && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Check className="w-6 h-6 text-emerald-500" />
                            </motion.div>
                          )}
                          {showWrong && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <X className="w-6 h-6 text-red-500" />
                            </motion.div>
                          )}
                        </motion.div>
                      </button>
                    </motion.div>
                  )
                })}
              </div>

              {/* Next Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: answered ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={onNext}
                  disabled={!answered}
                  className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-6 text-lg rounded-xl shadow-lg transition-all disabled:cursor-not-allowed"
                >
                  {isLastQuestion ? "See Results →" : "Next Question →"}
                </Button>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}