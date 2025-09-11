"use client"

import { Button } from "@/components/ui/button"
import RenderSets from "./renderSets"

interface RenderPredefinedQuestionBoxProps {
  title: string
  activeTab: string
  setActiveTab: (tab: string) => void
  theorySets: any[]
  practicalSets: any[]
  selectedTheorySet: string
  setSelectedTheorySet: (value: string) => void
  selectedPracticalSet: string
  setSelectedPracticalSet: (value: string) => void
  expandedTheorySet: string
  expandedPracticalSet: string
  toggleSetExpansion: (setId: string, type: string, category?: string) => void
  category?: string
}

export default function RenderPredefinedQuestionBox({
  title,
  activeTab,
  setActiveTab,
  theorySets,
  practicalSets,
  selectedTheorySet,
  setSelectedTheorySet,
  selectedPracticalSet,
  setSelectedPracticalSet,
  expandedTheorySet,
  expandedPracticalSet,
  toggleSetExpansion,
  category,
}: RenderPredefinedQuestionBoxProps) {
  

  return (
    <div className="bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-[#333333] pb-4">{title}</h2>

      <div className="flex gap-0 mb-6 border border-[#333333] rounded-md overflow-hidden">
        <Button
          onClick={() => setActiveTab("theory")}
          className={`flex-1 rounded-none px-6 py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === "theory" ? "bg-[#444444] text-gray-50" : "bg-[#222222] text-gray-400 hover:bg-[#333333]"
          }`}
        >
          THEORY
        </Button>
        <Button
          onClick={() => setActiveTab("practical")}
          className={`flex-1 rounded-none px-6 py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === "practical" ? "bg-[#444444] text-gray-50" : "bg-[#222222] text-gray-400 hover:bg-[#333333]"
          }`}
        >
          PRACTICAL
        </Button>
      </div>

      {activeTab === "theory" ? (
        <RenderSets
          sets={theorySets}
          selectedSet={selectedTheorySet}
          setSelectedSet={setSelectedTheorySet}
          expandedSet={expandedTheorySet}
          type="theory"
          category={category}
          toggleSetExpansion={toggleSetExpansion}
        />
      ) : (
        <RenderSets
          sets={practicalSets}
          selectedSet={selectedPracticalSet}
          setSelectedSet={setSelectedPracticalSet}
          expandedSet={expandedPracticalSet}
          type="practical"
          category={category}
          toggleSetExpansion={toggleSetExpansion}
        />
      )}
    </div>
  )
}
