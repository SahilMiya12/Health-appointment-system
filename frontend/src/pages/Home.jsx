import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Your Health, Our Priority</h1>
        <p>Book appointments, access medical records, and manage your health journey with ease. Experience modern healthcare at your fingertips.</p>
        <div className="hero-buttons">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home