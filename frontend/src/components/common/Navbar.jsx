import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav style={{
      background: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0ea5e9', textDecoration: 'none' }}>
          🏥 Healthcare System
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{ textDecoration: 'none', color: '#64748b' }}>Login</Link>
          <Link to="/register" style={{ textDecoration: 'none', color: '#64748b' }}>Register</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar