import { useApp } from '../context/AppContext'
import './ChildTrackingScreen.css'

export default function ChildTrackingScreen() {
  const { childTracking } = useApp()

  if (!childTracking || childTracking.length === 0) {
    return (
      <div className="tracking-screen animate-fade-in">
        <div className="tracking-header">
          <h1>Child Safety</h1>
          <p>No tracking data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tracking-screen animate-fade-in">
      <div className="tracking-header">
        <h1>Child Safety</h1>
        <p>Track your children's location and safety</p>
      </div>

      <div className="tracking-list">
        {childTracking.map((c, i) => (
          <div key={i} className="tracking-card glass">
            <div className="tracking-header">
              <div className="tracking-avatar">{c.member[0]}</div>
              <div className="tracking-info">
                <h3>{c.member}</h3>
                <span className="tracking-status safe">{c.status}</span>
              </div>
              <div className="tracking-battery">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" fill={c.battery > 20 ? '#34d399' : '#ef4444'}/></svg>
                <span>{c.battery}%</span>
              </div>
            </div>
            <div className="tracking-location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#14b8a6"/></svg>
              <div>
                <span className="location-name">{c.location}</span>
                <span className="location-time">Updated {c.lastUpdate}</span>
              </div>
            </div>
            <div className="tracking-actions">
              <button className="tracking-btn">View on Map</button>
              <button className="tracking-btn secondary">Send Check-in</button>
            </div>
          </div>
        ))}
      </div>

      <div className="safety-features glass">
        <h3>Safety Features</h3>
        <div className="safety-item">
          <span>Geofence Alerts</span>
          <small>Get notified when children leave safe zones</small>
        </div>
        <div className="safety-item">
          <span>SOS Button</span>
          <small>Children can send emergency alerts</small>
        </div>
        <div className="safety-item">
          <span>Screen Time</span>
          <small>Monitor and set device usage limits</small>
        </div>
        <div className="safety-item">
          <span>Location History</span>
          <small>View past locations for the last 7 days</small>
        </div>
      </div>
    </div>
  )
}
