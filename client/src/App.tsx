import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Customers from './pages/Customers'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import Layout from './components/Layout'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Customers />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
