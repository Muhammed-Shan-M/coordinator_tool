import Start from './components/Start'
import ReviewDisplay from './components/ReviewDisplay'
import NotFound from './components/NotFound';
import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
     <>
      <Routes>
        <Route path='/' element={<Start/>} />
        <Route path='/review' element={<ReviewDisplay/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} theme="dark"  />
    </>
  )
}

export default App
