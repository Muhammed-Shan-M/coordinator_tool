"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { predefinedQuestionSets, predefinedPracticalQuestionSets } from "../util/predefined"
import { useDispatch } from "react-redux"
import type { AppDispach } from "@/redux/Store"
import { useNavigate } from "react-router-dom"
import { validateQuestions, extractQustions } from "@/util/utility"
import type { ReviewState } from "@/util/type"
import { setReviewState } from "@/redux/slice/qustions"
import { ChevronDown, ChevronUp, Check } from "lucide-react"

// Week 4 specific question sets - you'll need to add these to your predefined.ts file
const cBasicPatternSets = {
  theory: [
    {
      id: "c-basic-theory-1",
      name: "Set 1",
      questions: [
        "What is a pattern in C programming?",
        "Explain nested loops in pattern printing.",
        "What are the types of triangle patterns?",
        "How do you create a diamond pattern logic?",
        "What is the difference between right and left triangle patterns?",
      ],
    },
    {
      id: "c-basic-theory-2",
      name: "Set 2",
      questions: [
        "Explain the logic behind pyramid patterns.",
        "What are hollow patterns in C?",
        "How do you print inverted patterns?",
        "What is the role of spaces in pattern printing?",
        "Explain the concept of symmetrical patterns.",
      ],
    },
  ],
  practical: [
    {
      id: "c-basic-practical-1",
      name: "Set 1",
      questions: [
        "Write a C program to print a right triangle pattern using stars.",
        "Create a program to print number pyramid pattern.",
        "Implement a program to print diamond pattern.",
        "Write a program to print Pascal's triangle.",
        "Create a program to print inverted triangle pattern.",
      ],
    },
    {
      id: "c-basic-practical-2",
      name: "Set 2",
      questions: [
        "Write a C program to print hollow square pattern.",
        "Create a program to print alphabet pattern.",
        "Implement a program to print spiral pattern.",
        "Write a program to print zigzag pattern.",
        "Create a program to print butterfly pattern.",
      ],
    },
  ],
}

const cLogicalArraySets = {
  theory: [
    {
      id: "c-logical-theory-1",
      name: "Set 1",
      questions: [
        "What is an array in C programming?",
        "Explain array indexing and bounds.",
        "What are the advantages of using arrays?",
        "How do you traverse an array?",
        "What is the difference between 1D and 2D arrays?",
      ],
    },
    {
      id: "c-logical-theory-2",
      name: "Set 2",
      questions: [
        "Explain array initialization methods.",
        "What are dynamic arrays?",
        "How do you pass arrays to functions?",
        "What is array decay in C?",
        "Explain multidimensional arrays.",
      ],
    },
  ],
  practical: [
    {
      id: "c-logical-practical-1",
      name: "Set 1",
      questions: [
        "Write a C program to find second largest element in array.",
        "Create a program to rotate array elements.",
        "Implement a program to find duplicate elements.",
        "Write a program to merge two arrays.",
        "Create a program to find missing number in array.",
      ],
    },
    {
      id: "c-logical-practical-2",
      name: "Set 2",
      questions: [
        "Write a C program to sort array in ascending order.",
        "Create a program to find intersection of two arrays.",
        "Implement a program to remove duplicates from array.",
        "Write a program to find majority element.",
        "Create a program to rearrange positive and negative numbers.",
      ],
    },
  ],
}

const javaSets = {
  theory: [
    {
      id: "java-theory-1",
      name: "Set 1",
      questions: [
        "What is Object-Oriented Programming?",
        "Explain the four pillars of OOP.",
        "What is inheritance in Java?",
        "Define polymorphism and its types.",
        "What is encapsulation and data hiding?",
      ],
    },
    {
      id: "java-theory-2",
      name: "Set 2",
      questions: [
        "What is abstraction in Java?",
        "Explain method overloading and overriding.",
        "What are interfaces and abstract classes?",
        "Define constructors and their types.",
        "What is the difference between class and object?",
      ],
    },
  ],
  practical: [
    {
      id: "java-practical-1",
      name: "Set 1",
      questions: [
        "Write a Java program to implement inheritance.",
        "Create a program to demonstrate method overloading.",
        "Implement a program using interfaces.",
        "Write a program to handle exceptions.",
        "Create a program using collections framework.",
      ],
    },
    {
      id: "java-practical-2",
      name: "Set 2",
      questions: [
        "Write a Java program to implement polymorphism.",
        "Create a program using abstract classes.",
        "Implement a program with multithreading.",
        "Write a program to work with files.",
        "Create a program using lambda expressions.",
      ],
    },
  ],
}

