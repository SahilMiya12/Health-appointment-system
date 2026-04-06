import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments')
      setAppointments(response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.delete(`/appointments/${id}`)
        fetchAppointments()
        alert('Appointment cancelled successfully')
      } catch (error) {
        alert('Error cancelling appointment')
      }
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ color: 'white', marginBottom: '32px' }}>My Appointments</h1>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No appointments found</td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>Dr. {appt.doctorName}</td>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>{appt.time}</td>
                  <td>{appt.type}</td>
                  <td>
                    <span className={`status-badge status-${appt.status}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    {appt.status === 'pending' && (
                      <button
                        onClick={() => cancelAppointment(appt._id)}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Appointments