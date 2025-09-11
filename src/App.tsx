// import React from 'react'
import Start from './components/Start'
import ReviewDisplay from './components/ReviewDisplay'
import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
     <div className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      <Routes>
        <Route path='/' element={<Start/>} />
        <Route path='/review' element={<ReviewDisplay/>} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} theme="dark"  />
    </div>
  )
}

export default App