export default function ReviewSetup() {
  const dispatch = useDispatch<AppDispach>()
  const navigate = useNavigate()

  const [studentName, setStudentName] = useState("")
  const [selectedWeek, setSelectedWeek] = useState("")
  const [questionMode, setQuestionMode] = useState("predefined") // 'predefined' or 'custom'

  // State for Theory Questions
  const [theoryQuestionType, setTheoryQuestionType] = useState("predefined") // 'predefined' or 'custom'
  const [customTheoryQuestions, setCustomTheoryQuestions] = useState("")
  const [selectedPredefinedTheorySet, setSelectedPredefinedTheorySet] = useState("")

  // State for Practical Questions
  const [practicalQuestionType, setPracticalQuestionType] = useState("predefined") // 'predefined' or 'custom'
  const [customPracticalQuestions, setCustomPracticalQuestions] = useState("")
  const [selectedPredefinedPracticalSet, setSelectedPredefinedPracticalSet] = useState("")

  // New states for the updated design
  const [activePredefinedTab, setActivePredefinedTab] = useState("theory")
  const [activeCustomTab, setActiveCustomTab] = useState("theory")
  const [expandedTheorySet, setExpandedTheorySet] = useState("")
  const [expandedPracticalSet, setExpandedPracticalSet] = useState("")

  // Week 4 specific states
  const [activeCBasicTab, setActiveCBasicTab] = useState("theory")
  const [activeCLogicalTab, setActiveCLogicalTab] = useState("theory")
  const [activeJavaTab, setActiveJavaTab] = useState("theory")

  const [selectedCBasicTheorySet, setSelectedCBasicTheorySet] = useState("")
  const [selectedCBasicPracticalSet, setSelectedCBasicPracticalSet] = useState("")
  const [selectedCLogicalTheorySet, setSelectedCLogicalTheorySet] = useState("")
  const [selectedCLogicalPracticalSet, setSelectedCLogicalPracticalSet] = useState("")
  const [selectedJavaTheorySet, setSelectedJavaTheorySet] = useState("")
  const [selectedJavaPracticalSet, setSelectedJavaPracticalSet] = useState("")

  const [expandedCBasicTheorySet, setExpandedCBasicTheorySet] = useState("")
  const [expandedCBasicPracticalSet, setExpandedCBasicPracticalSet] = useState("")
  const [expandedCLogicalTheorySet, setExpandedCLogicalTheorySet] = useState("")
  const [expandedCLogicalPracticalSet, setExpandedCLogicalPracticalSet] = useState("")
  const [expandedJavaTheorySet, setExpandedJavaTheorySet] = useState("")
  const [expandedJavaPracticalSet, setExpandedJavaPracticalSet] = useState("")

  // Week 4 custom states
  const [customCBasicTheoryQuestions, setCustomCBasicTheoryQuestions] = useState("")
  const [customCBasicPracticalQuestions, setCustomCBasicPracticalQuestions] = useState("")
  const [customCLogicalTheoryQuestions, setCustomCLogicalTheoryQuestions] = useState("")
  const [customCLogicalPracticalQuestions, setCustomCLogicalPracticalQuestions] = useState("")
  const [customJavaTheoryQuestions, setCustomJavaTheoryQuestions] = useState("")
  const [customJavaPracticalQuestions, setCustomJavaPracticalQuestions] = useState("")

  //Errors
  const [theoryError, setTheoryError] = useState("")
  const [practicalError, setPracticalError] = useState("")

  const toggleSetExpansion = (setId: string, type: string, category?: string) => {
    if (category === "c-basic") {
      if (type === "theory") {
        setExpandedCBasicTheorySet(expandedCBasicTheorySet === setId ? "" : setId)
      } else {
        setExpandedCBasicPracticalSet(expandedCBasicPracticalSet === setId ? "" : setId)
      }
    } else if (category === "c-logical") {
      if (type === "theory") {
        setExpandedCLogicalTheorySet(expandedCLogicalTheorySet === setId ? "" : setId)
      } else {
        setExpandedCLogicalPracticalSet(expandedCLogicalPracticalSet === setId ? "" : setId)
      }
    } else if (category === "java") {
      if (type === "theory") {
        setExpandedJavaTheorySet(expandedJavaTheorySet === setId ? "" : setId)
      } else {
        setExpandedJavaPracticalSet(expandedJavaPracticalSet === setId ? "" : setId)
      }
    } else {
      // For weeks 1-3
      if (type === "theory") {
        setExpandedTheorySet(expandedTheorySet === setId ? "" : setId)
      } else {
        setExpandedPracticalSet(expandedPracticalSet === setId ? "" : setId)
      }
    }
  }

  const handleStartReview = async () => {
    let inputTheoryQuestions = ""
    let inputPracticalQuestions = ""

    if (selectedWeek === "week-4") {
      // Handle Week 4 logic - you'll need to modify this based on your requirements
      if (questionMode === "custom") {
        inputTheoryQuestions = customCBasicTheoryQuestions + customCLogicalTheoryQuestions + customJavaTheoryQuestions
        inputPracticalQuestions =
          customCBasicPracticalQuestions + customCLogicalPracticalQuestions + customJavaPracticalQuestions
      } else {
        inputTheoryQuestions = selectedCBasicTheorySet + selectedCLogicalTheorySet + selectedJavaTheorySet
        inputPracticalQuestions = selectedCBasicPracticalSet + selectedCLogicalPracticalSet + selectedJavaPracticalSet
      }
    } else {
      // Handle Weeks 1-3 logic
      if (questionMode === "custom") {
        inputTheoryQuestions = customTheoryQuestions
        inputPracticalQuestions = customPracticalQuestions
      } else {
        inputTheoryQuestions = selectedPredefinedTheorySet
        inputPracticalQuestions = selectedPredefinedPracticalSet
      }
    }

    const theoryValidationError = validateQuestions(inputTheoryQuestions)
    const practicalValidationError = validateQuestions(inputPracticalQuestions)

    setTheoryError(theoryValidationError)
    setPracticalError(practicalValidationError)

    if (theoryValidationError || practicalValidationError) return

    const theoryQuestion = await extractQustions(inputTheoryQuestions)
    const practicalQuestion = await extractQustions(inputPracticalQuestions)

    const reviewState: ReviewState = {
      studentName,
      selectedWeek,
      theoryQuestion,
      practicalQuestion,
    }

    console.log(reviewState)
    dispatch(setReviewState(reviewState))
    navigate("/review")
  }

  const renderSets = (
    sets: any[],
    selectedSet: string,
    setSelectedSet: (value: string) => void,
    expandedSet: string,
    type: string,
    category?: string,
  ) => (
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

  const renderPredefinedQuestionBox = (
    title: string,
    activeTab: string,
    setActiveTab: (tab: string) => void,
    theorySets: any[],
    practicalSets: any[],
    selectedTheorySet: string,
    setSelectedTheorySet: (value: string) => void,
    selectedPracticalSet: string,
    setSelectedPracticalSet: (value: string) => void,
    expandedTheorySet: string,
    expandedPracticalSet: string,
    category?: string,
  ) => (
    <div className="bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-[#333333] pb-4">{title}</h2>

      {/* Filtration Tabs */}
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

      {/* Sets */}
      {activeTab === "theory"
        ? renderSets(theorySets, selectedTheorySet, setSelectedTheorySet, expandedTheorySet, "theory", category)
        : renderSets(
            practicalSets,
            selectedPracticalSet,
            setSelectedPracticalSet,
            expandedPracticalSet,
            "practical",
            category,
          )}
    </div>
  )

  const renderCustomQuestionBox = (
    title: string,
    activeTab: string,
    setActiveTab: (tab: string) => void,
    theoryValue: string,
    setTheoryValue: (value: string) => void,
    practicalValue: string,
    setPracticalValue: (value: string) => void,
  ) => (
    <div className="bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-[#333333] pb-4">{title}</h2>

      {/* Filtration Tabs */}
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

      {/* Text Area */}
      <div className="space-y-2">
        <Label className="text-gray-200">
          Paste Custom {activeTab === "theory" ? "Theory" : "Practical"} Questions
        </Label>
        <Textarea
          placeholder="Paste your questions here, separated with numbers (e.g., 1. Question One) or bullet points (e.g., - Question Two)."
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
            ? theoryError
              ? theoryError
              : "Paste the questions separated with numbers (e.g., 1. Question One) or bullet points (e.g., - Question Two)."
            : practicalError
              ? practicalError
              : "Paste the questions separated with numbers (e.g., 1. Question One) or bullet points (e.g., - Question Two)."}
        </p>
      </div>
    </div>
  )

  const isStartReviewDisabled = !studentName || !selectedWeek

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto min-h-screen relative p-4">
      {/* Student Information - Top and Wider */}
      <div className="w-full bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-[#333333] pb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="student-name" className="text-gray-200">
              Enter Student Name
            </Label>
            <Input
              id="student-name"
              placeholder="John Doe"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-[#222222] border-[#333333] text-gray-200 placeholder:text-gray-500 focus:ring-offset-[#1A1A1A]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="week-select" className="text-gray-200">
              Select Week
            </Label>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger id="week-select" className="w-full bg-[#222222] border-[#333333] text-gray-200">
                <SelectValue placeholder="Select a week" />
              </SelectTrigger>
              <SelectContent className="bg-[#222222] border-[#333333] text-gray-200">
                <SelectItem className="bg-[#222222] border-[#333333] text-gray-200" value="week-1">
                  Week 1
                </SelectItem>
                <SelectItem className="bg-[#222222] border-[#333333] text-gray-200" value="week-2">
                  Week 2
                </SelectItem>
                <SelectItem className="bg-[#222222] border-[#333333] text-gray-200" value="week-3">
                  Week 3
                </SelectItem>
                <SelectItem className="bg-[#222222] border-[#333333] text-gray-200" value="week-4">
                  Week 4
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-mode" className="text-gray-200">
              Question Mode
            </Label>
            <Select value={questionMode} onValueChange={setQuestionMode}>
              <SelectTrigger id="question-mode" className="w-full bg-[#222222] border-[#333333] text-gray-200">
                <SelectValue placeholder="Select question mode" />
              </SelectTrigger>
              <SelectContent className="bg-[#222222] border-[#333333] text-gray-200">
                <SelectItem className="bg-[#222222] border-[#333333] text-gray-200" value="predefined">
                  Predefined Questions
                </SelectItem>
                <SelectItem className="bg-[#222222] border-[#333333] text-gray-200" value="custom">
                  Custom Questions
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Question Selection Section for Weeks 1-3 */}
      {selectedWeek && selectedWeek !== "week-4" && (
        <div className="w-full mb-6">
          {questionMode === "custom"
            ? renderCustomQuestionBox(
                "Select Question",
                activeCustomTab,
                setActiveCustomTab,
                customTheoryQuestions,
                setCustomTheoryQuestions,
                customPracticalQuestions,
                setCustomPracticalQuestions,
              )
            : renderPredefinedQuestionBox(
                "Select Question",
                activePredefinedTab,
                setActivePredefinedTab,
                predefinedQuestionSets,
                predefinedPracticalQuestionSets,
                selectedPredefinedTheorySet,
                setSelectedPredefinedTheorySet,
                selectedPredefinedPracticalSet,
                setSelectedPredefinedPracticalSet,
                expandedTheorySet,
                expandedPracticalSet,
              )}
        </div>
      )}

      {/* Week 4 Special Layout */}
      {selectedWeek === "week-4" && (
        <div className="space-y-6 w-full mb-6">
          {questionMode === "custom" ? (
            <>
              {renderCustomQuestionBox(
                "C Basic Patterns",
                activeCBasicTab,
                setActiveCBasicTab,
                customCBasicTheoryQuestions,
                setCustomCBasicTheoryQuestions,
                customCBasicPracticalQuestions,
                setCustomCBasicPracticalQuestions,
              )}
              {renderCustomQuestionBox(
                "C Logical Array",
                activeCLogicalTab,
                setActiveCLogicalTab,
                customCLogicalTheoryQuestions,
                setCustomCLogicalTheoryQuestions,
                customCLogicalPracticalQuestions,
                setCustomCLogicalPracticalQuestions,
              )}
              {renderCustomQuestionBox(
                "Java OOPs",
                activeJavaTab,
                setActiveJavaTab,
                customJavaTheoryQuestions,
                setCustomJavaTheoryQuestions,
                customJavaPracticalQuestions,
                setCustomJavaPracticalQuestions,
              )}
            </>
          ) : (
            <>
              {renderPredefinedQuestionBox(
                "C Basic Patterns",
                activeCBasicTab,
                setActiveCBasicTab,
                cBasicPatternSets.theory,
                cBasicPatternSets.practical,
                selectedCBasicTheorySet,
                setSelectedCBasicTheorySet,
                selectedCBasicPracticalSet,
                setSelectedCBasicPracticalSet,
                expandedCBasicTheorySet,
                expandedCBasicPracticalSet,
                "c-basic",
              )}
              {renderPredefinedQuestionBox(
                "C Logical Array",
                activeCLogicalTab,
                setActiveCLogicalTab,
                cLogicalArraySets.theory,
                cLogicalArraySets.practical,
                selectedCLogicalTheorySet,
                setSelectedCLogicalTheorySet,
                selectedCLogicalPracticalSet,
                setSelectedCLogicalPracticalSet,
                expandedCLogicalTheorySet,
                expandedCLogicalPracticalSet,
                "c-logical",
              )}
              {renderPredefinedQuestionBox(
                "Java OOPs",
                activeJavaTab,
                setActiveJavaTab,
                javaSets.theory,
                javaSets.practical,
                selectedJavaTheorySet,
                setSelectedJavaTheorySet,
                selectedJavaPracticalSet,
                setSelectedJavaPracticalSet,
                expandedJavaTheorySet,
                expandedJavaPracticalSet,
                "java",
              )}
            </>
          )}
        </div>
      )}

      {/* Start Review Button */}
      <div className="w-full flex justify-end">
        <Button
          onClick={handleStartReview}
          className="px-8 py-3 bg-[#333333] hover:bg-[#444444] text-gray-200 font-semibold rounded-md shadow-md transition-colors duration-200"
          disabled={isStartReviewDisabled}
        >
          START REVIEW
        </Button>
      </div>
    </div>
  )
}
