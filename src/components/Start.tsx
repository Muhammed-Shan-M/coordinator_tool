"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
// import { predefinedQuestionSets, predefinedPracticalQuestionSets } from "../util/predefined"
import { useDispatch } from "react-redux"
import type { AppDispach } from "@/redux/Store"
import { useNavigate } from "react-router-dom"
import { validateQuestions, extractQustions, convertFirestorePresets, extractTextAndLinks, fecthDoc } from "@/util/utility"
import type { ReviewState, Errors, Presets, QuestionSet, PresetsByWeek, Question, FecthDocType, NormalWeekData } from "@/util/type"
import { setReviewState } from "@/redux/slice/qustions"
import RenderPredefinedQuestionBox from "./utility/start-utility/renderPredefinedQuestionBox"
import RenderCustomQuestionBox from "./utility/start-utility/renderCustomQuestionBox"
import { addItem, getPresets } from "@/firebase/firebaseService"
import { toast } from "react-toastify"



export default function ReviewSetup() {
  const dispatch = useDispatch<AppDispach>()
  const navigate = useNavigate()

  const [isGDLink, setIsGDLink] = useState<boolean>(false)
  const [isGDLinkForCBasic,setIsGDLinkForCBasic] = useState<boolean>(false)
  const [isGDLinkForCLogic,setIsGDLinkForCLogic] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)

  const [studentName, setStudentName] = useState("")
  const [selectedWeek, setSelectedWeek] = useState("")
  const [questionMode, setQuestionMode] = useState("predefined") // 'predefined' or 'custom'

  const [predefinedTheoryQuestionSets, setPredefinedTheoryQuestionSets] = useState<QuestionSet[]>([])
  const [predefinedPracticalQuestionSets, setpredefinedPracticalQuestionSets] = useState<QuestionSet[]>([])
  const [presetsData, setPresetsData] = useState<PresetsByWeek>({
    week1: [],
    week2: [],
    week3: []
  })

  // State for Theory Questions
  // const [theoryQuestionType, setTheoryQuestionType] = useState("predefined") // 'predefined' or 'custom'
  const [customTheoryQuestions, setCustomTheoryQuestions] = useState("")
  const [selectedPredefinedTheorySet, setSelectedPredefinedTheorySet] = useState("")

  // State for Practical Questions
  // const [practicalQuestionType, setPracticalQuestionType] = useState("predefined") // 'predefined' or 'custom'
  const [customPracticalQuestions, setCustomPracticalQuestions] = useState("")
  const [selectedPredefinedPracticalSet, setSelectedPredefinedPracticalSet] = useState("")


  //presets
  const [cBasicPatternSets,  setcBasicPatternSets] = useState<Presets>({ practical: [], theory: [] })
  const [cLogicalArraySets, setcLogicalArraySets] = useState<Presets>({ practical: [], theory: [] })
  const [javaSets, setjavaSets] = useState<Presets>({ practical: [], theory: [] })


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
  const [errors, setErrors] = useState<Errors>({
    cBasicTheory: '',
    cBasicPractical: '',
    cLogicalTheory: '',
    cLogicalPractical: '',
    javaTheory: '',
    javaPractical: ''
  })

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

      if (type === "theory") {
        setExpandedTheorySet(expandedTheorySet === setId ? "" : setId)
      } else {
        setExpandedPracticalSet(expandedPracticalSet === setId ? "" : setId)
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPresets()

      setPresetsData(data)
      setcBasicPatternSets(convertFirestorePresets(data.week1))
      setcLogicalArraySets(convertFirestorePresets(data.week2))
      setjavaSets(convertFirestorePresets(data.week3))
    }

    fetchData()

  }, [])


  useEffect(() => {

    if (selectedWeek === 'week-1') {
      setpredefinedPracticalQuestionSets(cBasicPatternSets.practical)
      setPredefinedTheoryQuestionSets(cBasicPatternSets.theory)
    } else if (selectedWeek === 'week-2') {
      setpredefinedPracticalQuestionSets(cLogicalArraySets.practical)
      setPredefinedTheoryQuestionSets(cLogicalArraySets.theory)
    } else if (selectedWeek === 'week-3') {
      setpredefinedPracticalQuestionSets(javaSets.practical)
      setPredefinedTheoryQuestionSets(javaSets.theory)
    } else {
      setpredefinedPracticalQuestionSets([])
      setPredefinedTheoryQuestionSets([])
    }

    console.log('from useEffect : ',cBasicPatternSets)

  }, [cBasicPatternSets, cLogicalArraySets, javaSets, selectedWeek])





  async function isGDLinkQuestion(input: string,isGDLink: boolean, presets: QuestionSet[]) {
    if(isGDLink){
      return await fecthDoc(input) 
    }else{
      return await extractQustions(input, (questionMode !== "custom"), presets)
    }
  }




  const handleStartReview = async () => {

    const isPresets = (questionMode !== "custom")
    setLoading(true)

    if (selectedWeek === "week-4") {
      // Week-4: Compilation

      // Choose input sets depending on mode
      const cBasicTheoryInput = questionMode === "custom" ? customCBasicTheoryQuestions : selectedCBasicTheorySet
      const cBasicPracticalInput = questionMode === "custom" ? customCBasicPracticalQuestions : selectedCBasicPracticalSet

      const cLogicalTheoryInput = questionMode === "custom" ? customCLogicalTheoryQuestions : selectedCLogicalTheorySet
      const cLogicalPracticalInput = questionMode === "custom" ? customCLogicalPracticalQuestions : selectedCLogicalPracticalSet

      const javaTheoryInput = questionMode === "custom" ? customJavaTheoryQuestions : selectedJavaTheorySet
      const javaPracticalInput = questionMode === "custom" ? customJavaPracticalQuestions : selectedJavaPracticalSet

      // ✅ validate separately
      const errors: Errors = {
        cBasicTheory: validateQuestions(cBasicTheoryInput, isPresets),
        cBasicPractical: isGDLinkForCBasic ? "" : validateQuestions(cBasicPracticalInput, isPresets),
        cLogicalTheory: validateQuestions(cLogicalTheoryInput, isPresets),
        cLogicalPractical: isGDLinkForCLogic? "" : validateQuestions(cLogicalPracticalInput, isPresets),
        javaTheory: validateQuestions(javaTheoryInput, isPresets),
        javaPractical: validateQuestions(javaPracticalInput, isPresets),
      }


      setErrors(errors)

      const fieldNames: Record<string, string> = {
        cBasicTheory: "C Basic Theory",
        cBasicPractical: "C Basic Practical",
        cLogicalTheory: "C Logical Theory",
        cLogicalPractical: "C Logical Practical",
        javaTheory: "Java Theory",
        javaPractical: "Java Practical",
      };


      const firstErrorEntry = Object.entries(errors).find(([_key, value]) => value);

      if (firstErrorEntry) {
        const [field, message] = firstErrorEntry;
        const displayName = fieldNames[field] || field;
        toast.error(`Something wrong in ${displayName}: ${message}`);
        setLoading(false)
        return
      }


      const questions = {
        week1T: await extractQustions(cBasicTheoryInput, isPresets, cBasicPatternSets.theory),
        week1P: await isGDLinkQuestion(cBasicPracticalInput,isGDLinkForCBasic,cBasicPatternSets.practical) as FecthDocType | Question[],
        week2T: await extractQustions(cLogicalTheoryInput, isPresets, cLogicalArraySets.theory),
        week2P: await isGDLinkQuestion(cLogicalPracticalInput,isGDLinkForCLogic,cLogicalArraySets.practical) as FecthDocType | Question[],
        week3T: await extractQustions(javaTheoryInput, isPresets, javaSets.theory),
        week3P: await extractQustions(javaPracticalInput, isPresets, javaSets.practical),
      }

      
      if(isGDLinkForCBasic && 'error' in questions.week1P){
        if(questions.week1P.error){
          setErrors({...errors,cBasicPractical :questions.week1P.error})
          const displayName = fieldNames['cBasicPractical']
          toast.error(`Something wrong in ${displayName}: ${questions.week1P.error}`)
          setLoading(false)
          return
        }else{          
          questions.week1P = questions.week1P.questions
        }
      }
      
      if(isGDLinkForCLogic && 'error' in questions.week2P){
        if(questions.week2P.error){
          setErrors({...errors,cLogicalPractical: questions.week2P.error})
          const displayName = fieldNames['cLogicalPractical']
          toast.error(`Something wrong in ${displayName}: ${questions.week2P.error}`)
          setLoading(false)
          return
        }else{
          questions.week2P = questions.week2P.questions 
        }
      }

      const reviewState: ReviewState = {
        studentName,
        selectedWeek,
        questions: {
          "week-1": {
            theory: questions.week1T,
            practical: questions.week1P as Question[],
          },
          "week-2": {
            theory: questions.week2T,
            practical: questions.week2P as Question[],
          },
          "week-3": {
            theory: questions.week3T,
            practical: questions.week3P,
          },
        },
      }


      console.log(reviewState)
      dispatch(setReviewState(reviewState))
      navigate("/review")

      // if (questionMode === 'custom') {
      //   addItem(questions, 'week-4', presetsData)
      // }

    } else {
      // Normal week (1–3)
      const theoryInput =
        questionMode === "custom" ? customTheoryQuestions : selectedPredefinedTheorySet
      const practicalInput =
        questionMode === "custom" ? customPracticalQuestions : selectedPredefinedPracticalSet

      const theoryError = validateQuestions(theoryInput, isPresets)
      const practicalErr = isGDLink ? '' : validateQuestions(practicalInput, isPresets)

      setTheoryError(theoryError)
      setPracticalError(practicalErr)


      if (theoryError) {
        toast.error(theoryError)
        setLoading(false)
        return
      } else if (practicalErr) {
        toast.error(practicalErr)
        setLoading(false)
        return
      }


      const questions:NormalWeekData = {
        T: await extractQustions(theoryInput, isPresets, predefinedTheoryQuestionSets),
        P: []
      }

      const rawP = await isGDLinkQuestion(practicalInput,isGDLink,predefinedPracticalQuestionSets) as FecthDocType | Question[]


      if (isGDLink && 'error' in rawP) {
        if (rawP.error) {
          setPracticalError(rawP.error)
          toast.error(rawP.error)
          setLoading(false)
          return
        } else {
          questions.P = rawP.questions
        }
      }else {
        questions.P = rawP as Question[]
      }

      questions.P = questions.P as Question[]; 

      const reviewState: ReviewState = {
        studentName,
        selectedWeek,
        questions: {
          theory: questions.T,
          practical: questions.P
        },
      }

      dispatch(setReviewState(reviewState))
      navigate("/review")

      if (questionMode === 'custom') {
        addItem(questions, selectedWeek, presetsData)
      }
    }

    setLoading(false)


  }

  console.log();
  
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
          {questionMode === "custom" ? (
            < RenderCustomQuestionBox
              title={"Select Question"}
              activeTab={activeCustomTab}
              setActiveTab={setActiveCustomTab}
              theoryValue={customTheoryQuestions}
              setTheoryValue={setCustomTheoryQuestions}
              practicalValue={customPracticalQuestions}
              setPracticalValue={setCustomPracticalQuestions}
              theoryError={theoryError}
              practicalError={practicalError}
              setIsGDLink={setIsGDLink}
              isGDLink={isGDLink}
              week={selectedWeek}
            />

          ) : (
            <RenderPredefinedQuestionBox
              title={'Select Question'}
              activeTab={activePredefinedTab}
              setActiveTab={setActivePredefinedTab}
              theorySets={predefinedTheoryQuestionSets}
              practicalSets={predefinedPracticalQuestionSets}
              selectedTheorySet={selectedPredefinedTheorySet}
              setSelectedTheorySet={setSelectedPredefinedTheorySet}
              selectedPracticalSet={selectedPredefinedPracticalSet}
              setSelectedPracticalSet={setSelectedPredefinedPracticalSet}
              expandedTheorySet={expandedTheorySet}
              expandedPracticalSet={expandedPracticalSet}
              toggleSetExpansion={toggleSetExpansion}
            />
          )}
        </div>
      )}

      {/* Week 4 Special Layout */}
      {selectedWeek === "week-4" && (
        <div className="space-y-6 w-full mb-6">
          {questionMode === "custom" ? (
            <>
              <RenderCustomQuestionBox
                title={"C Basic Patterns"}
                activeTab={activeCBasicTab}
                setActiveTab={setActiveCBasicTab}
                theoryValue={customCBasicTheoryQuestions}
                setTheoryValue={setCustomCBasicTheoryQuestions}
                practicalValue={customCBasicPracticalQuestions}
                setPracticalValue={setCustomCBasicPracticalQuestions}
                theoryError={errors.cBasicTheory}
                practicalError={errors.cBasicPractical}
                setIsGDLink={setIsGDLinkForCBasic}
                isGDLink={isGDLinkForCBasic}
                week={selectedWeek}
              />

              <RenderCustomQuestionBox
                title={"C Logical Array"}
                activeTab={activeCLogicalTab}
                setActiveTab={setActiveCLogicalTab}
                theoryValue={customCLogicalTheoryQuestions}
                setTheoryValue={setCustomCLogicalTheoryQuestions}
                practicalValue={customCLogicalPracticalQuestions}
                setPracticalValue={setCustomCLogicalPracticalQuestions}
                theoryError={errors.cLogicalTheory}
                practicalError={errors.cLogicalPractical}
                setIsGDLink={setIsGDLinkForCLogic}
                isGDLink={isGDLinkForCLogic}
                week={selectedWeek}
              />


              <RenderCustomQuestionBox
                title={"Java OOPs"}
                activeTab={activeJavaTab}
                setActiveTab={setActiveJavaTab}
                theoryValue={customJavaTheoryQuestions}
                setTheoryValue={setCustomJavaTheoryQuestions}
                practicalValue={customJavaPracticalQuestions}
                setPracticalValue={setCustomJavaPracticalQuestions}
                theoryError={errors.javaTheory}
                practicalError={errors.javaPractical}
                setIsGDLink={setIsGDLink}
                isGDLink={isGDLink}
                week={selectedWeek}
              />

            </>
          ) : (
            <>
              <RenderPredefinedQuestionBox
                title={"C Basic Patterns"}
                activeTab={activeCBasicTab}
                setActiveTab={setActiveCBasicTab}
                theorySets={cBasicPatternSets.theory}
                practicalSets={cBasicPatternSets.practical}
                selectedTheorySet={selectedCBasicTheorySet}
                setSelectedTheorySet={setSelectedCBasicTheorySet}
                selectedPracticalSet={selectedCBasicPracticalSet}
                setSelectedPracticalSet={setSelectedCBasicPracticalSet}
                expandedTheorySet={expandedCBasicTheorySet}
                expandedPracticalSet={expandedCBasicPracticalSet}
                toggleSetExpansion={toggleSetExpansion}
                category={'c-basic'}
              />

              <RenderPredefinedQuestionBox
                title={"C Logical Array"}
                activeTab={activeCLogicalTab}
                setActiveTab={setActiveCLogicalTab}
                theorySets={cLogicalArraySets.theory}
                practicalSets={cLogicalArraySets.practical}
                selectedTheorySet={selectedCLogicalTheorySet}
                setSelectedTheorySet={setSelectedCLogicalTheorySet}
                selectedPracticalSet={selectedCLogicalPracticalSet}
                setSelectedPracticalSet={setSelectedCLogicalPracticalSet}
                expandedTheorySet={expandedCLogicalTheorySet}
                expandedPracticalSet={expandedCLogicalPracticalSet}
                toggleSetExpansion={toggleSetExpansion}
                category={"c-logical"}
              />

              <RenderPredefinedQuestionBox
                title={"Java OOPs"}
                activeTab={activeJavaTab}
                setActiveTab={setActiveJavaTab}
                theorySets={javaSets.theory}
                practicalSets={javaSets.practical}
                selectedTheorySet={selectedJavaTheorySet}
                setSelectedTheorySet={setSelectedJavaTheorySet}
                selectedPracticalSet={selectedJavaPracticalSet}
                setSelectedPracticalSet={setSelectedJavaPracticalSet}
                expandedTheorySet={expandedJavaTheorySet}
                expandedPracticalSet={expandedJavaPracticalSet}
                toggleSetExpansion={toggleSetExpansion}
                category={"java"}
              />
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
          {loading ? 'LOADING...' : "START REVIEW"}
        </Button>
      </div>
    </div>
  )
}
