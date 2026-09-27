import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { FINANCE_DATA } from '../data'
import './Dashboard.css'

export default function Dashboard({ role, onNavigate }) {
  const { members, tasks, toggleTask, events, groceries, unreadCount } = useApp()
  const [showSOS, setShowSOS] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const budgetPercent = Math.round((FINANCE_DATA.spent / FINANCE_DATA.budget) * 100)
  const pendingTasks = tasks.filter(t => !t.done).length
  const pendingGroceries = groceries.filter(g => g.status === 'pending').length

  return (
    <div className="dashboard animate-fade-in">
      <div className="dash-header">
        <div className="dash-greeting">
          <div className="dash-avatar">S</div>
          <div>
            <h1>Good morning, Sarah</h1>
            <p>{pendingTasks} tasks pending - {pendingGroceries} groceries to buy</p>
          </div>
        </div>
        <div className="dash-actions">
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)} title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/></svg>
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>
        </div>
      </div>

      {showNotifications && (
        <div className="notifications-dropdown glass-strong">
          <h3>Notifications</h3>
          <div className="notif-item"><span>Task: Leo's soccer at 6 PM</span></div>
          <div className="notif-item"><span>Health: Maya's inhaler at 12 PM</span></div>
          <div className="notif-item"><span>Budget: Groceries 70% used</span></div>
        </div>
      )}

      <button className="quick-ask glass" onClick={() => onNavigate('chat')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#14b8a6"/></svg>
        <span>Ask Nexus anything...</span>
      </button>

      <div className="family-row">
        <h2>Family Members</h2>
        <div className="family-scroll">
          {members.map(m => (
            <div key={m.id} className="family-member">
              <div className="member-avatar" style={{ background: m.color + '20', borderColor: m.color + '40' }}>
                {m.avatar}
                {m.online && <div className="online-dot" />}
              </div>
              <span className="member-name">{m.name.split(' ')[0]}</span>
              <span className="member-status">{m.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <button className="qa-btn glass" onClick={() => onNavigate('memories')}><span>+</span> Memory</button>
        <button className="qa-btn glass" onClick={() => onNavigate('calendar')}><span>+</span> Event</button>
        <button className="qa-btn glass qa-ai" onClick={() => onNavigate('chat')}>Ask AI</button>
        <button className="qa-btn glass qa-sos" onClick={() => setShowSOS(true)}>SOS</button>
      </div>

      <div className="widget glass">
        <div className="widget-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ec4899"/></svg>
          <h3>Family Vitals & Care</h3>
        </div>
        <div className="health-quick">
          <div className="health-quick-item"><strong>Maya</strong><span>Inhaler at 12 PM</span></div>
          <div className="health-quick-item"><strong>Grandma Elena</strong><span>BP meds taken</span></div>
          <div className="health-quick-item"><strong>Leo</strong><span>6,240 steps</span></div>
        </div>
      </div>

      <div className="widget glass">
        <div className="widget-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="#14b8a6"/></svg>
          <h3>Household Budget</h3>
        </div>
        <div className="budget-info">
          <div className="budget-numbers">
            <span className="budget-spent">${FINANCE_DATA.spent.toLocaleString()}</span>
            <span className="budget-total">of ${FINANCE_DATA.budget.toLocaleString()}</span>
          </div>
          <div className="budget-bar">
            <div className="budget-fill" style={{ width: `${budgetPercent}%` }} />
          </div>
          <span className="budget-percent">{budgetPercent}% used</span>
        </div>
      </div>

      <div className="widget glass">
        <div className="widget-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#14b8a6"/></svg>
          <h3>Tasks & Chores</h3>
        </div>
        {tasks.filter(t => !t.done).slice(0, 3).map(task => (
          <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`} onClick={() => toggleTask(task.id)}>
            <div className="task-check">
              {task.done && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#003731"/></svg>}
            </div>
            <div className="task-info">
              <span className="task-title">{task.title}</span>
              <span className="task-assignee">{task.assignee} - {task.points} pts</span>
            </div>
          </div>
        ))}
      </div>

      <div className="widget glass">
        <div className="widget-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" fill="#f59e0b"/></svg>
          <h3>Upcoming Events</h3>
        </div>
        {events.slice(0, 3).map(e => (
          <div key={e.id} className="event-item">
            <div className="event-date">
              <span className="event-day">{e.date}</span>
              <span className="event-time">{e.time}</span>
            </div>
            <div className="event-info">
              <span className="event-title">{e.title}</span>
            </div>
          </div>
        ))}
      </div>

      {showSOS && (
        <div className="modal-overlay" onClick={() => setShowSOS(false)}>
          <div className="modal glass-strong sos-modal" onClick={e => e.stopPropagation()}>
            <h3>Emergency SOS</h3>
            <p>Send emergency alert to all family members?</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowSOS(false)}>Cancel</button>
              <button className="modal-save" style={{ background: '#ef4444' }} onClick={() => setShowSOS(false)}>Send SOS</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
