import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Calendar, Stethoscope, Heart, Clock, Shield, Award, Users, Activity } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  const features = [
    { icon: <Calendar size={32} />, title: 'Easy Booking', desc: 'Book appointments online 24/7' },
    { icon: <Stethoscope size={32} />, title: 'Expert Doctors', desc: 'Qualified medical professionals' },
    { icon: <Heart size={32} />, title: 'Quality Care', desc: 'Patient-first approach' },
    { icon: <Clock size={32} />, title: '24/7 Support', desc: 'Emergency services available' }
  ]

  const stats = [
    { icon: <Users size={24} />, number: '50K+', label: 'Happy Patients' },
    { icon: <Award size={24} />, number: '100+', label: 'Expert Doctors' },
    { icon: <Activity size={24} />, number: '20+', label: 'Years of Excellence' },
    { icon: <Shield size={24} />, number: '100%', label: 'Safe & Secure' }
  ]

  return (
    <div>
      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '50px', fontSize: '14px', marginBottom: '24px' }}>
            🏥 Excellence in Healthcare Since 2004
          </div>
          <h1 style={{ fontSize: '56px', fontWeight: '800', marginBottom: '24px' }}>
            Doctor Appointment
            <span style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> Booking System</span>
          </h1>
          <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>
            Your trusted partner in healthcare. Book appointments with top doctors, access medical records, and manage your health journey seamlessly.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard" style={{ background: 'white', color: '#1e3a8a', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: '600' }}>Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" style={{ background: 'white', color: '#1e3a8a', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: '600' }}>Get Started →</Link>
                <Link to="/login" style={{ background: 'transparent', color: 'white', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: '600', border: '2px solid white' }}>Login</Link>
              </>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.2)', flexWrap: 'wrap' }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '800' }}>{stat.number}</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#dbeafe', color: '#1e3a8a', padding: '6px 16px', borderRadius: '50px', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Why Choose Us</div>
          <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Providing Best Healthcare Services</h2>
          <p style={{ color: '#666', marginBottom: '48px' }}>We are committed to delivering exceptional medical care with compassion and excellence</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            {features.map((feature, index) => (
              <div key={index} style={{ padding: '32px', borderRadius: '24px', transition: 'all 0.3s', background: '#f8fafc' }}>
                <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{feature.title}</h3>
                <p style={{ color: '#666' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home