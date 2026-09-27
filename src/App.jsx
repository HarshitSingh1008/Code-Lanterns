import { useState, useEffect } from 'react'
import RoleSelection from './components/RoleSelection'
import Dashboard from './components/Dashboard'
import ChatScreen from './components/ChatScreen'
import CalendarScreen from './components/CalendarScreen'
import MemoriesScreen from './components/MemoriesScreen'
import BudgetScreen from './components/BudgetScreen'
import HealthScreen from './components/HealthScreen'
import NotificationsScreen from './components/NotificationsScreen'
import ChildTrackingScreen from './components/ChildTrackingScreen'
import SettingsScreen from './components/SettingsScreen'
import BottomNav from './components/BottomNav'
import './App.css'

export default function App() {
  const [role, setRole] = useState(null)
  const [activeScreen, setActiveScreen] = useState('home')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('fnx_role')
    if (saved) setRole(saved)
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  const handleRoleSelect = (roleId) => {
    setRole(roleId)
    localStorage.setItem('fnx_role', roleId)
  }

  const handleSwitchRole = () => {
    setRole(null)
    localStorage.removeItem('fnx_role')
  }

  if (isLoading) return <SplashScreen />
  if (!role) return <RoleSelection onSelect={handleRoleSelect} />

  return (
    <div className="app-container">
      <div className="app-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div className="app-content">
        {activeScreen === 'home' && <Dashboard role={role} onNavigate={setActiveScreen} />}
        {activeScreen === 'chat' && <ChatScreen role={role} />}
        {activeScreen === 'calendar' && <CalendarScreen />}
        {activeScreen === 'budget' && <BudgetScreen />}
        {activeScreen === 'health' && <HealthScreen />}
        {activeScreen === 'memories' && <MemoriesScreen />}
        {activeScreen === 'tracking' && <ChildTrackingScreen />}
        {activeScreen === 'notifications' && <NotificationsScreen />}
        {activeScreen === 'settings' && <SettingsScreen role={role} onSwitchRole={handleSwitchRole} />}
      </div>

      <BottomNav active={activeScreen} onChange={setActiveScreen} />
    </div>
  )
}

function SplashScreen() {
  return (
    <div className="splash">
      <div className="splash-logo">
        <div className="splash-orb" />
        <h1>Family Nexus AI</h1>
        <p>Your family's intelligent companion</p>
      </div>
      <div className="splash-loader">
        <div className="loader-bar" />
      </div>
    </div>
  )
}
