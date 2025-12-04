import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'danger'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

export default function Button({ children, className = '', variant = 'primary', onClick, type = 'button' }: Props) {
  const classes = `inline-flex items-center justify-center px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[variant]} ${className}`
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
