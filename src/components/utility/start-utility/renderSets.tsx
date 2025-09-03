"use client"

import { ChevronDown, ChevronUp, Check } from "lucide-react"

interface RenderSetsProps {
  sets: any[]
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
  return (
    <div className="max-h-96 overflow-y-auto space-y-4">
      {sets.map((set) => (
        <div key={set.id} className="border border-[#333333] rounded-lg">
          <div
            className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
              selectedSet === set.id ? "bg-[#444444] border-[#555555]" : "hover:bg-[#333333]"
            }`}
            onClick={() => {
              setSelectedSet(set.id)
              toggleSetExpansion(set.id, type, category)
            }}
          >
            <div className="flex items-center gap-3">
              {selectedSet === set.id && <Check className="h-5 w-5 text-green-400" />}
              <span className="text-gray-200 font-medium">{set.name}</span>
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
                {set.questions.map((question: string, index: number) => (
                  <div key={index} className="text-gray-300 text-sm">
                    {index + 1}. {question}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
