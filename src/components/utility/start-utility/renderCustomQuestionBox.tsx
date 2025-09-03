"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface RenderCustomQuestionBoxProps {
  title: string
  activeTab: string
  setActiveTab: (tab: string) => void
  theoryValue: string
  setTheoryValue: (value: string) => void
  practicalValue: string
  setPracticalValue: (value: string) => void
  theoryError: string
  practicalError: string
}

export default function RenderCustomQuestionBox({
  title,
  activeTab,
  setActiveTab,
  theoryValue,
  setTheoryValue,
  practicalValue,
  setPracticalValue,
  theoryError,
  practicalError,
}: RenderCustomQuestionBoxProps) {
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

      <div className="space-y-2">
        <Label className="text-gray-200">
          Paste Custom {activeTab === "theory" ? "Theory" : "Practical"} Questions
        </Label>
        <Textarea
          placeholder="Paste your questions here..."
          className="h-32 bg-[#222222] border-[#333333] text-gray-200 placeholder:text-gray-500 focus:ring-offset-[#1A1A1A] resize-none"
          value={activeTab === "theory" ? theoryValue : practicalValue}
          onChange={(e) => {
            if (activeTab === "theory") {
              setTheoryValue(e.target.value)
            } else {
              setPracticalValue(e.target.value)
            }
          }}
        />
        <p className="text-sm text-gray-400">
          {activeTab === "theory"
            ? theoryError || "Paste the questions separated with numbers or bullet points."
            : practicalError || "Paste the questions separated with numbers or bullet points."}
        </p>
      </div>
    </div>
  )
}
