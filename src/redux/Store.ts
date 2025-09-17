import { configureStore,combineReducers } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import reviewReducer from "./slice/qustions"


const persistConfig = {
    key: 'root',
    storage,
    whitelist:['review']
}

const rootReducer = combineReducers({
    review:reviewReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
})

export const persistor = persistStore(store)

export type Rootstate = ReturnType<typeof store.getState>
export type AppDispach = typeof store.dispatch

