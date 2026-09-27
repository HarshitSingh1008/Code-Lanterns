export const mockFamilyData = {
  members: [
    { id: 'parent-1', name: 'Mom', role: 'parent' as const, avatar: '👩' },
    { id: 'parent-2', name: 'Dad', role: 'parent' as const, avatar: '👨' },
    { id: 'child-1', name: 'Emma', role: 'child' as const, avatar: '👧' },
    { id: 'child-2', name: 'Liam', role: 'child' as const, avatar: '👦' },
    { id: 'elder-1', name: 'Grandma', role: 'elder' as const, avatar: '👵' },
    { id: 'guardian-1', name: 'Aunt Sarah', role: 'guardian' as const, avatar: '👩‍💼' },
    { id: 'guest-1', name: 'Family Friend', role: 'guest' as const, avatar: '👤' },
  ],
  tasks: [
    { id: 'task-1', title: 'Clean kitchen', assignee: 'Emma', status: 'pending' as const, priority: 'medium' as const, dueDate: 'Today' },
    { id: 'task-2', title: 'Take out trash', assignee: 'Liam', status: 'completed' as const, priority: 'low' as const, dueDate: 'Today' },
    { id: 'task-3', title: 'Grocery shopping', assignee: 'Mom', status: 'pending' as const, priority: 'high' as const, dueDate: 'Tomorrow' },
    { id: 'task-4', title: 'Walk the dog', assignee: 'Emma', status: 'pending' as const, priority: 'medium' as const, dueDate: 'Today' },
    { id: 'task-5', title: 'Help with homework', assignee: 'Dad', status: 'pending' as const, priority: 'high' as const, dueDate: 'Today' },
    { id: 'task-6', title: 'Water plants', assignee: 'Grandma', status: 'completed' as const, priority: 'low' as const, dueDate: 'Yesterday' },
  ],
  events: [
    { id: 'evt-1', title: 'Emma\'s Recital', date: '2026-09-28', time: '6:00 PM', type: 'achievement' as const },
    { id: 'evt-2', title: 'Family Dinner', date: '2026-09-27', time: '7:00 PM', type: 'family' as const },
    { id: 'evt-3', title: 'Grandma\'s Birthday', date: '2026-10-05', time: 'All day', type: 'birthday' as const },
    { id: 'evt-4', title: 'Doctor Appointment', date: '2026-09-30', time: '10:00 AM', type: 'medical' as const },
  ],
  memories: [
    { id: 'mem-1', title: 'Beach Trip 2026', date: 'July 2026', photo: '🏖️', likes: 12 },
    { id: 'mem-2', title: 'Emma\'s First Day', date: 'Sep 2026', photo: '🎒', likes: 8 },
    { id: 'mem-3', title: 'Grandma\'s 80th', date: 'Oct 2025', photo: '🎂', likes: 24 },
  ],
  expenses: [
    { id: 'exp-1', category: 'Groceries', amount: 125.50, date: '2026-09-26', paidBy: 'Mom' },
    { id: 'exp-2', category: 'Utilities', amount: 89.00, date: '2026-09-25', paidBy: 'Dad' },
    { id: 'exp-3', category: 'Entertainment', amount: 45.00, date: '2026-09-24', paidBy: 'Mom' },
    { id: 'exp-4', category: 'Transport', amount: 60.00, date: '2026-09-23', paidBy: 'Dad' },
  ],
  healthRecords: [
    { id: 'health-1', member: 'Grandma', type: 'checkup', date: '2026-09-20', status: 'completed' },
    { id: 'health-2', member: 'Emma', type: 'vaccination', date: '2026-10-15', status: 'upcoming' },
    { id: 'health-3', member: 'Dad', type: 'checkup', date: '2026-11-01', status: 'upcoming' },
  ],
};
