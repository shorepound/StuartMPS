import React from 'react'

type Props = {
  label?: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  name?: string
}

export default function FormField({ label, value, onChange, type = 'text', placeholder = '', name }: Props) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
