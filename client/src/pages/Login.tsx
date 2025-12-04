import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import Button from '../components/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      const token = res.data?.token
      if (token) {
        localStorage.setItem('token', token)
        // store email for display in header
        localStorage.setItem('userEmail', email)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        navigate('/admin')
      }
    } catch (err: any) {
      setError('Login failed')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <form onSubmit={submit}>
          <FormField label="Email" value={email} onChange={setEmail} placeholder="you@domain.com" />
          <FormField label="Password" value={password} onChange={setPassword} type="password" />
          <div className="mt-6">
            <Button type="submit" className="w-full">Login</Button>
          </div>
        </form>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  )
}
