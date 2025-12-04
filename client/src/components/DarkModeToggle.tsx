import React, { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('theme')
      if (v) return v === 'dark'
      return false
    } catch {
      return false
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
      aria-pressed={dark}
      title={dark ? 'Disable dark mode' : 'Enable dark mode'}
    >
      {dark ? '🌙' : '☀️'}
    </button>
  )
}
