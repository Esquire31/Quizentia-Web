"use client"

import { useState, useEffect } from "react"
import type { QuizData } from "./lib/quiz-types"
import { shuffleArray } from "./lib/quiz-types"
import { LoadingScreen } from "./components/quiz/LoadingScreen"
import { ErrorScreen } from "./components/quiz/ErrorScreen"
import { QuizHeader } from "./components/quiz/QuizHeader"
import { QuizProgress } from "./components/quiz/QuizProgress"
import { QuestionCard } from "./components/quiz/QuestionCard"
import { ResultsScreen } from "./components/quiz/ResultsScreen"

function App() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch('http://localhost:8000/generate_quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: 'https://www.livelaw.in/articles/commercial-courts-act-definition-of-commercial-dispute-judicial-interpretation-analysis-513599'
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }
        const data: QuizData = await response.json();
        // Shuffle options for each question
        data.questions.forEach(question => {
          question.options = shuffleArray(question.options);
        });
        setQuizData(data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz. Please try again later.');
      }
    };
    fetchQuiz();
  }, [])

  const handleOptionClick = (option: string) => {
    if (!quizData || answered) return

    setSelectedOption(option)
    setAnswered(true)
    const correct = option === quizData.questions[currentQuestion].correct_answer

    if (correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (!quizData) return

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setShowHint(false)
      setAnswered(false)
    } else {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setShowHint(false)
    setScore(0)
    setShowResults(false)
    setAnswered(false)
  }

  const toggleHint = () => {
    setShowHint(!showHint)
  }

  if (error) {
    return <ErrorScreen error={error} />
  }

  if (!quizData) {
    return <LoadingScreen />
  }

  if (showResults) {
    return <ResultsScreen score={score} totalQuestions={quizData.questions.length} onRestart={handleRestart} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <QuizHeader title={quizData.title} />
      <QuizProgress current={currentQuestion} total={quizData.questions.length} />
      <QuestionCard
        question={quizData.questions[currentQuestion]}
        currentQuestion={currentQuestion}
        selectedOption={selectedOption}
        answered={answered}
        showHint={showHint}
        onOptionClick={handleOptionClick}
        onToggleHint={toggleHint}
        onNext={handleNext}
        isLastQuestion={currentQuestion === quizData.questions.length - 1}
      />
    </div>
  )
}

export default App