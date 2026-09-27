import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { buildSeed } from './seed';
import type {
  AuditEntry,
  ChatMessage,
  ChatIntent,
  DataCategory,
  FamilyMember,
  FamilyOKF,
  HouseholdTask,
  LifeEvent,
  Memory,
  PrivacyConfig,
  PrivacyLevel,
  ShoppingItem,
  TaskCategory,
} from './types';
import { isoAt } from '@/lib/date';

const KEY = 'nexus.okf.v1';

/**
 * Persistence is always available on iOS/Android, where AsyncStorage uses the
 * native module. On web it needs a real localStorage, which is absent while
 * static rendering happens on the server, so skip it there.
 */
function canPersist() {
  return Platform.OS !== 'web' || typeof window !== 'undefined';
}

function hash(seed: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export type State = {
  okf: FamilyOKF;
  loading: boolean;
  hydrated: boolean;
  activeMemberId: string;
  memberId: string;
  sessionId: string;
  sessions: Record<string, ChatMessage[]>;
  pinned: string[];
  activeTab: string;
  graphFocus: string | null;
  memoryFilter: string;
  taskFilter: string;
  taskDay: string;
  toasts: { id: string; text: string; tone: 'ok' | 'warn' | 'info' }[];
};

const initial: State = {
  okf: buildSeed(),
  loading: true,
  hydrated: false,
  activeMemberId: 'm_maya',
  memberId: 'm_maya',
  sessionId: 's_default',
  sessions: {},
  pinned: ['m1', 'm5', 'm3'],
  activeTab: 'home',
  graphFocus: null,
  memoryFilter: 'all',
  taskFilter: 'all',
  taskDay: '0',
  toasts: [],
};

let counter = 0;
export function uid(prefix: string) {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}

export function member(okf: FamilyOKF, id: string): FamilyMember {
  const found = okf.members.find((m) => m.memberId === id);
  if (found) return found;
  const family = okf.members[0];
  return { ...family, memberId: id, name: id === 'family' ? 'Family' : family.name, role: id === 'family' ? 'parent' : family.role };
}

export function activeMember(s: State): FamilyMember {
  return member(s.okf, s.memberId);
}

export function pushAudit(
  okf: FamilyOKF,
  entry: { actor: string; action: string; target: string; category: AuditEntry['category']; ok?: boolean }
): AuditEntry[] {
  const id = uid('a');
  return [
    {
      id,
      at: Date.now(),
      actor: entry.actor,
      action: entry.action,
      target: entry.target,
      category: entry.category,
      hash: hash(id),
      ok: entry.ok ?? true,
    },
    ...okf.audit,
  ].slice(0, 220);
}

export function canSee(level: PrivacyLevel, viewer: FamilyMember, subject: PrivacyConfig | undefined) {
  if (!subject) return true;
  if (subject.memberId === viewer.memberId) return true;
  if (viewer.role === 'parent' || viewer.role === 'guardian') return level !== 'private';
  if (level === 'private') return false;
  if (viewer.role === 'elder') return true;
  return level === 'family' || level === 'guardians';
}

export type Action =
  | { type: 'hydrate' }
  | { type: 'setMember'; memberId: string }
  | { type: 'setTab'; tab: string }
  | { type: 'setRoute'; route: string }
  | { type: 'pushToast'; text: string; tone?: 'ok' | 'warn' | 'info' }
  | { type: 'dismissToast'; id: string }
  | { type: 'ask'; text: string }
  | { type: 'pushMessage'; message: ChatMessage }
  | { type: 'updateMessage'; id: string; patch: Partial<ChatMessage> }
  | { type: 'newSession' }
  | { type: 'toggleTask'; id: string }
  | { type: 'addTask'; task: Partial<HouseholdTask> }
  | { type: 'toggleMed'; id: string }
  | { type: 'toggleShopping'; id: string }
  | { type: 'addShopping'; name: string; quantity: number; unit: string }
  | { type: 'clearShopping' }
  | { type: 'addEvent'; event: Partial<LifeEvent> }
  | { type: 'toggleEvent'; id: string }
  | { type: 'addMemory'; memory: Partial<Memory> }
  | { type: 'pinMemory'; id: string }
  | { type: 'setMemoryFilter'; value: string }
  | { type: 'setTaskFilter'; value: string }
  | { type: 'setTaskDay'; value: string }
  | { type: 'setGraphFocus'; memberId: string | null }
  | { type: 'setPrivacy'; memberId: string; patch: Partial<PrivacyConfig> }
  | { type: 'setCategory'; memberId: string; category: DataCategory; level: PrivacyLevel }
  | { type: 'renameMember'; memberId: string; name: string }
  | { type: 'reset' }
  | { type: 'applyIntent'; intent: ChatIntent };

function log(s: State, action: string, target: string, category: AuditEntry['category'], actor = s.memberId) {
  return {
    ...s,
    okf: { ...s.okf, audit: pushAudit(s.okf, { actor, action, target, category }) },
  };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, loading: false, hydrated: true };

    case 'setMember':
      return log({ ...state, memberId: action.memberId, activeMemberId: action.memberId }, 'Switched profile', action.memberId, 'access');

    case 'setTab':
      return { ...state, activeTab: action.tab };

    case 'pushToast': {
      const id = uid('toast');
      const toasts = [...state.toasts, { id, text: action.text, tone: action.tone ?? 'ok' }].slice(-3);
      setTimeout(() => dispatch({ type: 'dismissToast', id }), 3200);
      return { ...state, toasts };
    }

    case 'dismissToast':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    case 'pushMessage':
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [state.sessionId]: [...(state.sessions[state.sessionId] ?? []), action.message],
        },
      };

    case 'updateMessage': {
      const list = state.sessions[state.sessionId] ?? [];
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [state.sessionId]: list.map((m) => (m.id === action.id ? { ...m, ...action.patch } : m)),
        },
      };
    }

    case 'newSession':
      return { ...state, sessionId: uid('s') };

    case 'toggleTask': {
      const task = state.okf.tasks.find((t) => t.id === action.id);
      if (!task) return state;
      const tasks = state.okf.tasks.map((t) =>
        t.id === action.id ? { ...t, done: !t.done, streak: t.done ? Math.max(0, (t.streak ?? 0) - 1) : (t.streak ?? 0) + 1 } : t
      );
      const next = log(
        { ...state, okf: { ...state.okf, tasks } },
        task.done ? 'Un-completed a task' : 'Completed a task',
        task.title,
        'edit'
      );
      if (!task.done) {
        return {
          ...next,
          toasts: [
            ...state.toasts,
            { id: uid('toast'), text: `+${task.points} points for ${member(state.okf, task.assigneeId).name.split(' ')[0]}`, tone: 'ok' },
          ],
        };
      }
      return next;
    }

    case 'addTask': {
      const task: HouseholdTask = {
        id: uid('t'),
        title: action.task.title ?? 'New task',
        category: (action.task.category as TaskCategory) ?? 'chore',
        assigneeId: action.task.assigneeId ?? state.memberId,
        due: action.task.due ?? isoAt(0, '18:00'),
        points: action.task.points ?? 10,
        done: false,
        createdBy: state.memberId,
        difficulty: action.task.difficulty ?? 'easy',
        streak: 0,
      };
      return log(
        { ...state, okf: { ...state.okf, tasks: [task, ...state.okf.tasks] } },
        'Created a task',
        task.title,
        'edit'
      );
    }

    case 'toggleMed': {
      const rec = state.okf.health.find((h) => h.id === action.id);
      if (!rec) return state;
      const health = state.okf.health.map((h) => (h.id === action.id ? { ...h, takenToday: !h.takenToday } : h));
      return log(
        { ...state, okf: { ...state.okf, health } },
        rec.takenToday ? 'Logged a missed dose' : 'Logged a dose',
        rec.title,
        'edit'
      );
    }

    case 'toggleShopping': {
      const item = state.okf.shopping.find((s) => s.id === action.id);
      if (!item) return state;
      const shopping = state.okf.shopping.map((s) => (s.id === action.id ? { ...s, done: !s.done } : s));
      return log({ ...state, okf: { ...state.okf, shopping } }, 'Shopping list updated', item.name, 'sync');
    }

    case 'addShopping': {
      const item: ShoppingItem = {
        id: uid('s'),
        name: action.name,
        quantity: action.quantity,
        unit: action.unit,
        addedBy: state.memberId,
        done: false,
        source: 'manual',
      };
      return log({ ...state, okf: { ...state.okf, shopping: [item, ...state.okf.shopping] } }, 'Added to shopping list', item.name, 'edit');
    }

    case 'clearShopping': {
      const done = state.okf.shopping.filter((s) => s.done).length;
      if (!done) return state;
      return log(
        { ...state, okf: { ...state.okf, shopping: state.okf.shopping.filter((s) => !s.done) } },
        'Cleared the shopping list',
        `${done} items ticked off`,
        'sync'
      );
    }

    case 'addEvent': {
      const event: LifeEvent = {
        id: uid('e'),
        type: (action.event.type as LifeEvent['type']) ?? 'appointment',
        title: action.event.title ?? 'New event',
        description: action.event.description ?? '',
        date: action.event.date ?? isoAt(1, '09:00'),
        time: action.event.time,
        participants: action.event.participants ?? [state.memberId],
        tags: action.event.tags ?? [],
        emotionalWeight: 0.4,
        source: 'manual',
      };
      return log({ ...state, okf: { ...state.okf, events: [event, ...state.okf.events] } }, 'Added an event', event.title, 'edit');
    }

    case 'toggleEvent': {
      const ev = state.okf.events.find((e) => e.id === action.id);
      if (!ev) return state;
      const events = state.okf.events.map((e) => (e.id === action.id ? { ...e, done: !e.done } : e));
      return log({ ...state, okf: { ...state.okf, events } }, 'Marked an event', ev.title, 'edit');
    }

    case 'addMemory': {
      const memory: Memory = {
        id: uid('m'),
        title: action.memory.title ?? 'Untitled memory',
        story: action.memory.story ?? '',
        date: action.memory.date ?? new Date().toISOString(),
        participants: action.memory.participants ?? [state.memberId],
        tags: action.memory.tags ?? [],
        emotionalWeight: action.memory.emotionalWeight ?? 0.6,
        source: 'text',
        palette: ['periwinkle', 'tertiary'],
        privacyLevel: 'family',
      };
      return log({ ...state, okf: { ...state.okf, memories: [memory, ...state.okf.memories] }, pinned: [memory.id, ...state.pinned] }, 'Added a memory', memory.title, 'edit');
    }

    case 'pinMemory': {
      const on = state.pinned.includes(action.id);
      return {
        ...state,
        pinned: on ? state.pinned.filter((p) => p !== action.id) : [...state.pinned, action.id],
      };
    }

    case 'setMemoryFilter':
      return { ...state, memoryFilter: action.value };

    case 'setTaskFilter':
      return { ...state, taskFilter: action.value };

    case 'setTaskDay':
      return { ...state, taskDay: action.value };

    case 'setGraphFocus': {
      const who = action.memberId ? member(state.okf, action.memberId).name : 'the whole family';
      return log({ ...state, graphFocus: action.memberId }, 'Focused the OKF graph on', who, 'access');
    }

    case 'setPrivacy': {
      const current = state.okf.privacy[action.memberId] ?? state.okf.privacy.m_maya;
      const privacy = { ...state.okf.privacy, [action.memberId]: { ...current, ...action.patch, memberId: action.memberId } };
      const updated = log({ ...state, okf: { ...state.okf, privacy } }, 'Changed a privacy setting', member(state.okf, action.memberId).name, 'consent');
      return updated;
    }

    case 'setCategory': {
      const current = state.okf.privacy[action.memberId] ?? state.okf.privacy.m_maya;
      const dataCategories = { ...current.dataCategories, [action.category]: action.level };
      return {
        ...log({ ...state, okf: { ...state.okf, privacy: { ...state.okf.privacy, [action.memberId]: { ...current, dataCategories } } } },
          'Changed data visibility', `${member(state.okf, action.memberId).name} · ${action.category}`, 'consent'),
      };
    }

    case 'renameMember': {
      const members = state.okf.members.map((m) => (m.memberId === action.memberId ? { ...m, name: action.name } : m));
      return log({ ...state, okf: { ...state.okf, members } }, 'Renamed a member', action.name, 'edit');
    }

    case 'applyIntent': {
      const i = action.intent;
      switch (i.type) {
        case 'add-reminder':
          return reducer(
            state,
            { type: 'addEvent', event: { type: 'appointment', title: i.title, description: 'Added by the Nexus assistant.', date: isoAt(0, i.time), participants: [i.memberId] } }
          );
        case 'add-task':
          return reducer(state, { type: 'addTask', task: { title: i.title, assigneeId: i.assigneeId, category: i.category, points: i.points } });
        case 'mark-medication':
          return reducer(state, { type: 'toggleMed', id: i.recordId });
        case 'add-memory':
          return reducer(state, { type: 'addMemory', memory: { title: i.title, story: i.story, participants: i.participants, tags: i.tags } });
        case 'add-shopping':
          return reducer(state, { type: 'addShopping', name: i.name, quantity: i.quantity, unit: i.unit });
        case 'navigate':
          return { ...state, activeTab: i.route };
        case 'notify-guardian':
          return { ...state, toasts: [...state.toasts, { id: uid('toast'), text: `Guardian notified: ${i.message}`, tone: 'warn' }] };
        default:
          return state;
      }
    }

    case 'reset': {
      const fresh = buildSeed();
      return { ...initial, okf: fresh, loading: false, hydrated: true, activeMemberId: 'm_maya', memberId: 'm_maya' };
    }

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/* Store plumbing                                                      */
/* ------------------------------------------------------------------ */

