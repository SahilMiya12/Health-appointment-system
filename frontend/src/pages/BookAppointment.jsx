import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Search, Filter, Star, MapPin, Clock, Calendar as CalendarIcon, User, Stethoscope, ChevronRight, X } from 'lucide-react'
import './BookAppointment.css'

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    type: 'consultation',
    symptoms: ''
  })
  const [loading, setLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])
  const navigate = useNavigate()

  const specialties = ['all', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 'Dermatologist']

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    filterDoctors()
  }, [searchTerm, selectedSpecialty, doctors])

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors')
      setDoctors(response.data)
      setFilteredDoctors(response.data)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const filterDoctors = () => {
    let filtered = doctors
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(doc => doc.specialty === selectedSpecialty)
    }
    setFilteredDoctors(filtered)
  }

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setShowModal(true)
  }

  const handleDateChange = async (date) => {
    setAppointmentData({ ...appointmentData, date, time: '' })
    if (selectedDoctor && date) {
      try {
        const response = await api.get(`/doctors/${selectedDoctor._id}/slots?date=${date}`)
        setAvailableSlots(response.data)
      } catch (error) {
        console.error('Error fetching slots:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/appointments', {
        doctorId: selectedDoctor._id,
        ...appointmentData
      })
      alert('Appointment booked successfully!')
      navigate('/appointments')
    } catch (error) {
      alert('Error booking appointment: ' + error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="book-appointment-container">
      <div className="page-header">
        <h1>Book an Appointment</h1>
        <p>Find and book appointments with top healthcare professionals</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={20} />
          <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
            {specialties.map(spec => (
              <option key={spec} value={spec}>
                {spec === 'all' ? 'All Specialties' : spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="doctors-grid">
        {filteredDoctors.map((doctor) => (
          <div key={doctor._id} className="doctor-card">
            <div className="doctor-card-header">
              <div className="doctor-avatar-large">
                {doctor.name.charAt(0)}
              </div>
              <div className="doctor-rating">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span>{doctor.rating || '4.5'}</span>
                <span className="reviews">({doctor.totalReviews || 50}+ reviews)</span>
              </div>
            </div>
            <div className="doctor-info">
              <h3>Dr. {doctor.name}</h3>
              <p className="doctor-specialty">
                <Stethoscope size={14} />
                {doctor.specialty}
              </p>
              <p className="doctor-qualification">{doctor.qualification}</p>
              <div className="doctor-experience">
                <span>⭐ {doctor.experience}+ years experience</span>
              </div>
              <div className="doctor-fee">
                <span className="fee-amount">₹{doctor.consultationFee}</span>
                <span className="fee-label">per consultation</span>
              </div>
            </div>
            <button 
              className="book-btn"
              onClick={() => handleDoctorSelect(doctor)}
            >
              Book Appointment <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showModal && selectedDoctor && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Appointment with Dr. {selectedDoctor.name}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Date</label>
                <input
                  type="date"
                  value={appointmentData.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Select Time Slot</label>
                <div className="time-slots">
                  {availableSlots.length === 0 ? (
                    <p className="no-slots">Please select a date to see available slots</p>
                  ) : (
                    availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`time-slot ${appointmentData.time === slot ? 'selected' : ''}`}
                        onClick={() => setAppointmentData({...appointmentData, time: slot})}
                      >
                        {slot}
                      </button>
                    ))
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label>Appointment Type</label>
                <select
                  value={appointmentData.type}
                  onChange={(e) => setAppointmentData({...appointmentData, type: e.target.value})}
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                  <option value="checkup">Checkup</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Symptoms (Optional)</label>
                <textarea
                  rows="4"
                  value={appointmentData.symptoms}
                  onChange={(e) => setAppointmentData({...appointmentData, symptoms: e.target.value})}
                  placeholder="Describe your symptoms..."
                />
              </div>

              <div className="booking-summary">
                <div className="summary-item">
                  <span>Consultation Fee:</span>
                  <strong>₹{selectedDoctor.consultationFee}</strong>
                </div>
                <div className="summary-item">
                  <span>Tax (18% GST):</span>
                  <strong>₹{(selectedDoctor.consultationFee * 0.18).toFixed(2)}</strong>
                </div>
                <div className="summary-item total">
                  <span>Total Amount:</span>
                  <strong>₹{(selectedDoctor.consultationFee * 1.18).toFixed(2)}</strong>
                </div>
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Booking...' : `Confirm & Pay ₹${(selectedDoctor.consultationFee * 1.18).toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookAppointment