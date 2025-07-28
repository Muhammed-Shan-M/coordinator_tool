"use client"

import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import type { Rootstate } from "@/redux/Store"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { setAnswered, setNotAnswered, removeAnswered, removeNotAnswered } from "@/redux/slice/qustions"
import PerformancePopup from "./PerformancePopup"
import ReviewResults from "./ReviewResult"
import { askQuestionToAi } from "@/util/ai-utility"
import AnswereModal from "./AnswereModal"

type FilterType = "theory" | "practical"

export default function ReviewDisplay() {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
  const [currentFilter, setCurrentFilter] = useState<FilterType>("theory")
  const [aiAnswere, setAiAnswere] = useState('')
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [isanswereLoading, setIsAnswereLoading] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')
  const [laguage,setLaguage] = useState('')

  const reviewState = useSelector((state:Rootstate) => state.review)
  const theoryQuestions = reviewState.theoryQuestion
  const practicalQuestions = reviewState.practicalQuestion
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get current questions based on filter
  const currentQuestions = currentFilter === "theory" ? theoryQuestions : practicalQuestions

  const openPopup = (id: number) => {
    setSelectedQuestionId(id)
  }

  const closePopup = () => {
    setSelectedQuestionId(null)
  }

  const handlePerformanceSelect = (rating: number) => {
    if (selectedQuestionId !== null) {
      dispatch(setAnswered({ id: selectedQuestionId, performance: rating, qustionType: currentFilter, }))
      closePopup()
    }
  }

  const handleAnswer = async (id: number,currentFilter:string ) => {

    
    const question = currentFilter === 'theory' ? theoryQuestions.find((q) => q.id === id) : practicalQuestions.find((q) => q.id === id);

    setAiQuestion(question?.text || '')
    setIsAiModalOpen(true); // Open modal first
    setIsAnswereLoading(true);       // Start loading


    const answer = await askQuestionToAi(question?.text || '', currentFilter,laguage);

    setAiAnswere(answer);
    setIsAnswereLoading(false);
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsAiModalOpen(false)
    }
  }

  useEffect(() => {
    if (theoryQuestions.length === 0 && practicalQuestions.length === 0) {
      navigate("/")
    }
  }, [])

  useEffect(() => {
    if (isAiModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isAiModalOpen])

  useEffect(() => {
    const week = reviewState.selectedWeek

    if(week === 'week-1' || week === 'week-2'){
      setLaguage('c')
    }else if(week === 'week-3' || week === 'week-4'){
      setLaguage('java')
    }
  },[])


  return (
    <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto relative">
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
            <div className="h-[calc(90vh-160px)] overflow-y-auto pr-2">
              <div className="space-y-4">
                {currentQuestions.length > 0 ? (
                  currentQuestions.map((question) => (
                    <div key={question.id} className="bg-[#2A2A2A] p-4 rounded-md border border-[#333333]">
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-gray-200 flex-1">{question.text}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="text-xs px-3 py-1 h-auto bg-[#1a1a1a] hover:bg-[#2d2d2d] text-gray-300 border border-[#404040] hover:border-[#505050] transition-all duration-200"
                          onClick={() => handleAnswer(question.id,currentFilter)}
                        >
                          Answer
                        </Button>
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
                          onClick={() => dispatch(setNotAnswered({ id: question.id, qustionType: currentFilter }))}
                        >
                          Not Answered
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

        {isAiModalOpen && <AnswereModal
          handleOverlayClick={handleOverlayClick}
          setIsAiModalOpen={setIsAiModalOpen}
          isLoading={isanswereLoading}
          answere={aiAnswere}
          question={aiQuestion} 
          laguage={laguage}
          isCode={currentFilter === 'theory' ? false : true}
          />}

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
                        onClick={() => dispatch(removeAnswered({ id: question.id, qustionType: currentFilter }))}
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
                        onClick={() => dispatch(removeNotAnswered({ id: question.id, qustionType: currentFilter }))}
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



      <ReviewResults />
    </div>
  )
}
