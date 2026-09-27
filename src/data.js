export const ROLES = [
  { id: 'parent', label: 'Parent', desc: 'Full family management, budgets, health oversight', badge: 'Admin', icon: 'shield', color: '#f59e0b' },
  { id: 'child', label: 'Child', desc: 'Tasks, rewards, memories, and family connection', badge: 'Kid-Safe', icon: 'toy', color: '#14b8a6' },
  { id: 'elder', label: 'Elder', desc: 'Simplified UI, health reminders, family messaging', badge: 'Easy Access', icon: 'heart', color: '#818cf8' },
  { id: 'guardian', label: 'Guardian', desc: 'Co-parenting with shared permissions', badge: 'Co-Manager', icon: 'verified', color: '#34d399' },
  { id: 'staff', label: 'Staff', desc: 'House help, driver - limited task access', badge: 'Limited', icon: 'badge', color: '#94a3b8' },
  { id: 'doctor', label: 'Family Doctor', desc: 'Health records access, prescriptions, advice', badge: 'Medical', icon: 'medical', color: '#ec4899' },
  { id: 'guest', label: 'Guest', desc: 'Temporary access for visitors', badge: 'Limited', icon: 'meeting', color: '#64748b' },
];

export const FAMILY_MEMBERS = [
  { id: 'sarah', name: 'Sarah', role: 'parent', status: 'At Home', activity: 'Managing household', avatar: 'S', color: '#f59e0b', online: true },
  { id: 'david', name: 'David', role: 'parent', status: 'At Office', activity: 'Work meeting until 5 PM', avatar: 'D', color: '#6366f1', online: true },
  { id: 'leo', name: 'Leo', role: 'child', age: 10, status: 'Soccer Practice', activity: 'Practice at 4:30 PM', avatar: 'L', color: '#14b8a6', online: true },
  { id: 'maya', name: 'Maya', role: 'child', age: 7, status: 'School', activity: 'Art class today', avatar: 'M', color: '#ec4899', online: true },
  { id: 'elena', name: 'Grandma Elena', role: 'elder', status: 'At Home', activity: 'Resting', avatar: 'E', color: '#818cf8', online: false },
  { id: 'rosa', name: 'Rosa', role: 'staff', status: 'Working', activity: 'Cleaning - Kitchen', avatar: 'R', color: '#94a3b8', online: true },
  { id: 'james', name: 'James', role: 'staff', status: 'On Duty', activity: 'Driving - Available', avatar: 'J', color: '#64748b', online: true },
];

export const HEALTH_DATA = [
  { member: 'Maya', type: 'allergy', title: 'Dairy Allergy', detail: 'Inhaler reminder at 12:00 PM', severity: 'moderate', status: 'Due soon' },
  { member: 'Grandma Elena', type: 'vital', title: 'Heart Rate', detail: '72 bpm - Normal', severity: 'info', status: 'Normal' },
  { member: 'Grandma Elena', type: 'medication', title: 'Morning BP Meds', detail: 'Lisinopril 10mg', severity: 'info', status: 'Taken' },
  { member: 'Leo', type: 'vital', title: 'Activity', detail: '6,240 steps today', severity: 'info', status: 'Active' },
  { member: 'David', type: 'prescription', title: 'Vitamin D3', detail: '2000 IU daily', severity: 'info', status: 'Active' },
];

export const PRESCRIPTIONS = [
  { id: 1, member: 'Grandma Elena', medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribedBy: 'Dr. Smith', startDate: '2024-01-15', refillDate: '2026-10-15', status: 'active' },
  { id: 2, member: 'Grandma Elena', medication: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribedBy: 'Dr. Smith', startDate: '2024-03-01', refillDate: '2026-10-01', status: 'active' },
  { id: 3, member: 'Maya', medication: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'As needed', prescribedBy: 'Dr. Johnson', startDate: '2025-06-01', refillDate: '2026-12-01', status: 'active' },
  { id: 4, member: 'David', medication: 'Vitamin D3', dosage: '2000 IU', frequency: 'Once daily', prescribedBy: 'Dr. Smith', startDate: '2025-01-01', refillDate: '2026-12-31', status: 'active' },
];

export const FINANCE_DATA = {
  budget: 6000,
  spent: 4280,
  categories: [
    { name: 'Groceries', amount: 142.50, budget: 600, color: '#14b8a6' },
    { name: 'Utilities', amount: 285.00, budget: 400, color: '#6366f1' },
    { name: 'Activities', amount: 65.00, budget: 200, color: '#f59e0b' },
    { name: 'Healthcare', amount: 120.00, budget: 300, color: '#ec4899' },
  ],
  insight: 'On track to save $450 this month',
};

