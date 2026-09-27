import { create } from 'zustand';
import { Role } from '../theme/roleVariants';
import { mockFamilyData } from '../data/mockData';

interface FamilyMember {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}

interface AppState {
  currentRole: Role | null;
  currentMemberId: string | null;
  familyMembers: FamilyMember[];
  tasks: any[];
  events: any[];
  memories: any[];
  expenses: any[];
  healthRecords: any[];
  isLoading: boolean;
  isDark: boolean;
  setRole: (role: Role, memberId: string) => void;
  clearRole: () => void;
  setLoading: (loading: boolean) => void;
  completeTask: (taskId: string) => void;
  toggleDark: () => void;
  addMemory: (memory: { title: string; date: string; photo: string }) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentRole: null,
  currentMemberId: null,
  familyMembers: mockFamilyData.members,
  tasks: mockFamilyData.tasks,
  events: mockFamilyData.events,
  memories: mockFamilyData.memories,
  expenses: mockFamilyData.expenses,
  healthRecords: mockFamilyData.healthRecords,
  isLoading: false,
  isDark: false,

  setRole: (role: Role, memberId: string) => set({ currentRole: role, currentMemberId: memberId }),
  clearRole: () => set({ currentRole: null, currentMemberId: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  completeTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t)),
    })),
  toggleDark: () => set((state) => ({ isDark: !state.isDark })),
  addMemory: (memory: { title: string; date: string; photo: string }) =>
    set((state) => ({
      memories: [...state.memories, { id: `mem-${Date.now()}`, ...memory, likes: 0 }],
    })),
}));
