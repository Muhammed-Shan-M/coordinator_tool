import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit"
import { SetAnsweredPayload,CommenPayload } from "./../../util/type";

import { ReviewState } from "./../../util/type";

const initialState: ReviewState = {
    studentName: '',
    selectedWeek: '',
    practicalQuestion: [],
    theoryQuestion: [],
}

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        setReviewState: (state, action: PayloadAction<ReviewState>) => {
            return action.payload
        },
        resetReviewState: () => initialState,
        setAnswered: (state, action: PayloadAction<SetAnsweredPayload>) => {
            const { id, performance, qustionType } = action.payload

            let qusiton
            if(qustionType === 'theory'){
                qusiton = state.theoryQuestion.find(item => item.id === id)
            }else{
                qusiton = state.practicalQuestion.find(item => item.id === id)
            }


            if (qusiton) {
                qusiton.answered = true
                qusiton.notanswered = false
                qusiton.performance = performance
            }
        },
        setNotAnswered: (state, action: PayloadAction<CommenPayload>) => {
            const {id,qustionType} = action.payload

            let question
            if(qustionType === 'theory'){
                question = state.theoryQuestion.find(item => item.id === id)
            }else{
                question = state.practicalQuestion.find(item => item.id === id)
            }

            if (question) {
                question.notanswered = true
                question.answered = false
                question.performance = null
            }
        },
        removeAnswered: (state, action: PayloadAction<CommenPayload>) => {
            const {id,qustionType} = action.payload

            let question
            if(qustionType === 'theory'){
                question = state.theoryQuestion.find(item => item.id === id)
            }else{
                question = state.practicalQuestion.find(item => item.id === id)
            }

            if (question) {
                question.answered = false
                question.performance = null
            }
        },
        removeNotAnswered: (state, action: PayloadAction<CommenPayload>) => {
            const {id,qustionType} = action.payload

            let question
            if(qustionType === 'theory'){
                question = state.theoryQuestion.find(item => item.id === id)
            }else{
                question = state.practicalQuestion.find(item => item.id === id)
            }

            if (question) {
                question.notanswered = false
            }
        }
    }
})


export const { setReviewState, resetReviewState, setAnswered, setNotAnswered, removeAnswered, removeNotAnswered } = reviewSlice.actions
export default reviewSlice.reducer