export const GROCERY_ITEMS = [
  { id: 1, name: 'Milk (Almond)', category: 'Dairy', price: 4.99, quantity: 2, addedBy: 'Sarah', status: 'pending' },
  { id: 2, name: 'Bread', category: 'Bakery', price: 3.49, quantity: 1, addedBy: 'David', status: 'purchased' },
  { id: 3, name: 'Chicken Breast', category: 'Meat', price: 12.99, quantity: 2, addedBy: 'Sarah', status: 'pending' },
  { id: 4, name: 'Apples', category: 'Produce', price: 5.99, quantity: 1, addedBy: 'Maya', status: 'pending' },
  { id: 5, name: 'Rice', category: 'Pantry', price: 8.99, quantity: 1, addedBy: 'Leo', status: 'purchased' },
  { id: 6, name: 'Olive Oil', category: 'Pantry', price: 9.99, quantity: 1, addedBy: 'Sarah', status: 'pending' },
];

export const POCKET_MONEY = [
  { member: 'Leo', weekly: 10, spent: 4.50, savings: 25.00, chores: ['Empty dishwasher', 'Make bed', 'Feed pet'] },
  { member: 'Maya', weekly: 8, spent: 3.25, savings: 18.50, chores: ['Water plants', 'Tidy room', 'Set table'] },
];

export const TASKS = [
  { id: 1, title: "Prep Leo's soccer kit", assignee: 'Sarah', done: true, points: 10, category: 'chore' },
  { id: 2, title: 'Empty dishwasher', assignee: 'Leo', done: false, points: 20, category: 'chore' },
  { id: 3, title: 'Pick up Maya at 3:15 PM', assignee: 'David', done: false, points: 15, category: 'pickup' },
  { id: 4, title: 'Water the plants', assignee: 'Maya', done: false, points: 10, category: 'chore' },
  { id: 5, title: 'Call plumber for kitchen sink', assignee: 'David', done: false, points: 25, category: 'maintenance' },
  { id: 6, title: 'Vacuum living room', assignee: 'Rosa', done: false, points: 15, category: 'cleaning' },
  { id: 7, title: 'Grocery shopping', assignee: 'Rosa', done: false, points: 20, category: 'errand' },
];

export const EVENTS = [
  { id: 1, title: "Leo's Soccer Practice", time: '6:00 PM', type: 'activity', date: 'Today', icon: 'soccer' },
  { id: 2, title: "Maya's Pediatrician", time: '10:30 AM', type: 'medical', date: 'Tomorrow', icon: 'medical' },
  { id: 3, title: "Maya's 8th Birthday", time: 'All Day', type: 'birthday', date: 'Saturday', icon: 'birthday' },
  { id: 4, title: 'Family Dinner', time: '7:00 PM', type: 'family', date: 'Today', icon: 'dinner' },
  { id: 5, title: 'Grocery Run', time: '5:00 PM', type: 'errand', date: 'Today', icon: 'shopping' },
];

export const MEMORIES = [
  { id: 1, title: 'Beach Vacation 2024', date: 'Aug 15, 2024', type: 'photo', desc: 'Family trip to the coast', participants: ['Sarah', 'David', 'Leo', 'Maya'] },
  { id: 2, title: "Leo's First Goal", date: 'Sep 2, 2024', type: 'achievement', desc: 'Scored in soccer tournament', participants: ['Leo', 'David'] },
  { id: 3, title: 'Grandma Elena\'s 80th', date: 'Jul 20, 2024', type: 'birthday', desc: 'Surprise birthday party', participants: ['All'] },
  { id: 4, title: 'Maya\'s Art Show', date: 'Jun 10, 2024', type: 'achievement', desc: 'First place in school art contest', participants: ['Maya', 'Sarah'] },
];

export const AI_SUGGESTIONS = [
  'Plan vacation budget',
  'Is this headache serious?',
  "What's for dinner?",
  'Chore schedule check',
  'Medication reminders',
];

export const NOTIFICATIONS = [
  { id: 1, title: 'Task Due', message: "Leo's soccer practice at 6:00 PM", time: '5 min ago', type: 'task', read: false },
  { id: 2, title: 'Medication Reminder', message: 'Maya\'s inhaler at 12:00 PM', time: '30 min ago', type: 'health', read: false },
  { id: 3, title: 'Budget Alert', message: 'Groceries budget 70% used', time: '1 hour ago', type: 'finance', read: true },
  { id: 4, title: 'New Memory', message: 'Sarah added a new memory', time: '2 hours ago', type: 'memory', read: true },
];

export const CHILD_TRACKING = [
  { member: 'Leo', location: 'Soccer Field', status: 'Safe', lastUpdate: '2 min ago', battery: 85 },
  { member: 'Maya', location: 'School', status: 'Safe', lastUpdate: '5 min ago', battery: 92 },
];

export const THEMES = [
  { id: 'midnight', name: 'Midnight', primary: '#14b8a6', bg: '#0b1326', surface: '#131b2e' },
  { id: 'ocean', name: 'Ocean', primary: '#0ea5e9', bg: '#0c1220', surface: '#151d30' },
  { id: 'forest', name: 'Forest', primary: '#22c55e', bg: '#0a1a12', surface: '#122618' },
  { id: 'sunset', name: 'Sunset', primary: '#f97316', bg: '#1a0f0a', surface: '#2a1a10' },
  { id: 'lavender', name: 'Lavender', primary: '#a78bfa', bg: '#120e1a', surface: '#1e1830' },
  { id: 'rose', name: 'Rose', primary: '#fb7185', bg: '#1a0a10', surface: '#2a1218' },
];
