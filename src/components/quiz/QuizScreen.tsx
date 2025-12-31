"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import type { QuizData } from "../../lib/quiz-types"
import { shuffleArray } from "../../lib/quiz-types"
import { LoadingScreen } from "./LoadingScreen"
import { ErrorScreen } from "./ErrorScreen"
import { QuizProgress } from "./QuizProgress"
import { QuestionCard } from "./QuestionCard"
import { ResultsScreen } from "./ResultsScreen"

interface QuizScreenProps {
  onBack?: () => void
}

export function QuizScreen({ onBack }: QuizScreenProps = {}) {
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
      const cacheKey = `quizentia-quiz-data`;
      const cacheExpiryKey = `quizentia-quiz-expiry`;
      const cacheDuration = 60 * 60 * 1000;

      try {
        const cachedData = localStorage.getItem(cacheKey);
        const cacheExpiry = localStorage.getItem(cacheExpiryKey);
        const now = Date.now();

        if (cachedData && cacheExpiry && now < parseInt(cacheExpiry)) {
          const data: QuizData = JSON.parse(cachedData);
          data.questions.forEach(question => {
            question.options = shuffleArray(question.options);
          });
          setQuizData(data);
          return;
        }

        const response = await fetch(`http://localhost:8000/quizzes/get`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }

        const data: QuizData = await response.json();

        // Shuffle options for each question
        data.questions.forEach(question => {
          question.options = shuffleArray(question.options);
        });

        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheExpiryKey, (now + cacheDuration).toString());

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
    return (
      <div>
        <ErrorScreen error={error} />
      </div>
    )
  }

  if (!quizData) {
    return (
      <div>
        <LoadingScreen />
      </div>
    )
  }

  if (showResults) {
    return (
      <div>
        <ResultsScreen score={score} totalQuestions={quizData.questions.length} onRestart={handleRestart} onBack={onBack} />
      </div>
    )
  }

  return (
    <div>
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-md hover:shadow-lg z-10"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      )}
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