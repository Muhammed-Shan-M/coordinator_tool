import React from 'react'
import { X } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface PropsType {
  handleOverlayClick: (e: React.MouseEvent) => void;
  setIsAiModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  answere: string,
  question: string,
  laguage:string,
  isCode:boolean
}

const AnswereModal = ({ handleOverlayClick, setIsAiModalOpen, isLoading, answere, question, laguage, isCode }: PropsType) => {
  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleOverlayClick}>
          {/* Backdrop with slight blur */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          {/* Modal Content */}
          <div className="relative bg-black rounded-lg max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto">
            {/* Close button in left corner */}
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="absolute top-4 left-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal content with question and answer */}
            <div className="p-8 pt-12">
              {/* Question */}
              <div className="text-white mb-6">
                <p className="text-lg leading-relaxed">{question}</p>
              </div>

              {/* Underline for code, divider line for text */}
              <div className={`mb-6 ${isCode ? "border-b-2 border-white" : "border-t border-gray-600"}`}></div>

              {/* Answer or Code */}
              <div className="text-white">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                    <p className="text-sm text-gray-300">Loading answer...</p>
                  </div>
                ) : isCode ? (
                  <div className="rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      language={laguage}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.5rem",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                      showLineNumbers={true}
                      wrapLines={true}
                    >
                      {answere}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <div className="text-base leading-relaxed whitespace-pre-line">{answere}</div>
                )}
              </div>
            </div>
          </div>
        </div>
  )
}

export default AnswereModal
