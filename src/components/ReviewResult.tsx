"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react" // Import Star icon
import { Rootstate } from "@/redux/Store"
import { setReviewState, resetReviewState } from "@/redux/slice/qustions"
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom"
import { findTotalMark, findTotalRating } from "@/util/utility"

export default function ReviewSummary() {
  // const allQustions = useSelector((state: Rootstate) => state.review.theoryQuestion)
  const reviewState = useSelector((state: Rootstate) => state.review)

  //for answered questions
  const theoryansweredQuestions = reviewState.theoryQuestion.filter((qustion) => qustion.answered === true)
  const totalTheoryAnsweredMark = findTotalMark(theoryansweredQuestions)
  const totalTheoryAnsweredRating = findTotalRating(totalTheoryAnsweredMark)

  //for practical answered
  const practicalQuestionsAnswered = reviewState.practicalQuestion.filter((question) => question.answered === true)
  const totalPracticalMark = findTotalMark(practicalQuestionsAnswered)
  const totalPracticalRating = findTotalRating(totalPracticalMark)

  // console.log('hello', totalPracticalMark, totalPracticalRating)

  // for not answered theory
  const initialTheoryNotAnsweredQuestions = reviewState.theoryQuestion.filter((qustion) => qustion.notanswered === true).map((question) => question.text).join("\n")
  const [theoryNotAnsweredQuestionsText, setTheoryNotAnsweredQuestionsText] = useState(
    initialTheoryNotAnsweredQuestions,
  )

  // Dummy data for not answered practical questions (max 4 for demo)
  const initialPracticalNotAnsweredQuestions = reviewState.practicalQuestion.filter((question) => question.notanswered === true).map((question) => question.text).join('\n')
  const [practicalNotAnsweredQuestionsText, setPracticalNotAnsweredQuestionsText] = useState(
    initialPracticalNotAnsweredQuestions,
  )


 const [practicalMarks, setPracticalMarks] = useState(
  typeof totalPracticalMark === 'number' && !isNaN(totalPracticalMark)
    ? totalPracticalMark.toString()
    : ''
);

const [theoryMarks, setTheoryMarks] = useState(
  typeof totalTheoryAnsweredMark === 'number' && !isNaN(totalTheoryAnsweredMark)
    ? totalTheoryAnsweredMark.toString()
    : ''
);
  const [feedbackText, setFeedbackText] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    setTheoryNotAnsweredQuestionsText(initialTheoryNotAnsweredQuestions)
  }, [initialTheoryNotAnsweredQuestions])

  useEffect(() => {
    setPracticalNotAnsweredQuestionsText(initialPracticalNotAnsweredQuestions)
  }, [initialPracticalNotAnsweredQuestions])

  const handleNextReview = () => {
    Swal.fire({
      title: 'Confirm Action',
      text: 'Have you copied the current pending questions and marks? Once you proceed, this data will be cleared and cannot be recovered.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, continue',
      cancelButtonText: 'Cancel',
      background: '#1a1a1a',
      color: '#ffffff',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        const clearedTheoryQuestions = reviewState.theoryQuestion.map((question) => ({
          ...question,
          answered: false,
          notanswered: false,
          performance: null,
        }));

        const clearedPracticalQuestions = reviewState.practicalQuestion.map((question) => ({
          ...question,
          answered: false,
          notanswered: false,
          performance: null,
        }));


        const updatedReviewState = {
          ...reviewState,
          theoryQuestion: clearedTheoryQuestions,
          practicalQuestion: clearedPracticalQuestions
        };

        dispatch(setReviewState(updatedReviewState))
      }
    });


  }

  const handleGoHome = () => {
    Swal.fire({
      title: 'Return to Home?',
      text: 'Are you sure you want to return to the home page? This action will permanently delete all current data, including the question set.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go to Home',
      cancelButtonText: 'Cancel',
      background: '#1a1a1a',
      color: '#ffffff',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(resetReviewState());
        navigate('/');
      }
    });

  }

  const handleCopyToClipboard = () => {
    if (theoryMarks === '' && practicalMarks === '') {
      alert('Please enter both theory and practical marks.');
      return
    } else if (theoryMarks === '') {
      alert('Please enter the theory marks.');
      return
    } else if (practicalMarks === '') {
      alert('Please enter the practical marks.');
      return
    }

    navigator.clipboard.writeText(
      `Theory:\n${theoryNotAnsweredQuestionsText}\n\n` +
      `Practical:\n${practicalNotAnsweredQuestionsText}\n\n\n` +
      (feedbackText ? `Feedback: ${feedbackText}\n\n\n` : '') +
      `P: ${practicalMarks}\n` +
      `T: ${theoryMarks}\n`,
    )
    alert("Review summary copied to clipboard!")
  }

  return (
    <div className="mt-12 flex flex-col items-center justify-center w-full max-w-7xl mx-auto relative">
      {/* Top Section: Answered Theory Questions with Ratings */}
      <div className="w-full bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-6 border-b border-[#333333] pb-4">
          <h2 className="text-2xl font-bold text-gray-100">Answered Theory Questions with Ratings</h2>
          {theoryansweredQuestions.length > 0 &&
            <div className="flex items-center gap-2 text-gray-200">
              <span className="text-lg font-semibold">Total Mark: {totalTheoryAnsweredMark}</span>
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={`total-ans-${i}`}
                  className={`w-5 h-5 ${i < Math.round(totalTheoryAnsweredRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                />
              ))}
            </div>
          }
        </div>
        <div className="h-[350px] overflow-y-auto pr-2">
          <div className="space-y-4">
            {theoryansweredQuestions.length > 0 ? (
              theoryansweredQuestions.map((question) => (
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

      {/* Middle Section: Practical Questions An */}
      <div className="w-full bg-[#222222] border border-[#333333] rounded-lg p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-6 border-b border-[#333333] pb-4">
          <h2 className="text-2xl font-bold text-gray-100">Answered Theory Questions with Ratings</h2>
          {practicalQuestionsAnswered.length > 0 &&
            <div className="flex items-center gap-2 text-gray-200">
              <span className="text-lg font-semibold">Total Mark: {totalPracticalMark}</span>
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={`total-prac-${i}`}
                  className={`w-5 h-5 ${i < Math.round(totalPracticalRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                />
              ))}
            </div>
          }
        </div>
        <div className="h-[150px] overflow-y-auto pr-2">
          <div className="space-y-3">
            {practicalQuestionsAnswered.length > 0 ? (
              practicalQuestionsAnswered.map((question) => (
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
              {" "}
              {/* Smaller height for practical questions */}
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
              {" "}
              {/* Increased height for more space */}
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
            <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-[#333333] pb-4">Mark Updation</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="practical-marks" className="text-gray-200">
                  Practical Marks
                </Label>
                <Input
                  id="practical-marks"
                  placeholder="Enter practical marks"
                  value={practicalMarks}
                  onChange={(e) => setPracticalMarks(e.target.value)}
                  className="bg-[#222222] border-[#333333] text-gray-200 placeholder:text-gray-500 focus:ring-offset-[#1A1A1A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theory-marks" className="text-gray-200">
                  Theory Marks
                </Label>
                <Input
                  id="theory-marks"
                  placeholder="Enter theory marks"
                  value={theoryMarks}
                  onChange={(e) => setTheoryMarks(e.target.value)}
                  className="bg-[#222222] border-[#333333] text-gray-200 placeholder:text-gray-500 focus:ring-offset-[#1A1A1A]"
                />
              </div>
            </div>
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
