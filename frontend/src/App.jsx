import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import MedicalRecords from './pages/MedicalRecords'
import Prescriptions from './pages/Prescriptions'
import BookAppointment from './pages/BookAppointment'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Doctors from './pages/Doctors'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
            <Route path="/book-appointment" element={<PrivateRoute><BookAppointment /></PrivateRoute>} />
            <Route path="/medical-records" element={<PrivateRoute><MedicalRecords /></PrivateRoute>} />
            <Route path="/prescriptions" element={<PrivateRoute><Prescriptions /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/doctors" element={<PrivateRoute><Doctors /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App