import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { askGrok } from '../ai/grok'
import { AI_SUGGESTIONS } from '../data'
import './ChatScreen.css'

export default function ChatScreen({ role }) {
  const { members, tasks, events, groceries, pocketMoney, prescriptions } = useApp()
  const [messages, setMessages] = useState([
    { id: 1, from: 'ai', text: "Hello! I'm Nexus AI, your family assistant. I have full access to your family data - health records, budgets, tasks, calendar, and more. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), from: 'user', text: text.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const context = `Family members: ${members.map(m => `${m.name} (${m.role})`).join(', ')}. Pending tasks: ${tasks.filter(t => !t.done).map(t => t.title).join(', ')}. Upcoming events: ${events.map(e => e.title).join(', ')}. Grocery items: ${groceries.map(g => g.name).join(', ')}. Prescriptions: ${prescriptions.map(p => `${p.member}: ${p.medication} ${p.dosage}`).join('; ')}.`

    const response = await askGrok(text, context)

    const aiMsg = { id: Date.now() + 1, from: 'ai', text: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => [...prev, aiMsg])
    setIsTyping(false)
  }

  return (
    <div className="chat-screen animate-fade-in">
      <div className="chat-header glass-strong">
        <div className="chat-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#14b8a6"/></svg>
          <div className="chat-status-dot" />
        </div>
        <div className="chat-header-info">
          <h2>Nexus AI</h2>
          <span>Online - Grok Powered</span>
        </div>
        <button className="chat-voice-btn" onClick={() => sendMessage('What are the top 3 priority tasks for today?')} title="Quick summary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" fill="currentColor"/></svg>
        </button>
      </div>

      <div className="suggestions-row">
        {AI_SUGGESTIONS.map((s, i) => (
          <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
        ))}
      </div>

      <div className="chat-messages" ref={chatRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`message-row ${msg.from}`}>
            {msg.from === 'ai' && <div className="msg-avatar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#14b8a6"/></svg></div>}
            <div className={`message-bubble ${msg.from}`}>
              <p>{msg.text}</p>
              <span className="msg-time">{msg.time}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-row ai">
            <div className="msg-avatar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#14b8a6"/></svg></div>
            <div className="typing-indicator"><div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" /></div>
          </div>
        )}
      </div>

      <div className="chat-input-bar glass-strong">
        <button className="input-action" onClick={() => sendMessage('Show me the family budget summary')} title="Budget">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="currentColor"/></svg>
        </button>
        <input type="text" placeholder="Ask Nexus anything about your family..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)} />
        <button className="input-action" onClick={() => sendMessage('Any health reminders today?')} title="Health">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg>
        </button>
        <button className="send-btn" onClick={() => sendMessage(input)} title="Send">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#003731"/></svg>
        </button>
      </div>
    </div>
  )
}
