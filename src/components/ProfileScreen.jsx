import { useState } from 'react'
import { ROLES, FAMILY_MEMBERS } from '../data'
import './ProfileScreen.css'

export default function ProfileScreen({ role, onSwitchRole }) {
  const currentRole = ROLES.find(r => r.id === role)
  const [toggles, setToggles] = useState({ encryption: true, local: true, cloud: false, audit: true })

  const togglePrivacy = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSignOut = () => {
    onSwitchRole()
  }

  return (
    <div className="profile-screen animate-fade-in">
      <div className="profile-header">
        <div className="profile-avatar-large">S</div>
        <h1>Sarah Miller</h1>
        <p>Parent - Miller Household</p>
        <span className="profile-role-badge" style={{ background: currentRole?.color + '20', color: currentRole?.color }}>
          {currentRole?.label}
        </span>
      </div>

      <div className="profile-section">
        <h2>Family Members</h2>
        {FAMILY_MEMBERS.map(m => (
          <div key={m.id} className="profile-member glass">
            <div className="pm-avatar" style={{ background: m.color + '20', borderColor: m.color + '40' }}>
              {m.avatar}
            </div>
            <div className="pm-info">
              <span className="pm-name">{m.name}</span>
              <span className="pm-role">{m.role}{m.age ? ` - ${m.age} yrs` : ''}</span>
            </div>
            <div className={`pm-status ${m.online ? 'online' : ''}`}>
              {m.online ? 'Online' : 'Offline'}
            </div>
          </div>
        ))}
      </div>

      <div className="profile-section">
        <h2>Privacy & Security</h2>
        <div className="privacy-item glass">
          <div className="privacy-info">
            <span>End-to-End Encryption</span>
            <small>All family data is encrypted</small>
          </div>
          <button className={`privacy-toggle ${toggles.encryption ? 'active' : ''}`} onClick={() => togglePrivacy('encryption')} />
        </div>
        <div className="privacy-item glass">
          <div className="privacy-info">
            <span>Local-First Storage</span>
            <small>Data stored on home server</small>
          </div>
          <button className={`privacy-toggle ${toggles.local ? 'active' : ''}`} onClick={() => togglePrivacy('local')} />
        </div>
        <div className="privacy-item glass">
          <div className="privacy-info">
            <span>AI Cloud Processing</span>
            <small>Use cloud AI for complex queries</small>
          </div>
          <button className={`privacy-toggle ${toggles.cloud ? 'active' : ''}`} onClick={() => togglePrivacy('cloud')} />
        </div>
        <div className="privacy-item glass">
          <div className="privacy-info">
            <span>Audit Log</span>
            <small>Track who accessed what data</small>
          </div>
          <button className={`privacy-toggle ${toggles.audit ? 'active' : ''}`} onClick={() => togglePrivacy('audit')} />
        </div>
      </div>

      <div className="profile-section">
        <h2>Preferences</h2>
        <div className="pref-item glass">
          <span>Notifications</span>
          <span className="pref-value">All</span>
        </div>
        <div className="pref-item glass">
          <span>Theme</span>
          <span className="pref-value">Dark</span>
        </div>
        <div className="pref-item glass">
          <span>Language</span>
          <span className="pref-value">English</span>
        </div>
        <div className="pref-item glass">
          <span>Voice Assistant</span>
          <span className="pref-value">Enabled</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="profile-btn secondary" onClick={onSwitchRole}>
          Switch Profile
        </button>
        <button className="profile-btn danger" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <p className="profile-footer">Family Nexus AI v1.0.0 - Built for families</p>
    </div>
  )
}
