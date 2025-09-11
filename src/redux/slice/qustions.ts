import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit"
import { SetAnsweredPayload, CommenPayload } from "./../../util/type";
import { handleUpdate } from "@/util/utility";
import { ReviewState } from "./../../util/type";

const initialState: ReviewState = {
    studentName: '',
    selectedWeek: '',
    questions: { practical: [], theory: [] }
}

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        setReviewState: (_state, action: PayloadAction<ReviewState>) => {
            return action.payload
        },
        resetReviewState: () => initialState,
        setAnswered: (state, action: PayloadAction<SetAnsweredPayload>) => {
 
           handleUpdate(state, action, "answered", action.payload.performance)

        },
        setNotAnswered: (state, action: PayloadAction<CommenPayload>) => {

           handleUpdate(state, action, "not-answered", null)

        },
        removeAnswered: (state, action: PayloadAction<CommenPayload>) => {

             handleUpdate(state, action, "remove-answered", null)

        },
        removeNotAnswered: (state, action: PayloadAction<CommenPayload>) => {
            
            handleUpdate(state, action, "remove-notanswered", null)

        }
    }
})


export const { setReviewState, resetReviewState, setAnswered, setNotAnswered, removeAnswered, removeNotAnswered } = reviewSlice.actions
export default reviewSlice.reducer