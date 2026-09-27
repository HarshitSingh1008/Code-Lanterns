import { useState } from 'react'
import { ROLES } from '../data'
import './RoleSelection.css'

const ICONS = {
  shield: 'M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z',
  toy: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  verified: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
  badge: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
}

export default function RoleSelection({ onSelect }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="role-screen">
      <div className="role-header">
        <div className="role-step">Step 2 of 4 - Onboarding</div>
        <div className="role-brand">
          <div className="role-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="#14b8a6" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="10" r="3" fill="#14b8a6"/>
              <path d="M12 13v5M8 16l4-3 4 3" stroke="#14b8a6" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <h1>Family Nexus AI</h1>
        </div>
        <h2>Who is joining today?</h2>
        <p className="role-subtitle">Choose how you will connect with your family circle. Permissions can be customized anytime.</p>
      </div>

      <div className="role-cards">
        {ROLES.map((role) => (
          <button
            key={role.id}
            className={`role-card ${selected === role.id ? 'selected' : ''}`}
            onClick={() => setSelected(role.id)}
            style={{ '--role-color': role.color }}
          >
            <div className="role-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d={ICONS[role.icon]} fill={role.color} />
              </svg>
            </div>
            <div className="role-card-content">
              <div className="role-card-title">
                <span>{role.label}</span>
                <span className="role-badge">{role.badge}</span>
              </div>
              <p>{role.desc}</p>
            </div>
            <div className="role-check">
              {selected === role.id && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill={role.color}/>
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="role-footer">
        <div className="role-security">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="#14b8a6"/>
          </svg>
          <span>Protected by end-to-end family encryption</span>
        </div>
        <button
          className="role-continue"
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
        >
          Continue with {selected ? ROLES.find(r => r.id === selected)?.label : '...'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor"/>
          </svg>
        </button>
        <p className="role-switch">You can switch profiles or invite others later</p>
      </div>
    </div>
  )
}
