"use client"

import { QuestionSet } from "@/util/type"
import { ChevronDown, ChevronUp, Check } from "lucide-react"
import { useState } from "react"
import Tippy from "@tippyjs/react";
import { followCursor } from "tippy.js";
import "tippy.js/dist/tippy.css";
// import PreviewModal from "@/components/PatternModal"

interface RenderSetsProps {
  sets: QuestionSet[]
  selectedSet: string
  setSelectedSet: (value: string) => void
  expandedSet: string
  type: string
  category?: string
  toggleSetExpansion: (setId: string, type: string, category?: string) => void
}

export default function RenderSets({
  sets,
  selectedSet,
  setSelectedSet,
  expandedSet,
  type,
  category,
  toggleSetExpansion,
}: RenderSetsProps) {

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  console.log(sets, selectedSet, expandedSet)
  return (
    <div className="max-h-96 overflow-y-auto space-y-4">
      {sets.length > 0 ? (
        sets.map((set, ind) => (
          <div key={set.id} className="border border-[#333333] rounded-lg">
            <div
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${selectedSet === set.id
                ? "bg-[#444444] border-[#555555]"
                : "hover:bg-[#333333]"
                }`}
              onClick={() => {
                setSelectedSet(set.id)
                toggleSetExpansion(set.id, type, category)
              }}
            >
              <div className="flex items-center gap-3">
                {selectedSet === set.id && (
                  <Check className="h-5 w-5 text-green-400" />
                )}
                <span className="text-gray-200 font-medium">{`Set ${ind + 1}`}</span>
              </div>
              {expandedSet === set.id ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>

            {expandedSet === set.id && (
              <div className="border-t border-[#333333] p-4 bg-[#222222]">
                <div className="space-y-2">
                  {set.questions.map((question, index: number) => (
                    <div key={index} className="text-gray-300 text-sm">
                      {index + 1}.{" "}
                      {question.href ? (
                        <Tippy
                          placement="top"
                          trigger="mouseenter focus"
                          delay={[0, 0]}
                          duration={[200, 100]}
                          arrow={false}
                          interactive={false}
                          allowHTML={true}
                          content={
                            <div className="bg-[#222] border border-[#333] rounded-lg w-[400px] h-[400px] shadow-lg overflow-hidden relative">
                              {/* Loading overlay */}
                              {loadingStates[question.href] !== false && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#222] z-10">
                                  <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                                    <p className="text-gray-400 text-sm">Loading preview...</p>
                                  </div>
                                </div>
                              )}

                              <iframe
                                src={question.href.replace('/edit', '/preview')}
                                className="w-full h-full"
                                title="Preview"
                                onLoad={() => {
                                  setLoadingStates(prev => ({ ...prev, [question.href]: false }));
                                }}
                                style={{
                                  opacity: loadingStates[question.href] === false ? 1 : 0,
                                  transition: 'opacity 0.3s ease-in-out'
                                }}
                              />
                            </div>
                          }
                        >
                          <a
                            href={question.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-gray-100 underline-offset-2 hover:underline"
                          >
                            {question.text}
                          </a>
                        </Tippy>


                      ) : (
                        question.text
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-400 border border-[#333333] rounded-lg bg-[#222222]">
          No presets available in this week. Select custom to add your own.
        </div>
      )}

      {/* {openPatternModal && <PreviewModal url={slectedUrl} onClose={() => setOpenPatternModal(false)}/>} */}
    </div>

  )
}
