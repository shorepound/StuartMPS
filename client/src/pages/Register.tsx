import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import Button from '../components/Button'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/auth/register', { email, password })
      setMessage('Registration successful — please login')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setMessage('Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6">Register</h1>
        <form onSubmit={submit}>
          <FormField label="Email" value={email} onChange={setEmail} placeholder="you@domain.com" />
          <FormField label="Password" value={password} onChange={setPassword} type="password" />
          <div className="mt-6">
            <Button type="submit" className="w-full" variant="primary">Register</Button>
          </div>
        </form>
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  )
}
