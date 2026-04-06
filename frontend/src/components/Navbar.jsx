import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, ChevronDown, User, LogOut, Calendar, FileText, Pill, LayoutDashboard, Stethoscope, Home } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
    setDropdownOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="logo-icon">🏥</div>
          <div className="logo-text">
            <span className="logo-main">GLOBAL</span>
            <span className="logo-sub">HOSPITALS</span>
          </div>
        </Link>
        
        <div className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Home size={18} />
            Home
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link to="/appointments" className={`nav-link ${isActive('/appointments') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Calendar size={18} />
                Appointments
              </Link>
              <Link to="/doctors" className={`nav-link ${isActive('/doctors') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Stethoscope size={18} />
                Doctors
              </Link>
              <Link to="/medical-records" className={`nav-link ${isActive('/medical-records') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <FileText size={18} />
                Records
              </Link>
              <Link to="/prescriptions" className={`nav-link ${isActive('/prescriptions') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Pill size={18} />
                Prescriptions
              </Link>
              
              <div className="nav-user" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <div className="user-avatar">
                  <User size={18} />
                  <span>{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </div>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setDropdownOpen(false); }}>
                      <User size={16} /> My Profile
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link login-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar