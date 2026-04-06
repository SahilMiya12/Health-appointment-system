import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🏥</span>
              <div>
                <h3>GLOBAL HOSPITALS</h3>
                <p>Excellence in Healthcare</p>
              </div>
            </div>
            <p className="footer-description">
              Providing world-class healthcare services with cutting-edge technology 
              and compassionate care. Your health is our priority.
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><Facebook size={18} /></a>
              <a href="#" className="social-link"><Twitter size={18} /></a>
              <a href="#" className="social-link"><Instagram size={18} /></a>
              <a href="#" className="social-link"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/doctors">Our Doctors</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Patient Resources */}
          <div className="footer-section">
            <h4>Patient Resources</h4>
            <ul className="footer-links">
              <li><Link to="/appointments">Book Appointment</Link></li>
              <li><Link to="/medical-records">Medical Records</Link></li>
              <li><Link to="/prescriptions">Prescriptions</Link></li>
              <li><Link to="/insurance">Insurance</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul className="contact-info">
              <li>
                <MapPin size={16} />
                <span>123 Healthcare Ave, Medical City, MC 12345</span>
              </li>
              <li>
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <Mail size={16} />
                <span>info@globalhospitals.com</span>
              </li>
              <li>
                <Clock size={16} />
                <span>24/7 Emergency Services</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="footer-hours">
          <div className="hours-header">
            <Clock size={20} />
            <h4>Opening Hours</h4>
          </div>
          <div className="hours-grid">
            <div className="hour-item">
              <span>Monday - Friday</span>
              <strong>8:00 AM - 8:00 PM</strong>
            </div>
            <div className="hour-item">
              <span>Saturday</span>
              <strong>9:00 AM - 5:00 PM</strong>
            </div>
            <div className="hour-item">
              <span>Sunday</span>
              <strong>10:00 AM - 4:00 PM</strong>
            </div>
            <div className="hour-item emergency">
              <span>Emergency</span>
              <strong>24/7 Available</strong>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; 2024 GLOBAL HOSPITALS. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer