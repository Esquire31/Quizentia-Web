"use client"

import { useState, useEffect } from "react"
import type { QuizData } from "../../lib/quiz-types"
import { shuffleArray } from "../../lib/quiz-types"
import { LoadingScreen } from "./LoadingScreen"
import { ErrorScreen } from "./ErrorScreen"
import { QuizProgress } from "./QuizProgress"
import { QuestionCard } from "./QuestionCard"
import { ResultsScreen } from "./ResultsScreen"
import { fetchWeeklyQuestions, submitQuizResults } from "../../lib/api"
import QuizRulesModal from "../ui/modal/QuizRulesModal"
import { useAuth } from "../../contexts/AuthContext"
import type { QuizQuestionWithMetadata, QuizResultResponse } from "../../lib/quiz-types"

interface QuizScreenProps {
  weekId?: string
}

export function QuizScreen({ weekId }: QuizScreenProps = {}) {
  const { user } = useAuth()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([])
  const [rulesAccepted, setRulesAccepted] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResultResponse | null>(null)
  const [submittingResults, setSubmittingResults] = useState(false)
  
  // If weekId not provided, try to load from localStorage
  const [activeWeekId, setActiveWeekId] = useState<string | undefined>(() => {
    // Initialize with weekId from props or localStorage
    if (weekId) {
      return weekId
    }
    const userId = user?.uid
    if (userId) {
      const lastWeekId = localStorage.getItem(`quizentia-last-week-id-${userId}`)
      if (lastWeekId) {
        return lastWeekId
      }
    }
    return undefined
  })

  // Check if rules were already accepted for this week
  useEffect(() => {
    if (activeWeekId && user?.uid) {
      const rulesKey = `quizentia-rules-accepted-${user.uid}-${activeWeekId}`;
      const accepted = localStorage.getItem(rulesKey);
      if (accepted === 'true') {
        setRulesAccepted(true);
      }
    }
  }, [activeWeekId, user]);

  useEffect(() => {
    if (weekId && user?.uid) {
      // Store the week ID for future reloads
      localStorage.setItem(`quizentia-last-week-id-${user.uid}`, weekId)
      setActiveWeekId(weekId)
    }
  }, [weekId, user])

  // Save progress whenever state changes
  useEffect(() => {
    if (quizData && !showResults && activeWeekId && user?.uid) {
      const progressKey = `quizentia-progress-${user.uid}-${activeWeekId}`;
      const progress = {
        currentQuestion,
        score,
        userAnswers,
        answered,
        selectedOption,
      }
      localStorage.setItem(progressKey, JSON.stringify(progress))
    }
  }, [currentQuestion, score, userAnswers, answered, selectedOption, quizData, showResults, activeWeekId, user])

  useEffect(() => {
    if (!activeWeekId || !user?.uid) return

    const fetchQuiz = async () => {
      const userId = user.uid;
      const progressKey = `quizentia-progress-${userId}-${activeWeekId}`;
      const cacheKey = `quizentia-quiz-data-${userId}-${activeWeekId}`;
      const cacheExpiryKey = `quizentia-quiz-expiry-${userId}-${activeWeekId}`;
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
  }, [activeWeekId, user])

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

  const handleNext = async () => {
    if (!quizData) return

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setShowHint(false)
      setAnswered(false)
    } else {
      // Last question - submit results
      setSubmittingResults(true)
      
      try {
        if (activeWeekId && user?.uid) {
          // Build answers array with quiz_id and relative question_index per quiz
          // Group questions by quiz_id and track index within each quiz
          const quizIndexMap = new Map<number, number>();
          
          const answers = userAnswers.map((answer, index) => {
            const question = quizData.questions[index] as QuizQuestionWithMetadata;
            const quizId = question.quiz_id;
            
            // Get current index for this quiz_id (starts at 0 for each quiz)
            const currentIndex = quizIndexMap.get(quizId) || 0;
            quizIndexMap.set(quizId, currentIndex + 1);
            
            return {
              quiz_id: quizId,
              question_index: currentIndex,
              selected_answer: answer || ''
            };
          }).filter(a => a.selected_answer); // Only include answered questions

          const submission = {
            week_id: activeWeekId,
            answers
          };

          const result = await submitQuizResults(submission);
          setQuizResult(result);
          
          // Clear progress after successful submission
          const progressKey = `quizentia-progress-${user.uid}-${activeWeekId}`;
          localStorage.removeItem(progressKey);
        }
      } catch (error) {
        console.error('Error submitting quiz results:', error);
        // Still show results screen even if submission fails
      } finally {
        setSubmittingResults(false);
        setShowResults(true);
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
    setQuizResult(null)
    
    // Clear saved progress
    if (activeWeekId && user?.uid) {
      const progressKey = `quizentia-progress-${user.uid}-${activeWeekId}`;
      localStorage.removeItem(progressKey)
    }
  }

  const toggleHint = () => {
    setShowHint(!showHint)
  }

  const handleAcceptRules = () => {
    if (activeWeekId && user?.uid) {
      const rulesKey = `quizentia-rules-accepted-${user.uid}-${activeWeekId}`;
      localStorage.setItem(rulesKey, 'true');
      setRulesAccepted(true);
    }
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

  // Show rules modal if not accepted
  if (!rulesAccepted) {
    return <QuizRulesModal isOpen={true} onAccept={handleAcceptRules} />;
  }

  if (submittingResults) {
    return (
      <div>
        <LoadingScreen />
      </div>
    )
  }

  if (showResults) {
    return (
      <div>
        <ResultsScreen 
          score={score} 
          totalQuestions={quizData.questions.length} 
          onRestart={handleRestart}
          quizResult={quizResult}
        />
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