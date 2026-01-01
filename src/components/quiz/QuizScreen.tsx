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

  const progressKey = quizIds ? `quizentia-progress-${quizIds.join('-')}` : 'quizentia-progress'

  // Save progress whenever state changes
  useEffect(() => {
    if (quizData && !showResults) {
      const progress = {
        currentQuestion,
        score,
        userAnswers,
        answered,
        selectedOption,
      }
      localStorage.setItem(progressKey, JSON.stringify(progress))
    }
  }, [currentQuestion, score, userAnswers, answered, selectedOption, quizData, showResults, progressKey])

  // Load saved progress
  const loadProgress = () => {
    const savedProgress = localStorage.getItem(progressKey)
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setCurrentQuestion(progress.currentQuestion || 0)
      setScore(progress.score || 0)
      setUserAnswers(progress.userAnswers || [])
      setAnswered(progress.answered || false)
      setSelectedOption(progress.selectedOption || null)
    }
  } 

  useEffect(() => {
    const fetchQuiz = async () => {
      const cacheKey = quizIds ? `quizentia-quiz-data-${quizIds.join('-')}` : `quizentia-quiz-data`;
      const cacheExpiryKey = quizIds ? `quizentia-quiz-expiry-${quizIds.join('-')}` : `quizentia-quiz-expiry`;
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
          
          // Initialize user answers array
          setUserAnswers(new Array(data.questions.length).fill(null))
          
          // Load saved progress
          loadProgress();
          return;
        }

        // If quizIds are provided, use POST request, otherwise use GET
        let response;
        if (quizIds && quizIds.length > 0) {
          response = await fetch(`http://localhost:8000/quizzes/get`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quiz_ids: quizIds }),
          });
        } else {
          response = await fetch(`http://localhost:8000/quizzes/get`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }

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
        
        // Initialize user answers array
        setUserAnswers(new Array(data.questions.length).fill(null))
        
        // Load saved progress after setting quiz data
        loadProgress();
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz. Please try again later.');
      }
    };
    fetchQuiz();
  }, [quizIds])

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
      localStorage.removeItem(progressKey)
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
    localStorage.removeItem(progressKey)
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