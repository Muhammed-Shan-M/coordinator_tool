import { configureStore } from "@reduxjs/toolkit"
import reviewReducer from "./slice/qustions"

export const store = configureStore({
    reducer: {
        review: reviewReducer
    }
})


export type Rootstate = ReturnType<typeof store.getState>
export type AppDispach = typeof store.dispatch

