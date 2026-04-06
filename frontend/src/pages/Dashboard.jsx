import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Calendar, Users, Stethoscope, Clock, TrendingUp, CheckCircle, FileText, Pill, Activity } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    prescriptions: 0,
    medicalRecords: 0,
    recentAppointments: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [appointmentsRes, recordsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/medical-records')
      ])
      
      setStats({
        totalAppointments: appointmentsRes.data.length,
        upcomingAppointments: appointmentsRes.data.filter(a => a.status === 'pending' || a.status === 'confirmed').length,
        completedAppointments: appointmentsRes.data.filter(a => a.status === 'completed').length,
        medicalRecords: recordsRes.data.length,
        prescriptions: 0,
        recentAppointments: appointmentsRes.data.slice(0, 5)
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    { icon: <Calendar size={24} />, label: 'Total Appointments', value: stats.totalAppointments, color: '#3b82f6', bg: '#dbeafe' },
    { icon: <Clock size={24} />, label: 'Upcoming', value: stats.upcomingAppointments, color: '#f59e0b', bg: '#fed7aa' },
    { icon: <CheckCircle size={24} />, label: 'Completed', value: stats.completedAppointments, color: '#10b981', bg: '#d1fae5' },
    { icon: <FileText size={24} />, label: 'Medical Records', value: stats.medicalRecords, color: '#8b5cf6', bg: '#ede9fe' }
  ]

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard...</div>
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', borderRadius: '24px', padding: '40px', marginBottom: '32px', color: 'white' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Welcome! {user?.name} 👋</h1>
        <p style={{ marginBottom: '24px', opacity: 0.9 }}>Thanks for joining with us. We are always trying to get you a complete service.</p>
        <Link to="/appointments" style={{ background: 'rgba(255,255,255,0.2)', padding: '12px 28px', borderRadius: '50px', color: 'white', textDecoration: 'none', display: 'inline-block' }}>View My Appointments →</Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {statsCards.map((stat, index) => (
          <div key={index} style={{ background: 'white', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '56px', height: '56px', background: stat.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>{stat.icon}</div>
            <div>
              <h3 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>{stat.value}</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Recent Appointments</h3>
          <Link to="/appointments" style={{ color: '#3b82f6', textDecoration: 'none' }}>View All →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Doctor</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Time</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentAppointments.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No appointments found</td></tr>
              ) : (
                stats.recentAppointments.map((appt) => (
                  <tr key={appt._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px 24px' }}>Dr. {appt.doctorName}</td>
                    <td style={{ padding: '16px 24px' }}>{new Date(appt.date).toLocaleDateString()}</td>
                    <td style={{ padding: '16px 24px' }}>{appt.time}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: appt.status === 'confirmed' ? '#d1fae5' : '#fed7aa', color: appt.status === 'confirmed' ? '#065f46' : '#92400e' }}>{appt.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <Link to="/book-appointment" style={{ background: 'white', padding: '28px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', transition: 'transform 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#1f2937' }}>Book Appointment</h4>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Schedule a visit with our specialists</p>
        </Link>
        <Link to="/medical-records" style={{ background: 'white', padding: '28px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', transition: 'transform 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#1f2937' }}>Medical Records</h4>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Access your health history</p>
        </Link>
        <Link to="/prescriptions" style={{ background: 'white', padding: '28px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', transition: 'transform 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💊</div>
          <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#1f2937' }}>Prescriptions</h4>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>View your medications</p>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard