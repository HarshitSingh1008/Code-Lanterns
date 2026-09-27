import { useState } from 'react'
import { useApp } from '../context/AppContext'
import './CalendarScreen.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function CalendarScreen() {
  const { events, addEvent } = useApp()
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(today.getDate())
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'family' })

  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

  const calendarDays = []
  for (let i = firstDay - 1; i >= 0; i--) calendarDays.push({ day: daysInPrevMonth - i, current: false })
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push({ day: i, current: true })
  for (let i = 1; i <= 42 - calendarDays.length; i++) calendarDays.push({ day: i, current: false })

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1) }
    else setCurrentMonth(currentMonth - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1) }
    else setCurrentMonth(currentMonth + 1)
  }

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return
    addEvent({ ...newEvent, date: `${MONTHS[currentMonth]} ${selectedDate}`, icon: 'family' })
    setNewEvent({ title: '', time: '', type: 'family' })
    setShowAddEvent(false)
  }

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 6
    return { hour, label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`, events: events.filter(e => e.time.includes(hour > 12 ? hour - 12 : hour)) }
  })

  return (
    <div className="calendar-screen animate-fade-in">
      <div className="cal-header">
        <h1>Family Calendar</h1>
        <p>Manage events, tasks, and schedules</p>
        <button className="add-event-btn" onClick={() => setShowAddModal(true)}>+ Add Event</button>
      </div>

      <div className="calendar-layout">
        <div className="calendar-widget glass">
          <div className="cal-nav">
            <button onClick={prevMonth} className="cal-nav-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg></button>
            <h2>{MONTHS[currentMonth]} {currentYear}</h2>
            <button onClick={nextMonth} className="cal-nav-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor"/></svg></button>
          </div>
          <div className="cal-days-header">{DAYS.map(d => <span key={d}>{d}</span>)}</div>
          <div className="cal-grid">
            {calendarDays.map((d, i) => {
              const isToday = d.current && d.day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
              const isSelected = d.current && d.day === selectedDate
              return (
                <button key={i} className={`cal-day ${d.current ? '' : 'other-month'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`} onClick={() => d.current && setSelectedDate(d.day)}>
                  {d.day}
                </button>
              )
            })}
          </div>
        </div>

        <div className="day-schedule glass">
          <h3>Schedule for {MONTHS[currentMonth]} {selectedDate}</h3>
          <div className="time-slots">
            {timeSlots.map(slot => (
              <div key={slot.hour} className="time-slot">
                <span className="time-label">{slot.label}</span>
                <div className="slot-events">
                  {slot.events.map(e => (
                    <div key={e.id} className={`slot-event type-${e.type}`}>
                      <span className="event-dot" />
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="events-section">
        <h2>All Events</h2>
        {events.map(e => (
          <div key={e.id} className="event-card glass">
            <div className="event-date"><span>{e.date}</span></div>
            <div className="event-info"><strong>{e.title}</strong><span>{e.time}</span></div>
            <span className="event-type">{e.type}</span>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal glass-strong" onClick={e => e.stopPropagation()}>
            <h3>Add New Event</h3>
            <input type="text" placeholder="Event title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
            <input type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
            <select value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}>
              <option value="family">Family</option>
              <option value="activity">Activity</option>
              <option value="medical">Medical</option>
              <option value="birthday">Birthday</option>
              <option value="errand">Errand</option>
            </select>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="modal-save" onClick={handleAddEvent}>Save Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
