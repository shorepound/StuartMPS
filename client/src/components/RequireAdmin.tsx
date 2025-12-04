import React from 'react'
import { Navigate } from 'react-router-dom'
import { getRolesFromToken } from '../utils/auth'

type Props = { children: React.ReactNode }

export default function RequireAdmin({ children }: Props) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return <Navigate to="/login" replace />
  const roles = getRolesFromToken(token)
  if (!roles.includes('Admin')) return <Navigate to="/not-authorized" replace />
  return <>{children}</>
}
