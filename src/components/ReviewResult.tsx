"use client"

import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import type { Rootstate } from "@/redux/Store"
import { setReviewState, resetReviewState } from "@/redux/slice/qustions"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { findAnsweredQuestions, findMarks, findTotalMark, findTotalRating, getWeek4ClipboardText } from "@/util/utility"
import { CompilationWeekQuestions, NormalWeekMarks, NormalWeekQuestions, Question, ReviewState, Segment, Week4Marks, WeekName } from "@/util/type"
import { toast } from "react-toastify"


export default function ReviewSummary({ resetStates }: { resetStates: () => void }) {

  const reviewState = useSelector((state: Rootstate) => state.review)

  const currentWeek = reviewState.selectedWeek
  const isWeek4 = currentWeek === 'week-4'



  const segments:Segment[] = [
    { key: "week-1", label: "C Basic Pattern (Week 1)" },
    { key: "week-2", label: "C Logic Array (Week 2)"},
    { key: "week-3", label: "Java OOPS (Week 3)" },
  ] as const

  const [selectedSegment, setSelectedSegment] = useState<WeekName>("week-1")



  const theoryansweredQuestions = useMemo(
    () => {
      return findAnsweredQuestions(isWeek4,reviewState,selectedSegment,'theory')
    },
    [reviewState.questions, isWeek4, selectedSegment],
  )
  const totalTheoryAnsweredMark = findTotalMark(theoryansweredQuestions.questions,theoryansweredQuestions.totalQuestions)
  const totalTheoryAnsweredRating = findTotalRating(totalTheoryAnsweredMark)


  const practicalQuestionsAnswered = useMemo(
    () => {
      return findAnsweredQuestions(isWeek4, reviewState, selectedSegment, 'practical')
    },
    [reviewState.questions, isWeek4, selectedSegment]
  )
  const totalPracticalMark = findTotalMark(practicalQuestionsAnswered.questions,practicalQuestionsAnswered.totalQuestions)
  const totalPracticalRating = findTotalRating(totalPracticalMark)



  function getNotAnsweredQuestions(reviewState: ReviewState, type: 'practical' | 'theory'): string {

    if ('theory' in reviewState.questions) {
      const qs = reviewState.questions as NormalWeekQuestions;
      const notAnswered =
        type === 'practical'
          ? qs.practical.filter((q) => q.notanswered)
          : qs.theory.filter((q) => q.notanswered);
      return notAnswered.map((q) => q.text).join('\n');
    }

    else {
      const qs = reviewState.questions as CompilationWeekQuestions;


      const weekNameMap: Record<string, string> = {
        'week-1': 'C Basic Pattern',
        'week-2': 'C Logic Array',
        'week-3': 'Java OOPs',
      };

      return Object.entries(qs)
        .map(([weekKey, weekQuestions]) => {
          const notAnswered =
            type === 'practical'
              ? weekQuestions.practical.filter((q) => q.notanswered)
              : weekQuestions.theory.filter((q) => q.notanswered);

          if (notAnswered.length === 0) return ''; 


          const questionsText = notAnswered.map((q) => q.text).join('\n');
          const weekName = weekNameMap[weekKey] || weekKey; 
          return `${weekName}\n${questionsText}`;
        })
        .filter(Boolean) 
        .join('\n\n'); 
    }
  }


  const initialTheoryNotAnsweredQuestions = getNotAnsweredQuestions(reviewState, 'theory')
  const [theoryNotAnsweredQuestionsText, setTheoryNotAnsweredQuestionsText] = useState(
    initialTheoryNotAnsweredQuestions,
  )


  const initialPracticalNotAnsweredQuestions = getNotAnsweredQuestions(reviewState, 'practical')
  const [practicalNotAnsweredQuestionsText, setPracticalNotAnsweredQuestionsText] = useState(
    initialPracticalNotAnsweredQuestions,
  )

  const [practicalMarks, setPracticalMarks] = useState(
    typeof totalPracticalMark === "number" && !isNaN(totalPracticalMark) ? totalPracticalMark.toString() : "",
  )

  const [theoryMarks, setTheoryMarks] = useState(
    typeof totalTheoryAnsweredMark === "number" && !isNaN(totalTheoryAnsweredMark)
      ? totalTheoryAnsweredMark.toString()
      : "",
  )


  // Week 4 states
  const [week4Marks, setWeek4Marks] = useState<Week4Marks>({
    'week-1': { P: "", T: "" },
    'week-2': { P: "", T: "" },
    'week-3': { P: "", T: "" },
  });

  useEffect(() => {
    if(isWeek4){
      const marks =  findMarks(reviewState,isWeek4) as Week4Marks
      setWeek4Marks(marks)
    }else {
      const marks = findMarks(reviewState,isWeek4) as NormalWeekMarks
      setPracticalMarks(marks.P)
      setTheoryMarks(marks.T)
    }
  },[reviewState.questions, isWeek4])

  const handleWeek4Change = (subject: string, type: "P" | "T", value: string) => {
    setWeek4Marks((prev: any) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [type]: value,
      },
    }));
  };



  const [feedbackText, setFeedbackText] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()



  useEffect(() => {
    setPracticalNotAnsweredQuestionsText(initialPracticalNotAnsweredQuestions)
    setTheoryNotAnsweredQuestionsText(initialTheoryNotAnsweredQuestions)
  }, [reviewState])

  const handleNextReview = () => {
    Swal.fire({
      title: "Confirm Action",
      text: "Have you copied the current pending questions and marks? Once you proceed, this data will be cleared and cannot be recovered.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, continue",
      cancelButtonText: "Cancel",
      background: "#1a1a1a",
      color: "#ffffff",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {

        const resetQuestion = (q: Question): Question => ({
          ...q,
          answered: false,
          notanswered: false,
          performance: null,
        });

        let updatedReviewState

        if ("theory" in reviewState.questions) {

          const qs = reviewState.questions as NormalWeekQuestions
          const normal: NormalWeekQuestions = {
            theory: qs.theory.map(resetQuestion),
            practical: qs.practical.map(resetQuestion),
          }
          updatedReviewState = { ...reviewState, questions: normal };
        } else {

          const qs = reviewState.questions as CompilationWeekQuestions
          const compilation: CompilationWeekQuestions = Object.fromEntries(
            Object.entries(qs).map(([weekName, week]) => [
              weekName,
              {
                theory: week.theory.map(resetQuestion),
                practical: week.practical.map(resetQuestion),
              },
            ])
          );
          updatedReviewState = { ...reviewState, questions: compilation };
        }

        resetStates()
        dispatch(setReviewState(updatedReviewState))
      }
    })
  }

  const handleGoHome = () => {
    Swal.fire({
      title: "Return to Home?",
      text: "Are you sure you want to return to the home page? This action will permanently delete all current data, including the question set.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, go to Home",
      cancelButtonText: "Cancel",
      background: "#1a1a1a",
      color: "#ffffff",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(resetReviewState())
        navigate("/")
      }
    })
  }

  const handleCopyToClipboard = () => {
  if (isWeek4) {
    if (Object.values(week4Marks).some((item) => item.P === "" || item.T === "")) {
      toast.error("Please enter all theory and practical marks.")
      return;
    }

    const week4Questions = reviewState.questions as CompilationWeekQuestions

    const clipboardText = getWeek4ClipboardText(week4Marks, week4Questions, feedbackText);
    navigator.clipboard.writeText(clipboardText);
    toast.success("Review summary copied to clipboard!")
  } else {
    if (theoryMarks === "" && practicalMarks === "") {
      alert("Please enter both theory and practical marks.");
      return;
    } else if (theoryMarks === "") {
      alert("Please enter the theory marks.");
      return;
    } else if (practicalMarks === "") {
      alert("Please enter the practical marks.");
      return;
    }

    navigator.clipboard.writeText(
      `Theory:\n${theoryNotAnsweredQuestionsText}\n\n` +
      `Practical:\n${practicalNotAnsweredQuestionsText}\n\n\n` +
      (feedbackText ? `Feedback: ${feedbackText}\n\n\n` : "") +
      `P: ${practicalMarks}\n` +
      `T: ${theoryMarks}\n`,
    );

    toast.success("Review summary copied to clipboard!");
  }
};

  return (
    <div className="mt-3 flex flex-col items-center justify-center w-full max-w-7xl mx-auto relative">
      {isWeek4 && (
        <div className="w-full mb-4">
          <div className="flex flex-wrap gap-2">
            {segments.map((seg) => (
              <Button
                key={seg.key}
                onClick={() => setSelectedSegment(seg.key)}
                className={
                  selectedSegment === seg.key
                    ? "bg-[#333333] text-gray-100"
                    : "bg-[#1f1f1f] text-gray-300 hover:bg-[#2a2a2a]"
                }
              >
                {seg.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Top Section: Answered Theory Questions with Ratings */}
      <div id="answered-theory-sec" className="w-full bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-6 border-b border-[#333333] pb-4">
          <h2 className="text-2xl font-bold text-gray-100">Answered Theory Questions with Ratings</h2>
          {theoryansweredQuestions.questions.length > 0 && (
            <div className="flex items-center gap-2 text-gray-200">
              <span className="text-lg font-semibold">Total Mark: {totalTheoryAnsweredMark}</span>
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={`total-ans-${i}`}
                  className={`w-5 h-5 ${i < Math.round(totalTheoryAnsweredRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="h-[350px] overflow-y-auto pr-2">
          <div className="space-y-4">
            {theoryansweredQuestions.questions.length > 0 ? (
              theoryansweredQuestions.questions.map((question) => (
                <div
                  key={question.id}
                  className="bg-[#2A2A2A] p-4 rounded-md border border-[#333333] flex items-center justify-between"
                >
                  <p className="text-gray-200 flex-1 mr-4">{question.text}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < (question.performance ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-[350px]">
                <p className="text-gray-400 italic">No theory questions answered</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section: Practical Questions Answered */}
      <div className="w-full bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-6 border-b border-[#333333] pb-4">
          {/* Keeping original heading text as in your code */}
          <h2 className="text-2xl font-bold text-gray-100">Answered Practical Questions with Ratings</h2>
          {practicalQuestionsAnswered.questions.length > 0 && (
            <div className="flex items-center gap-2 text-gray-200">
              <span className="text-lg font-semibold">Total Mark: {totalPracticalMark}</span>
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={`total-prac-${i}`}
                  className={`w-5 h-5 ${i < Math.round(totalPracticalRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="h-[150px] overflow-y-auto pr-2">
          <div className="space-y-3">
            {practicalQuestionsAnswered.questions.length > 0 ? (
              practicalQuestionsAnswered.questions.map((question) => (
                <div
                  key={question.id}
                  className="bg-[#2A2A2A] p-3 rounded-md border border-[#333333] flex items-center justify-between"
                >
                  <p className="text-gray-200 flex-1 mr-4">{question.text}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (question.performance ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-[150px]">
                <p className="text-gray-400 italic">No practical questions answered</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Sections: Pendings, Feedback, Mark Updation */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left Column: Pendings (Theory & Practical Not Answered) */}
        <div className="flex-1 bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-100 border-b border-[#333333] pb-4">Pendings</h2>

          {/* Theory Not Answered Questions */}
          <div>
            <Label htmlFor="theory-not-answered-questions" className="text-gray-200 mb-2 block">
              Theory Questions
            </Label>
            <div className="h-[280px] overflow-y-auto pr-2">
              <Textarea
                id="theory-not-answered-questions"
                placeholder="List of not answered theory questions"
                value={theoryNotAnsweredQuestionsText}
                onChange={(e) => setTheoryNotAnsweredQuestionsText(e.target.value)}
                className="min-h-full bg-[#222222] border-[#333333] text-gray-200 placeholder:text-gray-500 focus:ring-offset-[#1A1A1A]"
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Edit this field to update the list of not answered theory questions.
            </p>
          </div>

          {/* Practical Not Answered Questions */}
          <div>
            <Label htmlFor="practical-not-answered-questions" className="text-gray-200 mb-2 block">
              Practical Questions
            </Label>
            <div className="h-[120px] overflow-y-auto pr-2">
              <Textarea
                id="practical-not-answered-questions"
                placeholder="List of not answered practical questions (max 1-4)"
                value={practicalNotAnsweredQuestionsText}
                onChange={(e) => setPracticalNotAnsweredQuestionsText(e.target.value)}
                className="min-h-full bg-[#222222] border-[#333333] text-gray-200 placeholder:text-gray-500 focus:ring-offset-[#1A1A1A]"
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Edit this field to update the list of not answered practical questions.
            </p>
          </div>
        </div>

        {/* Right Column: Feedback & Mark Updation */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Feedback Box */}
          <div className="bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-[#333333] pb-4">Feedback</h2>
            <div className="h-[250px] overflow-y-auto pr-2">
              <Textarea
                id="feedback"
                placeholder="Enter your feedback here..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-full bg-[#222222] border-[#333333] text-gray-200 placeholder:text-gray-500 focus:ring-offset-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Mark Updation Box */}
          <div className="bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-[#333333] pb-4">
              Mark Updation
            </h2>

            {!isWeek4 ? (
              <table className="w-full text-gray-200 border-collapse border border-[#333333]">
                <thead>
                  <tr>
                    <th className="border border-[#333333] p-2"></th>
                    <th className="border border-[#333333] p-2">Mark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-[#333333] p-2">P</td>
                    <td className="border border-[#333333] p-2">
                      <input
                        type="text"
                        value={practicalMarks}
                        onChange={(e) => setPracticalMarks(e.target.value)}
                        placeholder="Enter practical marks"
                        className="w-full bg-transparent text-gray-200 placeholder:text-gray-500 focus:outline-none selection:bg-[#444444] selection:text-gray-100"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-[#333333] p-2">T</td>
                    <td className="border border-[#333333] p-2">
                      <input
                        type="text"
                        value={theoryMarks}
                        onChange={(e) => setTheoryMarks(e.target.value)}
                        placeholder="Enter theory marks"
                        className="w-full bg-transparent text-gray-200 placeholder:text-gray-500 focus:outline-none selection:bg-[#444444] selection:text-gray-100"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="w-full text-gray-200 border-collapse border border-[#333333]">
                <thead>
                  <tr>
                    <th className="border border-[#333333] p-2"></th>
                    <th className="border border-[#333333] p-2">C Logic</th>
                    <th className="border border-[#333333] p-2">C Basic</th>
                    <th className="border border-[#333333] p-2">Java OOPs</th>
                  </tr>
                </thead>
                <tbody>
                  {["P", "T"].map((type) => (
                    <tr key={type}>
                      <td className="border border-[#333333] p-2">{type}</td>
                      {["week-1", "week-2", "week-3"].map((subject) => (
                        <td key={subject} className="border border-[#333333] p-2">
                          <input
                            type="text"
                            value={week4Marks[subject as keyof typeof week4Marks][type as "P" | "T"]}
                            onChange={(e) => handleWeek4Change(subject, type as "P" | "T", e.target.value)}
                            placeholder={`${type} marks`}
                            className="w-full bg-transparent text-gray-200 placeholder:text-gray-500 focus:outline-none selection:bg-[#444444] selection:text-gray-100"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>


        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="mt-6 lg:mt-10 w-full flex justify-end gap-4">
        <Button
          onClick={handleNextReview}
          className="px-6 py-3 bg-[#333333] hover:bg-[#444444] text-gray-200 font-semibold rounded-md shadow-md transition-colors duration-200"
        >
          NEXT REVIEW (SAME SET)
        </Button>
        <Button
          onClick={handleGoHome}
          className="px-6 py-3 bg-[#333333] hover:bg-[#444444] text-gray-200 font-semibold rounded-md shadow-md transition-colors duration-200"
        >
          GO TO HOME PAGE
        </Button>
        <Button
          onClick={handleCopyToClipboard}
          className="px-6 py-3 bg-[#333333] hover:bg-[#444444] text-gray-200 font-semibold rounded-md shadow-md transition-colors duration-200"
        >
          COPY TO CLIPBOARD
        </Button>
      </div>
    </div>
  )
}
