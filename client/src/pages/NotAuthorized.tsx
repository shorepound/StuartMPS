import React from 'react'
import { Link } from 'react-router-dom'

export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow max-w-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Not authorized</h1>
        <p className="mb-6">You do not have permission to view this page.</p>
        <div className="space-x-2">
          <Link to="/" className="text-sm text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/login" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Login</Link>
        </div>
      </div>
    </div>
  )
}
