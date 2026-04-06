import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react'

const Footer = () => {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', marginTop: '60px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '48px' }}>🏥</span>
              <div>
                <h3 style={{ fontSize: '20px', margin: 0 }}>GLOBAL HOSPITALS</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Excellence in Healthcare</p>
              </div>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>Providing world-class healthcare services with cutting-edge technology and compassionate care.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}><Facebook size={18} /></a>
              <a href="#" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}><Twitter size={18} /></a>
              <a href="#" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}><Instagram size={18} /></a>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '20px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '12px' }}><Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link></li>
              <li style={{ marginBottom: '12px' }}><Link to="/doctors" style={{ color: '#94a3b8', textDecoration: 'none' }}>Our Doctors</Link></li>
              <li style={{ marginBottom: '12px' }}><Link to="/appointments" style={{ color: '#94a3b8', textDecoration: 'none' }}>Book Appointment</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '20px' }}>Contact Info</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#94a3b8' }}><MapPin size={16} /> 123 Healthcare Ave, Medical City</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#94a3b8' }}><Phone size={16} /> +1 (555) 123-4567</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#94a3b8' }}><Mail size={16} /> info@globalhospitals.com</li>
            </ul>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', textAlign: 'center', color: '#94a3b8' }}>
          <p>&copy; 2024 GLOBAL HOSPITALS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer