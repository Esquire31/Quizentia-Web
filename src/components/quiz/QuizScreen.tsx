"use client"

import { useState, useEffect } from "react"
import type { QuizData } from "../../lib/quiz-types"
import { shuffleArray } from "../../lib/quiz-types"
import { LoadingScreen } from "./LoadingScreen"
import { ErrorScreen } from "./ErrorScreen"
import { QuizProgress } from "./QuizProgress"
import { QuestionCard } from "./QuestionCard"
import { ResultsScreen } from "./ResultsScreen"
import { fetchWeeklyQuestions } from "../../lib/api"

interface QuizScreenProps {
  weekId?: string
}

export function QuizScreen({ weekId }: QuizScreenProps = {}) {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([])
  
  // If weekId not provided, try to load from localStorage
  const [activeWeekId, setActiveWeekId] = useState<string | undefined>(() => {
    // Initialize with weekId from props or localStorage
    if (weekId) {
      return weekId
    }
    const lastWeekId = localStorage.getItem('quizentia-last-week-id')
    if (lastWeekId) {
      return lastWeekId
    }
    return undefined
  })

  useEffect(() => {
    if (weekId) {
      // Store the week ID for future reloads
      localStorage.setItem('quizentia-last-week-id', weekId)
      setActiveWeekId(weekId)
    }
  }, [weekId])

  // Save progress whenever state changes
  useEffect(() => {
    if (quizData && !showResults && activeWeekId) {
      const progressKey = `quizentia-progress-${activeWeekId}`;
      const progress = {
        currentQuestion,
        score,
        userAnswers,
        answered,
        selectedOption,
      }
      localStorage.setItem(progressKey, JSON.stringify(progress))
    }
  }, [currentQuestion, score, userAnswers, answered, selectedOption, quizData, showResults, activeWeekId])

  useEffect(() => {
    if (!activeWeekId) return

    const fetchQuiz = async () => {
      const progressKey = `quizentia-progress-${activeWeekId}`;
      const cacheKey = `quizentia-quiz-data-${activeWeekId}`;
      const cacheExpiryKey = `quizentia-quiz-expiry-${activeWeekId}`;
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

        const response = await fetchWeeklyQuestions(activeWeekId);
        
        // Transform response to QuizData format
        const data: QuizData = {
          id: response.week_id,
          title: `Week ${response.week_id}`,
          questions: response.questions
        };

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
  }, [activeWeekId])

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
      if (activeWeekId) {
        const progressKey = `quizentia-progress-${activeWeekId}`;
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
    if (activeWeekId) {
      const progressKey = `quizentia-progress-${activeWeekId}`;
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

  // If no activeWeekId, show error
  if (!activeWeekId) {
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
        <ResultsScreen score={score} totalQuestions={quizData.questions.length} onRestart={handleRestart} />
      </div>
    )
  }

  return (
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
  )
}