"use client"
import { useState, useEffect } from "react"
import { X, Check } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { ExtraQuestion } from "@/util/type"
import { getExtraQuestions } from "@/util/ai-utility"
import { useSelector } from "react-redux"
import { Rootstate } from "@/redux/Store"
import { toast } from "react-toastify";


type QuestionModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function ExtraQuestions({ isOpen, onClose }: QuestionModalProps) {
  const [questions, setQuestions] = useState<ExtraQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())

  const reviewState = useSelector((state: Rootstate) => state.review)



  useEffect(() => {
    if (isOpen) {
      loadQuestions()
    }
  }, [isOpen])

  const loadQuestions = async () => {
    setLoading(true)
    try {

      const data = await getExtraQuestions(reviewState.selectedWeek)


      if (data.success) {
        setQuestions(data.questions);
      } else {
        console.error(`Error ${data.status}: ${data.message}`);
        if(data.status === 503){
          toast.error(`Error ${data.status}: The AI server is busy or temporarily unavailable. Please try again in a moment.`)
        }else if(data.status === 429){
          toast.error(`Error ${data.status}: Our service is currently using the free tier of the AI, and today’s usage limit has been reached. Please try again tomorrow. We appreciate your understanding.`)
        }else{
          toast.error(`Error ${data.status}: Something went wrong while fetching questions.`)
        }
      }

    } catch (error) {
      console.error("Error loading questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAsked = (questionId: string) => {
    setAskedQuestions((prev) => {
      const newSet = new Set(prev) 
      if (newSet.has(questionId)) {
        newSet.delete(questionId) 
      } else {
        newSet.add(questionId)    
      }
      return newSet
    })
  }


  const renderContent = (content: { type: string; value: string; language?: string }[]) => {
    return (
      <div className="space-y-3">
        {content.map((part, index) => {
          if (part.type === "code") {
            return (
              <SyntaxHighlighter
                key={index}
                language={part.language || "javascript"}
                style={vscDarkPlus}
                customStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "4px",
                  fontSize: "13px",
                  margin: 0,
                }}
                showLineNumbers={false}
              >
                {part.value}
              </SyntaxHighlighter>
            )
          } else {
            return (
              <div key={index} className="text-gray-300 leading-relaxed whitespace-pre-line">
                {part.value}
              </div>
            )
          }
        })}
      </div>
    )
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-[#222222] rounded-lg shadow-2xl w-[80vw] h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333333]">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-white">Interview Questions</h2>
            <span className="ml-3 px-2 py-1 bg-[#333333] text-gray-300 rounded text-sm">
              {questions.length} Questions
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#333333] text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">Loading questions...</p>
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No questions available.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => {
                const isAsked = askedQuestions.has(question.id)
                return (
                  <div
                    key={question.id}
                    className={`bg-[#2a2a2a] rounded-lg p-4 transition-all ${isAsked ? "opacity-75 border-l-4 border-green-500" : "border border-[#333333]"
                      }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-sm text-gray-500 mr-3">Question {index + 1}</span>
                          {question.category && (
                            <span className="px-2 py-1 bg-[#333333] text-gray-300 rounded text-xs">
                              {question.category}
                            </span>
                          )}
                        </div>
                        <h3 className="text-white font-medium mb-2">{question.title}</h3>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleToggleAsked(question.id)}
                          className={`px-3 py-1 rounded text-sm flex items-center transition-colors ${isAsked
                            ? "bg-green-700 text-green-200 hover:bg-green-800"
                            : "bg-[#444444] text-gray-300 hover:bg-[#555555]"
                            }`}
                        >
                          {isAsked ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Asked
                            </>
                          ) : (
                            "Mark as Asked"
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">{renderContent(question.content as any)}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#333333] text-center">
          <p className="text-gray-500 text-xs">
            These questions are for extra practice only. This does not consider for student mark updation.
          </p>
        </div>
      </div>
    </div>
  )
}
