import { useApp } from '../context/AppContext'
import './NotificationsScreen.css'

export default function NotificationsScreen() {
  const { notifications, markNotificationRead } = useApp()

  return (
    <div className="notifications-screen animate-fade-in">
      <div className="notif-header">
        <h1>Notifications</h1>
        <p>Task reminders, chore alerts, and updates</p>
      </div>

      <div className="notif-list">
        {notifications.map(n => (
          <div key={n.id} className={`notif-card glass ${n.read ? 'read' : 'unread'}`} onClick={() => markNotificationRead(n.id)}>
            <div className={`notif-icon type-${n.type}`}>
              {n.type === 'task' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#14b8a6"/></svg>}
              {n.type === 'health' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ec4899"/></svg>}
              {n.type === 'finance' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="#f59e0b"/></svg>}
              {n.type === 'memory' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="#6366f1"/></svg>}
            </div>
            <div className="notif-content">
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <span className="notif-time">{n.time}</span>
            </div>
            {!n.read && <div className="notif-unread-dot" />}
          </div>
        ))}
      </div>
    </div>
  )
}
