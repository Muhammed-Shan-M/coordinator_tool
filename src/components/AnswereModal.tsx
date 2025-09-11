import React from 'react'
import { X } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import ReactMarkdown from "react-markdown"

interface PropsType {
  handleOverlayClick: (e: React.MouseEvent) => void;
  setIsAiModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  answere: string,
  question: string,
  laguage: string,
  isCode: boolean
}

const AnswereModal = ({ handleOverlayClick, setIsAiModalOpen, isLoading, answere, question, laguage, isCode }: PropsType) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleOverlayClick}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative bg-black rounded-lg max-w-4xl w-full mx-4 max-h-[85vh] flex flex-col">

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-black p-8 pt-12">
          {/* Close Button */}
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="absolute top-4 left-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Question */}
          <div className="text-white mb-6">
            <p className="text-lg leading-relaxed">{question}</p>
          </div>

          {/* Underline */}
          <div className={`mb-6 ${isCode ? "border-b-2 border-white" : "border-t border-gray-600"}`}></div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-8 pb-8">
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
            <div className="text-base leading-relaxed">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="m-0 mb-2">{children}</p>,
                  strong: ({ children }) => (
                    <strong className="text-red-600">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-blue-600 italic">{children}</em>
                  ),
                }}
              >
                {answere}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>

  )
}

export default AnswereModal
