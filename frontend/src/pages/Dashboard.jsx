import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Calendar, Users, Stethoscope, Clock, TrendingUp, CheckCircle, FileText, Pill, Bell, Activity, Heart, Brain } from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    prescriptions: 0,
    medicalRecords: 0,
    totalDoctors: 0,
    totalPatients: 0,
    newBookings: 0,
    todaySessions: 0,
    recentAppointments: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchDashboardData()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats')
      setStats(prev => ({ ...prev, ...response.data }))
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, doctorsRes, recordsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/doctors'),
        api.get('/medical-records')
      ])
      
      setStats(prev => ({
        ...prev,
        totalAppointments: appointmentsRes.data.length,
        upcomingAppointments: appointmentsRes.data.filter(a => a.status === 'pending' || a.status === 'confirmed').length,
        completedAppointments: appointmentsRes.data.filter(a => a.status === 'completed').length,
        totalDoctors: doctorsRes.data.length,
        medicalRecords: recordsRes.data.length,
        recentAppointments: appointmentsRes.data.slice(0, 5)
      }))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    { icon: <Users size={24} />, label: 'All Doctors', value: stats.totalDoctors, color: '#3b82f6', bg: '#dbeafe' },
    { icon: <Users size={24} />, label: 'All Patients', value: stats.totalPatients || 0, color: '#10b981', bg: '#d1fae5' },
    { icon: <Calendar size={24} />, label: 'New Bookings', value: stats.newBookings || stats.upcomingAppointments, color: '#f59e0b', bg: '#fed7aa' },
    { icon: <Clock size={24} />, label: 'Today Sessions', value: stats.todaySessions || 0, color: '#ef4444', bg: '#fee2e2' }
  ]

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div>
            <h1 className="welcome-greeting">Welcome! {user?.name} 👋</h1>
            <p className="welcome-message">
              Thanks for joining with us. We are always trying to get you a complete service.
              You can view your daily schedule, reach patients appointment at home!
            </p>
            <Link to="/appointments" className="view-appointments-btn">
              View My Appointments →
            </Link>
          </div>
          <div className="welcome-stats">
            <div className="stat-circle">
              <span className="stat-number">{stats.completedAppointments}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid-enhanced">
        {statsCards.map((stat, index) => (
          <div key={index} className="stat-card-enhanced" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon-wrapper" style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info-enhanced">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label-enhanced">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Sessions */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Your Upcoming Sessions until Next Week</h3>
          <Link to="/appointments" className="view-all">View All →</Link>
        </div>
        <div className="sessions-table">
          <table>
            <thead>
              <tr>
                <th>Session Title</th>
                <th>Scheduled Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No upcoming sessions found
                  </td>
                </tr>
              ) : (
                stats.recentAppointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>Consultation with Dr. {appt.doctorName}</td>
                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                    <td>{appt.time}</td>
                    <td>
                      <span className={`status-badge status-${appt.status}`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        <Link to="/book-appointment" className="action-card">
          <div className="action-icon">📅</div>
          <h4>Book Appointment</h4>
          <p>Schedule a visit with our specialists</p>
        </Link>
        <Link to="/medical-records" className="action-card">
          <div className="action-icon">📋</div>
          <h4>Medical Records</h4>
          <p>Access your health history</p>
        </Link>
        <Link to="/prescriptions" className="action-card">
          <div className="action-icon">💊</div>
          <h4>Prescriptions</h4>
          <p>View your medications</p>
        </Link>
        <Link to="/doctors" className="action-card">
          <div className="action-icon">👨‍⚕️</div>
          <h4>Find Doctors</h4>
          <p>Browse our specialists</p>
        </Link>
      </div>

      {/* Health Tips */}
      <div className="health-tips-section">
        <h3>Health Tips for You</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">💧</div>
            <p>Stay hydrated - Drink 8 glasses of water daily</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🏃</div>
            <p>30 minutes of exercise can boost your immunity</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">😴</div>
            <p>Get 7-8 hours of quality sleep each night</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🥗</div>
            <p>Include fruits and vegetables in every meal</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard