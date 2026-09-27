import { createContext, useContext, useState, useCallback } from 'react'
import { FAMILY_MEMBERS, TASKS, EVENTS, GROCERY_ITEMS, POCKET_MONEY, MEMORIES, NOTIFICATIONS, PRESCRIPTIONS, CHILD_TRACKING } from '../data'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(TASKS)
  const [events, setEvents] = useState(EVENTS)
  const [groceries, setGroceries] = useState(GROCERY_ITEMS)
  const [pocketMoney, setPocketMoney] = useState(POCKET_MONEY)
  const [memories, setMemories] = useState(MEMORIES)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [prescriptions] = useState(PRESCRIPTIONS)
  const [childTracking] = useState(CHILD_TRACKING)

  const addTask = useCallback((task) => {
    setTasks(prev => [...prev, { ...task, id: Date.now(), done: false }])
  }, [])

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [])

  const addEvent = useCallback((event) => {
    setEvents(prev => [...prev, { ...event, id: Date.now() }])
  }, [])

  const addGrocery = useCallback((item) => {
    setGroceries(prev => [...prev, { ...item, id: Date.now(), status: 'pending' }])
  }, [])

  const toggleGrocery = useCallback((id) => {
    setGroceries(prev => prev.map(g => g.id === id ? { ...g, status: g.status === 'pending' ? 'purchased' : 'pending' } : g))
  }, [])

  const addMemory = useCallback((memory) => {
    setMemories(prev => [...prev, { ...memory, id: Date.now() }])
  }, [])

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const addNotification = useCallback((notif) => {
    setNotifications(prev => [{ ...notif, id: Date.now(), read: false }, ...prev])
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const value = {
    members: FAMILY_MEMBERS,
    tasks, addTask, toggleTask,
    events, addEvent,
    groceries, addGrocery, toggleGrocery,
    pocketMoney, setPocketMoney,
    memories, addMemory,
    notifications, markNotificationRead, addNotification, unreadCount,
    prescriptions, childTracking,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
