import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { HEALTH_DATA } from '../data'
import './HealthScreen.css'

export default function HealthScreen() {
  const { prescriptions } = useApp()
  const [activeTab, setActiveTab] = useState('overview')
  const [showDoctorChat, setShowDoctorChat] = useState(false)
  const [doctorMessages, setDoctorMessages] = useState([
    { from: 'doctor', text: "Hello! I'm Dr. Smith, your family doctor. I can see all your family's health records. How can I help you today?" }
  ])
  const [doctorInput, setDoctorInput] = useState('')

  const sendToDoctor = () => {
    if (!doctorInput.trim()) return
    setDoctorMessages(prev => [...prev, { from: 'user', text: doctorInput }])
    setDoctorInput('')
    setTimeout(() => {
      setDoctorMessages(prev => [...prev, { from: 'doctor', text: "Thank you for sharing that. Based on the family health records I can access, I'll review the prescriptions and get back to you with advice. Is there anything urgent I should know about?" }])
    }, 1500)
  }

  return (
    <div className="health-screen animate-fade-in">
      <div className="health-header">
        <h1>Family Health</h1>
        <p>Track vitals, medications, and prescriptions</p>
      </div>

      <div className="health-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'prescriptions' ? 'active' : ''} onClick={() => setActiveTab('prescriptions')}>Prescriptions</button>
        <button className={activeTab === 'doctor' ? 'active' : ''} onClick={() => setActiveTab('doctor')}>Family Doctor</button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="health-summary glass">
            <div className="health-stat"><span className="stat-value">4</span><span className="stat-label">Active Prescriptions</span></div>
            <div className="health-stat"><span className="stat-value">2</span><span className="stat-label">Due Today</span></div>
            <div className="health-stat"><span className="stat-value">5</span><span className="stat-label">Family Members</span></div>
          </div>
          <div className="health-list">
            {HEALTH_DATA.map((h, i) => (
              <div key={i} className="health-item glass">
                <div className="health-info">
                  <strong>{h.member}</strong>
                  <span>{h.title}: {h.detail}</span>
                </div>
                <span className={`health-status ${h.status.toLowerCase().replace(' ', '-')}`}>{h.status}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'prescriptions' && (
        <div className="prescriptions-list">
          {prescriptions.map(p => (
            <div key={p.id} className="prescription-card glass">
              <div className="prescription-header">
                <div>
                  <h3>{p.medication}</h3>
                  <span className="prescription-member">{p.member}</span>
                </div>
                <span className={`prescription-status ${p.status}`}>{p.status}</span>
              </div>
              <div className="prescription-details">
                <div><span>Dosage</span><strong>{p.dosage}</strong></div>
                <div><span>Frequency</span><strong>{p.frequency}</strong></div>
                <div><span>Prescribed By</span><strong>{p.prescribedBy}</strong></div>
                <div><span>Refill Date</span><strong>{p.refillDate}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'doctor' && (
        <div className="doctor-section">
          <div className="doctor-card glass">
            <div className="doctor-avatar">DS</div>
            <div className="doctor-info">
              <h3>Dr. Smith</h3>
              <p>Family Physician</p>
              <span className="doctor-status">Online</span>
            </div>
            <button className="doctor-chat-btn" onClick={() => setShowDoctorChat(true)}>Chat</button>
          </div>
          <div className="doctor-access glass">
            <h4>What Dr. Smith can access:</h4>
            <ul>
              <li>All family health records</li>
              <li>Prescriptions and medications</li>
              <li>Allergy information</li>
              <li>Appointment history</li>
            </ul>
          </div>
        </div>
      )}

      {showDoctorChat && (
        <div className="modal-overlay" onClick={() => setShowDoctorChat(false)}>
          <div className="modal glass-strong doctor-chat" onClick={e => e.stopPropagation()}>
            <div className="doctor-chat-header">
              <h3>Dr. Smith</h3>
              <button onClick={() => setShowDoctorChat(false)}>Close</button>
            </div>
            <div className="doctor-messages">
              {doctorMessages.map((m, i) => (
                <div key={i} className={`doctor-msg ${m.from}`}>{m.text}</div>
              ))}
            </div>
            <div className="doctor-input">
              <input type="text" placeholder="Ask Dr. Smith..." value={doctorInput} onChange={e => setDoctorInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendToDoctor()} />
              <button onClick={sendToDoctor}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
