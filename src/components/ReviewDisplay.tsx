




"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import type { Rootstate } from "@/redux/Store"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { setAnswered, setNotAnswered, removeAnswered, removeNotAnswered } from "@/redux/slice/qustions"
import PerformancePopup from "./PerformancePopup"
import ReviewResults from "./ReviewResult"
import { askQuestionToAi } from "@/util/ai-utility"
import AnswereModal from "./AnswereModal"
import { CompilationWeekQuestions, NormalWeekQuestions, Question, WeekName } from "@/util/type"
import ExtraQuestions from "./ExtraQuestions"
import { toast } from "react-toastify";

type FilterType = "theory" | "practical"

export default function ReviewDisplay() {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
  const [currentFilter, setCurrentFilter] = useState<FilterType>("theory")
  const [aiAnswere, setAiAnswere] = useState("")
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [isanswereLoading, setIsAnswereLoading] = useState(false)
  const [aiQuestion, setAiQuestion] = useState("")
  const [laguage, setLaguage] = useState("")
  const [weekName, setWeekName] = useState<WeekName>('week-1')
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([])
  const [showExtraQuestions, setShowExtraQuestions] = useState(false)

  // step 0 = week-1 (Basic Array Pattern), step 1 = week-2 (Logic Array Questions), step 2 = week-3 (Java OOPs Concept)
  const [stepIndex, setStepIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const reviewState = useSelector((state: Rootstate) => state.review)
  // const theoryQuestions = reviewState.theoryQuestion
  // const practicalQuestions = reviewState.practicalQuestion
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isCompositeWeek = reviewState.selectedWeek === "week-4"

  const sectionTitle = useMemo(() => {
    if (!isCompositeWeek) return null
    if (stepIndex === 0) return "Basic Array Pattern (Week 1)"
    if (stepIndex === 1) return "Logic Array Questions (Week 2)"
    return "Java OOPs Concept (Week 3)"
  }, [isCompositeWeek, stepIndex])

  useEffect(() => {
    setWeekName(stepIndex === 0 ? 'week-1' : stepIndex === 1 ? 'week-2' : 'week-3')
  }, [stepIndex])

  const scopedTheory = useMemo(() => {
    if (!isCompositeWeek) return reviewState.questions.theory as Question[]

    const compilation = reviewState.questions as CompilationWeekQuestions

    return compilation[weekName].theory
  }, [isCompositeWeek, reviewState, stepIndex])

  const scopedPractical = useMemo(() => {
    if (!isCompositeWeek) return reviewState.questions.practical as Question[]

    const compilation = reviewState.questions as CompilationWeekQuestions

    return compilation[weekName].practical
  }, [isCompositeWeek, reviewState, stepIndex])

  // Get current questions based on filter (respect scoping)
  // let currentQuestions = currentFilter === "theory" ? scopedTheory : scopedPractical

  useEffect(() => {
    setCurrentQuestions(currentFilter === "theory" ? scopedTheory : scopedPractical)
  }, [currentQuestions, currentFilter, reviewState])

  const openPopup = (id: number) => {
    setSelectedQuestionId(id)
  }

  const closePopup = () => {
    setSelectedQuestionId(null)
  }

  const handlePerformanceSelect = (rating: number) => {
    if (selectedQuestionId !== null) {
      dispatch(setAnswered({ id: selectedQuestionId, performance: rating, questionType: currentFilter, weekName }))
      closePopup()
    }
  }

  const handleAnswer = async (id: number, currentFilterStr: string) => {
    const question = currentQuestions.find((item) => item.id === id)

    setAiQuestion(question?.text || "")
    setIsAiModalOpen(true)
    setIsAnswereLoading(true)

    const data = await askQuestionToAi(question?.text || "", currentFilterStr, laguage)

    if (data.success) {
      setAiAnswere(data.answer)
    } else {
      if (data.status === 503) {
        toast.error(`Error ${data.status}: The AI server is busy or temporarily unavailable. Please try again in a moment.`)

      } else if (data.status === 429) {
        toast.error(`Error ${data.status}: Our service is currently using the free tier of the AI, and today’s usage limit has been reached. Please try again tomorrow. We appreciate your understanding.`)

      } else {
        toast.error(`Error ${data.status}: Something went wrong while fetching questions.`)
      }
    }

    setIsAnswereLoading(false)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsAiModalOpen(false)
    }
  }

  useEffect(() => {
    console.log();

    if (!isCompositeWeek) {
      const normal = reviewState.questions as NormalWeekQuestions
      if (normal.theory.length === 0 && normal.practical.length === 0) {
        navigate("/")
      }
    } else {
      const compilation = reviewState.questions as CompilationWeekQuestions
      const allEmpty = Object.values(compilation).every(
        (week) => week.theory.length === 0 && week.practical.length === 0
      )
      if (allEmpty) {
        navigate("/")
      }
    }
  }, [reviewState, isCompositeWeek, navigate])

  const allQuestionArea = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isAiModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isAiModalOpen])

  useEffect(() => {
    if (reviewState.selectedWeek === "week-4") {
      setLaguage(weekName === "week-1" || weekName === "week-2" ? "c" : "java");
    } else {
      setLaguage(reviewState.selectedWeek === "week-1" || reviewState.selectedWeek === "week-2" ? "c" : "java");
    }
  }, [weekName, reviewState.selectedWeek]);

  const handleNext = () => {
    if (!isCompositeWeek) return
    if (stepIndex < 2) {
      const nextIndex = stepIndex + 1
      setStepIndex(nextIndex)
      updateCurrentQustion(nextIndex)
      setCurrentFilter('theory')
      handleScrollTop()
    }
  }

  const handlePrevious = () => {
    if (!isCompositeWeek) return
    if (stepIndex > 0) {
      const nextIndex = stepIndex - 1
      setStepIndex(nextIndex)
      updateCurrentQustion(nextIndex)
      setCurrentFilter('theory')
      handleScrollTop()
    }

  }

  const handleScrollTop = () => {
    allQuestionArea.current?.scrollTo({
      top: 0,
      behavior: "smooth", // optional
    })
  }

  const updateCurrentQustion = (index: number) => {
    const week = index === 0 ? 'week-1' : index === 1 ? 'week-2' : 'week-3'
    setWeekName(week)
    const compilation = reviewState.questions as CompilationWeekQuestions
    setCurrentQuestions(compilation[week][currentFilter])
  }
  const handleComplete = () => {
    // if (!isCompositeWeek) return
    setIsCompleted(true)
  }

  useEffect(() => {
    if (isCompleted) {
      const element = document.getElementById("answered-theory-sec");
      if (element) {
        const rect = element.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;

        const offset = window.innerHeight * 0.4;
        const targetScroll = absoluteTop - offset;

        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    }
  }, [isCompleted])


  const resetStates = () => {
    setStepIndex(0)
    setCurrentFilter('theory')
    setIsCompleted(false)
  }


  return (
    <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto relative">
      {isCompositeWeek && (
        <div className="w-full mb-4">
          <div className="bg-[#1b1b1b] border border-[#2a2a2a] rounded-md p-4 flex items-center justify-between">
            <h3 className="text-gray-100 text-lg font-semibold">{sectionTitle}</h3>
            <div className="text-gray-400 text-sm">Step {stepIndex + 1} of 3</div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full">
        {/* Box 1: All Questions */}
        <div className="flex-1 bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg">
          <div className="mb-6 border-b border-[#333333] pb-4">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">All Questions</h2>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                className={`text-sm px-4 py-2 h-auto transition-all duration-200 ${currentFilter === "theory"
                  ? "bg-[#444444] text-gray-100 border border-[#555555]"
                  : "bg-[#2A2A2A] text-gray-400 border border-[#333333] hover:bg-[#333333] hover:text-gray-300"
                  }`}
                onClick={() => setCurrentFilter("theory")}
              >
                Theory Questions
              </Button>
              <Button
                className={`text-sm px-4 py-2 h-auto transition-all duration-200 ${currentFilter === "practical"
                  ? "bg-[#444444] text-gray-100 border border-[#555555]"
                  : "bg-[#2A2A2A] text-gray-400 border border-[#333333] hover:bg-[#333333] hover:text-gray-300"
                  }`}
                onClick={() => setCurrentFilter("practical")}
              >
                Practical Questions
              </Button>
            </div>
          </div>

          <div className="h-[calc(90vh-160px)] overflow-y-auto pr-2">
            <div ref={allQuestionArea} className="h-[calc(90vh-160px)] overflow-y-auto pr-2">
              <div className="space-y-4">
                {currentQuestions.length > 0 ? (
                  currentQuestions.map((question) => (
                    <div key={question.id} className="bg-[#2A2A2A] p-4 rounded-md border border-[#333333]">
                      <div className="flex items-start justify-between mb-3">
                        {question.href ?
                          (<a className="text-grey-200 flex-1" href={question.href}>{question.text}</a>) :
                          (<p className="text-gray-200 flex-1">{question.text}</p>)
                        }
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className={`text-xs px-3 py-1 h-auto border transition-all duration-200 ${question.answered
                            ? "bg-[#2d4a2d] border-[#4a6b4a] text-green-300 cursor-not-allowed opacity-70"
                            : "bg-[#1a1a1a] hover:bg-[#2d2d2d] text-gray-300 border-[#404040] hover:border-[#505050]"
                            }`}
                          disabled={question.answered}
                          onClick={() => openPopup(question.id)}
                        >
                          Answered
                        </Button>
                        <Button
                          className={`text-xs px-3 py-1 h-auto border transition-all duration-200 ${question.notanswered
                            ? "bg-[#4a2d2d] border-[#6b4a4a] text-red-300 cursor-not-allowed opacity-70"
                            : "bg-[#1a1a1a] hover:bg-[#2d2d2d] text-gray-300 border-[#404040] hover:border-[#505050]"
                            }`}
                          disabled={question.notanswered}
                          onClick={() => dispatch(setNotAnswered({ id: question.id, questionType: currentFilter, weekName }))}
                        >
                          Not Answered
                        </Button>
                        <Button
                          className="text-xs px-3 py-1 h-auto bg-transparent text-[#255f38] border border-[#255f38] hover:bg-[#255f38] hover:text-white rounded-md transition-all duration-200"
                          onClick={() => handleAnswer(question.id, currentFilter)}
                        >
                          Answer
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-10">
                    <p>No {currentFilter} questions available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Popup */}
        <PerformancePopup
          isOpen={selectedQuestionId !== null}
          onClose={closePopup}
          onSelect={handlePerformanceSelect}
        />

        {isAiModalOpen && (
          <AnswereModal
            handleOverlayClick={handleOverlayClick}
            setIsAiModalOpen={setIsAiModalOpen}
            isLoading={isanswereLoading}
            answere={aiAnswere}
            question={aiQuestion}
            laguage={laguage}
            isCode={currentFilter === "theory" ? false : true}
          />
        )}

        {/* Box 2: Answered Questions */}
        <div className="flex-1 bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6 border-b border-[#333333] pb-4">
            <h2 className="text-2xl font-bold text-gray-100">Answered Questions</h2>
            <span className="text-sm text-gray-400 bg-[#2A2A2A] px-2 py-1 rounded border border-[#333333]">
              {currentFilter === "theory" ? "Theory" : "Practical"}
            </span>
          </div>
          <div className="h-[calc(90vh-160px)] overflow-y-auto pr-2">
            <div className="space-y-4">
              {currentQuestions.filter((question) => question.answered).length > 0 ? (
                currentQuestions
                  .filter((question) => question.answered)
                  .map((question) => (
                    <div key={question.id} className="relative bg-[#2A2A2A] p-4 rounded-md border border-[#333333]">
                      <button
                        onClick={() => dispatch(removeAnswered({ id: question.id, questionType: currentFilter }))}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-lg"
                        title="Remove from answered"
                      >
                        ×
                      </button>
                      <div className="pr-6">
                        <p className="text-gray-200 mb-3">{question.text}</p>
                        {currentFilter === "practical" && (
                          <span className="inline-block mb-2 px-2 py-1 text-xs bg-[#333333] text-gray-400 rounded border border-[#444444]">
                            Practical
                          </span>
                        )}
                        {typeof question.performance === "number" && question.performance > 0 && (
                          <div className="flex gap-1 mt-2">
                            {Array.from({ length: question.performance }, (_, i) => (
                              <span key={i} className="text-lg text-gray-500">
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-gray-400 text-center py-10">
                  <p>Answered {currentFilter} questions will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Box 3: Not Answered Questions */}
        <div className="flex-1 bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6 border-b border-[#333333] pb-4">
            <h2 className="text-2xl font-bold text-gray-100">Not Answered Questions</h2>
            <span className="text-sm text-gray-400 bg-[#2A2A2A] px-2 py-1 rounded border border-[#333333]">
              {currentFilter === "theory" ? "Theory" : "Practical"}
            </span>
          </div>
          <div className="h-[calc(90vh-160px)] overflow-y-auto pr-2">
            <div className="space-y-4">
              {currentQuestions.filter((q) => q.notanswered).length > 0 ? (
                currentQuestions
                  .filter((question) => question.notanswered)
                  .map((question) => (
                    <div key={question.id} className="relative bg-[#2A2A2A] p-4 rounded-md border border-[#333333]">
                      <button
                        onClick={() => dispatch(removeNotAnswered({ id: question.id, questionType: currentFilter }))}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-lg"
                        title="Remove from not answered"
                      >
                        ×
                      </button>
                      <div className="pr-6">
                        <p className="text-gray-200 mb-3">{question.text}</p>
                        {currentFilter === "practical" && (
                          <span className="inline-block px-2 py-1 text-xs bg-[#333333] text-gray-400 rounded border border-[#444444]">
                            Practical
                          </span>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-gray-400 text-center py-10">
                  <p>Not answered {currentFilter} questions will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isCompositeWeek ? (
        <div className="w-full mt-8 flex justify-end">
          <div className="flex gap-2">
            {stepIndex > 0 && (
              <Button
                className="px-6 h-9 bg-[#2A2A2A] text-gray-200 border border-[#333333] hover:bg-[#333333]"
                onClick={handlePrevious}
              >
                Previous
              </Button>
            )}
            {stepIndex < 2 ? (
              <Button
                className="px-6 h-9 bg-[#2A2A2A] text-gray-200 border border-[#333333] hover:bg-[#333333]"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <>
                <Button
                  className="px-6 h-9 bg-[#2A2A2A] text-gray-200 border border-[#333333] hover:bg-[#333333]"
                  onClick={handleComplete}
                >
                  Complete
                </Button>
                <Button
                  className="px-6 h-9 bg-[#2A2A2A] text-gray-200 border border-[#333333] hover:bg-[#333333]"
                  onClick={() => setShowExtraQuestions(true)}
                >
                  Extra Questions
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full mt-4 flex justify-end gap-2">
          <Button
            className="px-6 h-9 bg-[#2A2A2A] text-gray-200 border border-[#333333] hover:bg-[#333333]"
            onClick={handleComplete}
          >
            Complete
          </Button>
          <Button
            className="px-6 h-9 bg-[#2A2A2A] text-gray-200 border border-[#333333] hover:bg-[#333333]"
            onClick={() => setShowExtraQuestions(true)}
          >
            Extra Questions
          </Button>
        </div>
      )}

      {showExtraQuestions && <ExtraQuestions isOpen={showExtraQuestions} onClose={() => setShowExtraQuestions(false)} />}

      {isCompleted && (
        <div className="w-full mt-6">
          <ReviewResults resetStates={resetStates} />
        </div>
      )}
    </div>
  )
}

