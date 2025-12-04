import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import Button from './Button'
import { getRolesFromToken } from '../utils/auth'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
  const roles = token ? getRolesFromToken(token) : []
  const isAdmin = roles.includes('Admin')

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('userEmail')
      // reload to reset axios defaults and UI
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <NavLink to="/" className="text-xl font-bold text-blue-600">MovingApp</NavLink>
              <nav className="hidden sm:flex space-x-3">
                <NavLink to="/" className={({isActive}) => isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}>Customers</NavLink>
                <NavLink to="/admin" className={({isActive}) => isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}>Admin</NavLink>
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              {token ? (
                <div className="flex items-center space-x-3">
                  {userEmail && <div className="text-sm text-gray-700 hidden sm:block">{userEmail}</div>}
                  {isAdmin && <Link to="/admin" className="px-3 py-1 text-sm bg-gray-100 rounded">Dashboard</Link>}
                  <Button variant="secondary" onClick={logout}>Logout</Button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600">Login</Link>
                  <Link to="/register" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