type Listener = () => void;

let current: State = initial;
const listeners = new Set<Listener>();

export function getState() {
  return current;
}

export function dispatch(action: Action) {
  current = reducer(current, action);
  listeners.forEach((l) => l());
  if (canPersist()) {
    const { okf, activeMemberId, sessions, sessionId, pinned } = current;
    void AsyncStorage.setItem(
      KEY,
      JSON.stringify({ okf, activeMemberId, sessions, sessionId, pinned })
    );
  }
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function hydrate() {
  if (!canPersist()) {
    current = { ...current, loading: false, hydrated: true };
    listeners.forEach((l) => l());
    return;
  }
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Pick<State, 'okf' | 'activeMemberId' | 'sessions' | 'sessionId' | 'pinned'>;
      if (parsed.okf?.members?.length) {
        current = { ...current, ...parsed, loading: false, hydrated: true };
      } else {
        current = { ...current, loading: false, hydrated: true };
      }
    } else {
      current = { ...current, loading: false, hydrated: true };
    }
  } catch {
    current = { ...current, loading: false, hydrated: true };
  }
  listeners.forEach((l) => l());
}

export async function wipe() {
  if (canPersist()) await AsyncStorage.removeItem(KEY);
  current = { ...initial, okf: buildSeed(), loading: false, hydrated: true };
  listeners.forEach((l) => l());
}

export type { ChatMessage };
