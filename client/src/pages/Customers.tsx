import React, { useEffect, useState } from 'react'
import axios from 'axios'

type Customer = {
  customerId: number
  firstName: string
  lastName: string
  email?: string
  phone?: string
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    axios
      .get<Customer[]>('/api/customers')
      .then((res) => {
        if (mounted) setCustomers(res.data)
      })
      .catch((err) => console.error('Error fetching customers', err))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Customers</h1>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div>
            {customers.length === 0 ? (
              <p>No customers found.</p>
            ) : (
              <ul className="space-y-2">
                {customers.map((c) => (
                  <li key={c.customerId} className="p-3 border rounded hover:shadow-sm transition-shadow">
                    <div className="font-medium">{c.firstName} {c.lastName}</div>
                    <div className="text-sm text-gray-600">{c.email}</div>
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
