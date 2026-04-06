import React, { useState, useEffect } from 'react'
import api from '../services/api'

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get('/prescriptions')
      setPrescriptions(response.data)
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ color: 'white', marginBottom: '32px' }}>My Prescriptions</h1>
      
      {prescriptions.length === 0 ? (
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <p>No prescriptions found</p>
        </div>
      ) : (
        prescriptions.map((prescription) => (
          <div key={prescription._id} className="stat-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#667eea' }}>
                Prescription from Dr. {prescription.doctorName}
              </h3>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {new Date(prescription.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <table style={{ width: '100%', marginTop: '12px' }}>
              <thead>
                <tr style={{ background: '#f8f9ff' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Medication</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Dosage</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Frequency</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medications.map((med, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px' }}>{med.name}</td>
                    <td style={{ padding: '8px' }}>{med.dosage}</td>
                    <td style={{ padding: '8px' }}>{med.frequency}</td>
                    <td style={{ padding: '8px' }}>{med.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {prescription.notes && (
              <p style={{ marginTop: '12px', color: '#666' }}>
                <strong>Notes:</strong> {prescription.notes}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default Prescriptions