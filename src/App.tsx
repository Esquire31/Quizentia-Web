"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"
import { Check, X, Sparkles } from "lucide-react"

interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: string
  hint?: string
}

interface QuizData {
  title: string
  quiz: QuizQuestion[]
}

// Mock API data
const mockQuizData: QuizData = {
  title: "The Future of Web Development",
  quiz: [
    {
      question: "What is the primary benefit of using React Server Components?",
      options: [
        "Faster client-side rendering",
        "Reduced JavaScript bundle size",
        "Better SEO optimization",
        "Improved state management",
      ],
      correct_answer: "Reduced JavaScript bundle size",
      hint: "Think about what runs on the server vs the client",
    },
    {
      question: "Which CSS framework provides utility-first styling?",
      options: ["Bootstrap", "Tailwind CSS", "Material-UI", "Foundation"],
      correct_answer: "Tailwind CSS",
      hint: "It focuses on utility classes rather than pre-designed components",
    },
    {
      question: "What is the purpose of Next.js App Router?",
      options: [
        "Managing application state",
        "File-based routing with enhanced features",
        "Database routing",
        "API routing only",
      ],
      correct_answer: "File-based routing with enhanced features",
      hint: "Consider how you organize files in the app directory",
    },
    {
      question: "Which animation library works seamlessly with React?",
      options: ["GSAP", "Anime.js", "Framer Motion", "Velocity.js"],
      correct_answer: "Framer Motion",
      hint: "This library is built specifically for React components",
    },
  ],
}

function App() {
    const [quizData, setQuizData] = useState<QuizData | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [showHint, setShowHint] = useState(false)
    const [score, setScore] = useState(0)
    const [showResults, setShowResults] = useState(false)
    const [answered, setAnswered] = useState(false)

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
        setQuizData(mockQuizData)
        }, 500)
    }, [])

    const handleOptionClick = (option: string) => {
        if (!quizData || answered) return

        setSelectedOption(option)
        setAnswered(true)
        const correct = option === quizData!.quiz[currentQuestion].correct_answer
        setIsCorrect(correct)

        if (correct) {
        setScore(score + 1)
        }
    }

    const handleNext = () => {
        if (!quizData) return

        if (currentQuestion < quizData!.quiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
        setIsCorrect(null)
        setShowHint(false)
        setAnswered(false)
        } else {
        setShowResults(true)
        }
    }

    const handleRestart = () => {
        setCurrentQuestion(0)
        setSelectedOption(null)
        setIsCorrect(null)
        setShowHint(false)
        setScore(0)
        setShowResults(false)
        setAnswered(false)
    }

    const toggleHint = () => {
        setShowHint(!showHint)
    }

    if (!quizData) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-cyan-400 text-lg font-medium">Loading quiz...</p>
            </motion.div>
        </div>
        )
    }

    if (showResults && quizData) {
        const isPerfect = score === quizData.quiz.length

        return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 p-8 md:p-12 relative overflow-hidden">
                {isPerfect && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full"
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
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-6">
                    <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Quiz Complete!</h2>
                <p className="text-slate-400 text-lg">{isPerfect ? "Perfect Score!" : "Great effort!"}</p>
                </motion.div>

                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
                >
                <div className="inline-block bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Your Score</p>
                    <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {score}/{quizData.quiz.length}
                    </p>
                    <p className="text-slate-500 mt-2">{Math.round((score / quizData.quiz.length) * 100)}% correct</p>
                </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <Button
                    onClick={handleRestart}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-6 text-lg rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 hover:scale-105"
                >
                    Try Again
                </Button>
                </motion.div>
            </Card>
            </motion.div>
        </div>
        )
    }

    const progress = ((currentQuestion + 1) / (quizData?.quiz?.length ?? 1)) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        {/* Header */}
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto pt-8 pb-12 text-center"
        >
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-3">
            Quizentia
            </h1>
            <p className="text-slate-400 text-lg">{quizData.title}</p>
        </motion.header>

        {/* Progress Bar */}
        <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="max-w-4xl mx-auto mb-8"
        >
            <div className="bg-slate-800/50 h-2 rounded-full overflow-hidden backdrop-blur">
            <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            />
            </div>
            <p className="text-slate-500 text-sm mt-2 text-center">
            Question {currentQuestion + 1} of {quizData.quiz.length}
            </p>
        </motion.div>

        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 p-6 md:p-10 shadow-2xl">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
                    {quizData.quiz[currentQuestion].question}
                    </h2>

                    {/* Hint Button */}
                    {quizData.quiz[currentQuestion].hint && !showHint && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                    >
                        <Button
                        onClick={toggleHint}
                        variant="outline"
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 rounded-lg bg-transparent"
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
                    {showHint && quizData.quiz[currentQuestion].hint && (
                        <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="mb-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4"
                        >
                        <p className="text-cyan-300 text-sm">
                            <span className="font-semibold">Hint:</span> {quizData.quiz[currentQuestion].hint}
                        </p>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {quizData.quiz[currentQuestion].options.map((option, index) => {
                        const isSelected = selectedOption === option
                        const isCorrectOption = option === quizData.quiz[currentQuestion].correct_answer
                        const showCorrect = answered && isCorrectOption
                        const showWrong = answered && isSelected && !isCorrect

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
                            onClick={() => handleOptionClick(option)}
                            disabled={answered}
                            className={`
                                w-full p-6 rounded-xl text-left font-medium transition-all duration-300
                                ${
                                !answered
                                    ? "bg-slate-800/50 border-2 border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/70 hover:shadow-lg hover:shadow-cyan-500/10"
                                    : ""
                                }
                                ${
                                showCorrect
                                    ? "bg-emerald-500/20 border-2 border-emerald-500 shadow-lg shadow-emerald-500/30"
                                    : ""
                                }
                                ${showWrong ? "bg-red-500/20 border-2 border-red-500 shadow-lg shadow-red-500/30" : ""}
                                ${
                                answered && !showCorrect && !showWrong
                                    ? "bg-slate-800/30 border-2 border-slate-700/30 opacity-50"
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
                                className="flex items-center justify-between"
                            >
                                <span
                                className={`
                                ${!answered ? "text-slate-200" : ""}
                                ${showCorrect ? "text-emerald-300" : ""}
                                ${showWrong ? "text-red-300" : ""}
                                ${answered && !showCorrect && !showWrong ? "text-slate-500" : ""}
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
                                    <Check className="w-6 h-6 text-emerald-400" />
                                </motion.div>
                                )}
                                {showWrong && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <X className="w-6 h-6 text-red-400" />
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
                        onClick={handleNext}
                        disabled={!answered}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-6 text-lg rounded-xl shadow-lg transition-all disabled:cursor-not-allowed"
                    >
                        {currentQuestion < quizData.quiz.length - 1 ? "Next Question →" : "See Results →"}
                    </Button>
                    </motion.div>
                </motion.div>
                </Card>
            </motion.div>
            </AnimatePresence>
        </div>
        </div>
    )
}

export default App
