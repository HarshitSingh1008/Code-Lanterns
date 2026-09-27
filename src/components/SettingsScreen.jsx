import { useState } from 'react'
import { useTheme } from '../theme/ThemeContext'
import { useApp } from '../context/AppContext'
import { ROLES } from '../data'
import { connectGoogleCalendar, connectGoogleDrive, syncEventsToCalendar, uploadToDrive } from '../services/googleSync'
import './SettingsScreen.css'

export default function SettingsScreen({ role, onSwitchRole }) {
  const { theme, themeId, setThemeId, themes } = useTheme()
  const { members, events, memories } = useApp()
  const [showThemes, setShowThemes] = useState(false)
  const [syncStatus, setSyncStatus] = useState({ calendar: '', drive: '' })
  const [syncing, setSyncing] = useState({ calendar: false, drive: false })
  const currentRole = ROLES.find(r => r.id === role)

  const handleCalendarSync = async () => {
    setSyncing(s => ({ ...s, calendar: true }))
    setSyncStatus(s => ({ ...s, calendar: 'Connecting...' }))
    try {
      await connectGoogleCalendar()
      const results = await syncEventsToCalendar(events)
      setSyncStatus(s => ({ ...s, calendar: `Synced ${results.length} events` }))
    } catch (e) {
      setSyncStatus(s => ({ ...s, calendar: `Error: ${e.message || e}` }))
    }
    setSyncing(s => ({ ...s, calendar: false }))
  }

  const handleDriveSync = async () => {
    setSyncing(s => ({ ...s, drive: true }))
    setSyncStatus(s => ({ ...s, drive: 'Connecting...' }))
    try {
      await connectGoogleDrive()
      const results = await uploadToDrive(memories)
      setSyncStatus(s => ({ ...s, drive: `Uploaded ${results.length} memories` }))
    } catch (e) {
      setSyncStatus(s => ({ ...s, drive: `Error: ${e.message || e}` }))
    }
    setSyncing(s => ({ ...s, drive: false }))
  }

  return (
    <div className="settings-screen animate-fade-in">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Customize your Family Nexus experience</p>
      </div>

      <div className="settings-section">
        <h2>Appearance</h2>
        <button className="settings-item glass" onClick={() => setShowThemes(!showThemes)}>
          <div className="settings-item-info">
            <span>Theme</span>
            <small>Current: {theme.name}</small>
          </div>
          <div className="theme-preview" style={{ background: theme.primary }} />
        </button>
        {showThemes && (
          <div className="theme-grid">
            {themes.map(t => (
              <button key={t.id} className={`theme-option ${themeId === t.id ? 'active' : ''}`} onClick={() => { setThemeId(t.id); setShowThemes(false) }}>
                <div className="theme-color" style={{ background: t.primary }} />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="settings-section">
        <h2>Profile</h2>
        <div className="settings-item glass">
          <div className="settings-item-info">
            <span>Current Role</span>
            <small>{currentRole?.label} - {currentRole?.badge}</small>
          </div>
          <span className="role-badge" style={{ background: currentRole?.color + '20', color: currentRole?.color }}>{currentRole?.label}</span>
        </div>
        <button className="settings-item glass" onClick={onSwitchRole}>
          <div className="settings-item-info">
            <span>Switch Profile</span>
            <small>Change family member or role</small>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor"/></svg>
        </button>
      </div>

      <div className="settings-section">
        <h2>Family Members</h2>
        {members.map(m => (
          <div key={m.id} className="settings-item glass">
            <div className="member-avatar-small" style={{ background: m.color + '20', borderColor: m.color + '40' }}>{m.avatar}</div>
            <div className="settings-item-info">
              <span>{m.name}</span>
              <small>{m.role}{m.age ? ` - ${m.age} yrs` : ''}</small>
            </div>
            <span className={`member-status ${m.online ? 'online' : ''}`}>{m.online ? 'Online' : 'Offline'}</span>
          </div>
        ))}
      </div>

      <div className="settings-section">
        <h2>Integrations</h2>
        <div className="settings-item glass">
          <div className="settings-item-info">
            <span>Google Calendar</span>
            <small>{syncStatus.calendar || 'Sync events with Google Calendar'}</small>
          </div>
          <button className="connect-btn" onClick={handleCalendarSync} disabled={syncing.calendar}>
            {syncing.calendar ? 'Syncing...' : 'Connect'}
          </button>
        </div>
        <div className="settings-item glass">
          <div className="settings-item-info">
            <span>Google Drive</span>
            <small>{syncStatus.drive || 'Backup memories to Google Drive'}</small>
          </div>
          <button className="connect-btn" onClick={handleDriveSync} disabled={syncing.drive}>
            {syncing.drive ? 'Syncing...' : 'Connect'}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Privacy & Security</h2>
        <div className="settings-item glass">
          <div className="settings-item-info">
            <span>End-to-End Encryption</span>
            <small>All family data is encrypted</small>
          </div>
          <div className="toggle active" />
        </div>
        <div className="settings-item glass">
          <div className="settings-item-info">
            <span>Local-First Storage</span>
            <small>Data stored on home server</small>
          </div>
          <div className="toggle active" />
        </div>
        <div className="settings-item glass">
          <div className="settings-item-info">
            <span>AI Cloud Processing</span>
            <small>Use cloud AI for complex queries</small>
          </div>
          <div className="toggle" />
        </div>
      </div>

      <div className="settings-section">
        <h2>About</h2>
        <div className="settings-item glass">
          <div className="settings-item-info">
            <span>Version</span>
            <small>Family Nexus AI v1.0.0</small>
          </div>
        </div>
      </div>
    </div>
  )
}
