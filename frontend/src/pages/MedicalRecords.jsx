import React, { useState, useEffect } from 'react'
import api from '../services/api'

const MedicalRecords = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const response = await api.get('/medical-records')
      setRecords(response.data)
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ color: 'white', marginBottom: '32px' }}>Medical Records</h1>
      
      {records.length === 0 ? (
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <p>No medical records found</p>
        </div>
      ) : (
        records.map((record) => (
          <div key={record._id} className="stat-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '16px' }}>
              Visit on {new Date(record.date).toLocaleDateString()}
            </h3>
            {record.doctorName && (
              <p><strong>Doctor:</strong> Dr. {record.doctorName}</p>
            )}
            {record.diagnosis && (
              <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
            )}
            {record.symptoms && (
              <p><strong>Symptoms:</strong> {record.symptoms}</p>
            )}
            {record.treatment && (
              <p><strong>Treatment:</strong> {record.treatment}</p>
            )}
            {record.medications && record.medications.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <strong>Medications:</strong>
                <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                  {record.medications.map((med, idx) => (
                    <li key={idx}>{med.name} - {med.dosage} ({med.frequency})</li>
                  ))}
                </ul>
              </div>
            )}
            {record.vitals && (
              <div style={{ marginTop: '12px' }}>
                <strong>Vitals:</strong>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {record.vitals.bloodPressure && <span>BP: {record.vitals.bloodPressure}</span>}
                  {record.vitals.heartRate && <span>Heart Rate: {record.vitals.heartRate}</span>}
                  {record.vitals.temperature && <span>Temp: {record.vitals.temperature}°F</span>}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default MedicalRecords