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
import { API_BASE_URL } from "../../lib/config"

interface QuizScreenProps {
  quizIds?: number[]
  onBack?: () => void
}

export function QuizScreen({ quizIds, onBack }: QuizScreenProps = {}) {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([])
  
  // If quizIds not provided, try to load from localStorage
  const [activeQuizIds, setActiveQuizIds] = useState<number[] | undefined>(() => {
    // Initialize with quizIds from props or localStorage
    if (quizIds && quizIds.length > 0) {
      return quizIds
    }
    const lastQuizIds = localStorage.getItem('quizentia-last-quiz-ids')
    if (lastQuizIds) {
      const parsed = JSON.parse(lastQuizIds)
      // Only use it if it's a valid non-empty array
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
    return undefined
  })

  useEffect(() => {
    if (quizIds && quizIds.length > 0) {
      // Store the quiz IDs for future reloads
      localStorage.setItem('quizentia-last-quiz-ids', JSON.stringify(quizIds))
      setActiveQuizIds(quizIds)
    }
  }, [quizIds])

  // Save progress whenever state changes
  useEffect(() => {
    if (quizData && !showResults && activeQuizIds && activeQuizIds.length > 0) {
      const progressKey = `quizentia-progress-${activeQuizIds.join('-')}`;
      const progress = {
        currentQuestion,
        score,
        userAnswers,
        answered,
        selectedOption,
      }
      localStorage.setItem(progressKey, JSON.stringify(progress))
    }
  }, [currentQuestion, score, userAnswers, answered, selectedOption, quizData, showResults, activeQuizIds])

  useEffect(() => {
    if (!activeQuizIds || activeQuizIds.length === 0) return

    const fetchQuiz = async () => {
      const progressKey = `quizentia-progress-${activeQuizIds.join('-')}`;
      const cacheKey = `quizentia-quiz-data-${activeQuizIds.join('-')}`;
      const cacheExpiryKey = `quizentia-quiz-expiry-${activeQuizIds.join('-')}`;
      const cacheDuration = 60 * 60 * 1000;

      try {
        const cachedData = localStorage.getItem(cacheKey);
        const cacheExpiry = localStorage.getItem(cacheExpiryKey);
        const now = Date.now();

        if (cachedData && cacheExpiry && now < parseInt(cacheExpiry)) {
          const data: QuizData = JSON.parse(cachedData);
          // Don't reshuffle - options are already shuffled and saved in cache
          setQuizData(data);
          
          // Load saved progress first
          const savedProgress = localStorage.getItem(progressKey)
          if (savedProgress) {
            const progress = JSON.parse(savedProgress)
            setCurrentQuestion(progress.currentQuestion || 0)
            setScore(progress.score || 0)
            setUserAnswers(progress.userAnswers || new Array(data.questions.length).fill(null))
            setAnswered(progress.answered || false)
            setSelectedOption(progress.selectedOption || null)
          } else {
            // Initialize user answers array if no saved progress
            setUserAnswers(new Array(data.questions.length).fill(null))
          }
          return;
        }

        const response = await fetch(`${API_BASE_URL}/quizzes/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quiz_ids: activeQuizIds }),
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
        
        // Load saved progress first
        const savedProgress = localStorage.getItem(progressKey)
        if (savedProgress) {
          const progress = JSON.parse(savedProgress)
          setCurrentQuestion(progress.currentQuestion || 0)
          setScore(progress.score || 0)
          setUserAnswers(progress.userAnswers || new Array(data.questions.length).fill(null))
          setAnswered(progress.answered || false)
          setSelectedOption(progress.selectedOption || null)
        } else {
          // Initialize user answers array if no saved progress
          setUserAnswers(new Array(data.questions.length).fill(null))
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz. Please try again later.');
      }
    };
    fetchQuiz();
  }, [activeQuizIds])

  const handleOptionClick = (option: string) => {
    if (!quizData || answered) return
    setSelectedOption(option)
    setAnswered(true)
    
    // Store user's answer
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = option
    setUserAnswers(newAnswers)
    
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
      // Clear progress when quiz is completed
      if (activeQuizIds) {
        const progressKey = `quizentia-progress-${activeQuizIds.join('-')}`;
        localStorage.removeItem(progressKey)
      }
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setShowHint(false)
    setScore(0)
    setShowResults(false)
    setAnswered(false)
    setUserAnswers(quizData ? new Array(quizData.questions.length).fill(null) : [])
    
    // Clear saved progress
    if (activeQuizIds) {
      const progressKey = `quizentia-progress-${activeQuizIds.join('-')}`;
      localStorage.removeItem(progressKey)
    }
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

  // If no activeQuizIds, show error
  if (!activeQuizIds || activeQuizIds.length === 0) {
    return (
      <div>
        <ErrorScreen error="No quiz selected. Please select a quiz from the list." />
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
      <div className="max-lg:mx-4">
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
    </div>
  )
}