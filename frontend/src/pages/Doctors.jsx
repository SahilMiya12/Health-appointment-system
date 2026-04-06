import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Search, Star, Stethoscope, MapPin, Clock } from 'lucide-react'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors')
      setDoctors(response.data)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading doctors...</div>
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Our Doctors</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>Meet our experienced medical professionals</p>
      
      <div style={{ marginBottom: '32px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={20} />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
          />
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {filteredDoctors.map((doctor) => (
          <div key={doctor._id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', padding: '24px', textAlign: 'center', color: 'white' }}>
              <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#1e3a8a' }}>
                {doctor.name?.charAt(0)}
              </div>
              <h3 style={{ marginTop: '12px', marginBottom: '4px' }}>Dr. {doctor.name}</h3>
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Star size={16} fill="#fbbf24" color="#fbbf24" /> {doctor.rating || '4.5'} ({doctor.totalReviews || 0} reviews)
              </p>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Stethoscope size={16} /> {doctor.specialty}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Clock size={16} /> {doctor.experience}+ years experience
              </p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginTop: '12px' }}>
                ₹{doctor.consultationFee}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Doctors