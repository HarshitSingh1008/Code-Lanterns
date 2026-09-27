import { useState } from 'react'
import { useApp } from '../context/AppContext'
import './MemoriesScreen.css'

export default function MemoriesScreen() {
  const { memories, addMemory } = useApp()
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [newMemory, setNewMemory] = useState({ title: '', desc: '', type: 'photo' })
  const [selectedMemory, setSelectedMemory] = useState(null)

  const filtered = filter === 'all' ? memories : memories.filter(m => m.type === filter)

  const handleAdd = () => {
    if (!newMemory.title.trim()) return
    addMemory({ ...newMemory, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), participants: ['Sarah'] })
    setNewMemory({ title: '', desc: '', type: 'photo' })
    setShowAdd(false)
  }

  return (
    <div className="memories-screen animate-fade-in">
      <div className="mem-header">
        <h1>Family Memories</h1>
        <p>Your family's shared timeline</p>
      </div>

      <div className="mem-filters">
        {['all', 'photo', 'achievement', 'birthday'].map(f => (
          <button key={f} className={`mem-filter ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="mem-grid">
        {filtered.map((m, i) => (
          <div key={m.id} className="mem-card glass animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }} onClick={() => setSelectedMemory(m)}>
            <div className="mem-card-image">
              {m.type === 'photo' && <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="#14b8a6"/></svg>}
              {m.type === 'achievement' && <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z" fill="#f59e0b"/></svg>}
              {m.type === 'birthday' && <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm6 9h-5v-2h-2v2H6c-1.66 0-3 1.34-3 3v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-1.66-1.34-3-3-3z" fill="#ec4899"/></svg>}
            </div>
            <div className="mem-card-content">
              <span className="mem-date">{m.date}</span>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
              <div className="mem-participants">
                {m.participants.map((p, i) => <span key={i} className="mem-participant">{p}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mem-add-btn" onClick={() => setShowAdd(true)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
        Add Memory
      </button>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal glass-strong" onClick={e => e.stopPropagation()}>
            <h3>Add New Memory</h3>
            <input type="text" placeholder="Memory title" value={newMemory.title} onChange={e => setNewMemory({ ...newMemory, title: e.target.value })} />
            <input type="text" placeholder="Description" value={newMemory.desc} onChange={e => setNewMemory({ ...newMemory, desc: e.target.value })} />
            <select value={newMemory.type} onChange={e => setNewMemory({ ...newMemory, type: e.target.value })}>
              <option value="photo">Photo</option><option value="achievement">Achievement</option><option value="birthday">Birthday</option>
            </select>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="modal-save" onClick={handleAdd}>Save Memory</button>
            </div>
          </div>
        </div>
      )}

      {selectedMemory && (
        <div className="modal-overlay" onClick={() => setSelectedMemory(null)}>
          <div className="modal glass-strong memory-detail" onClick={e => e.stopPropagation()}>
            <div className="mem-detail-image">
              {selectedMemory.type === 'photo' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="#14b8a6"/></svg>}
              {selectedMemory.type === 'achievement' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z" fill="#f59e0b"/></svg>}
              {selectedMemory.type === 'birthday' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm6 9h-5v-2h-2v2H6c-1.66 0-3 1.34-3 3v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-1.66-1.34-3-3-3z" fill="#ec4899"/></svg>}
            </div>
            <h3>{selectedMemory.title}</h3>
            <p className="mem-detail-date">{selectedMemory.date}</p>
            <p className="mem-detail-desc">{selectedMemory.desc}</p>
            <div className="mem-participants">
              {selectedMemory.participants.map((p, i) => <span key={i} className="mem-participant">{p}</span>)}
            </div>
            <button className="modal-cancel" onClick={() => setSelectedMemory(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
