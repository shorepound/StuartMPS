import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Customers from './pages/Customers'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import NotAuthorized from './pages/NotAuthorized'
import Layout from './components/Layout'
import RequireAdmin from './components/RequireAdmin'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Customers />} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
