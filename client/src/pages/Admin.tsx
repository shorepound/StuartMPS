import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../components/Button'

type Customer = {
  customerId: number
  firstName: string
  lastName: string
  email?: string
  phone?: string
}

export default function Admin() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    let mounted = true
    const token = localStorage.getItem('token')
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    axios
      .get<Customer[]>('/api/customers')
      .then((res) => mounted && setCustomers(res.data))
      .catch((err) => console.error('Admin fetch failed', err))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  const create = async () => {
    try {
      const res = await axios.post('/api/customers', { firstName, lastName })
      setCustomers((s) => [...s, res.data])
      setFirstName('')
      setLastName('')
    } catch (err) {
      console.error('Create failed', err)
      alert('Create failed (are you admin?)')
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete customer?')) return
    try {
      await axios.delete(`/api/customers/${id}`)
      setCustomers((s) => s.filter((c) => c.customerId !== id))
    } catch (err) {
      console.error('Delete failed', err)
      alert('Delete failed')
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Admin — Customers</h1>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div>
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">First</label>
                <input placeholder="First" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last</label>
                <input placeholder="Last" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="flex items-end">
                <Button onClick={create}>Create</Button>
              </div>
            </div>
            {customers.length === 0 ? (
              <p>No customers found.</p>
            ) : (
              <ul className="space-y-2">
                {customers.map((c) => (
                  <li key={c.customerId} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{c.firstName} {c.lastName}</div>
                      <div className="text-sm text-gray-600">{c.email}</div>
                    </div>
                    <div>
                      <Button variant="danger" onClick={() => remove(c.customerId)}>Delete</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
