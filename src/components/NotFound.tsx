"use client"

import { useNavigate } from "react-router-dom"
import { Home, ArrowLeft, AlertTriangle } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full border border-gray-700">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <div className="w-16 h-1 bg-red-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-3">Page Not Found</h2>
          <p className="text-gray-400 leading-relaxed">
            The page you are looking for doesn't exist or has been moved. Please check the URL or navigate back to the
            homepage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-600 text-sm">Error Code: 404 | Route does not exist</p>
        </div>
      </div>
    </div>
  )
}
