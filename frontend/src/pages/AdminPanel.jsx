import React, { useState, useEffect } from 'react'
import api from '../services/api'

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [activeTab, setActiveTab] = useState('users')

  useEffect(() => {
    fetchUsers()
    fetchAppointments()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/doctors') // Get all users endpoint
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments')
      setAppointments(response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ color: 'white', marginBottom: '32px' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Users Management
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Appointments
        </button>
      </div>
      
      {activeTab === 'users' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{user.role}</td>
                  <td>
                    <span className="status-badge status-confirmed">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'appointments' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt.patientName}</td>
                  <td>Dr. {appt.doctorName}</td>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>{appt.time}</td>
                  <td>
                    <span className={`status-badge status-${appt.status}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPanel