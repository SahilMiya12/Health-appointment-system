import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bloodGroup: user?.bloodGroup || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Update profile logic here
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div className="form-container" style={{ margin: '0 auto' }}>
        <h2>My Profile</h2>
        
        {!isEditing ? (
          <div>
            <div className="form-group">
              <label>Name</label>
              <p style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>{user?.name}</p>
            </div>
            <div className="form-group">
              <label>Email</label>
              <p style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>{user?.email}</p>
            </div>
            <div className="form-group">
              <label>Role</label>
              <p style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ width: '100%' }}>
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile