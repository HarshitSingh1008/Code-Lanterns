import type { Accent } from '@/ui/Surface';
import type { PrivacyLevel } from '@/theme/palettes';

export type { PrivacyLevel };

export type MemberRole = 'parent' | 'child' | 'elder' | 'guardian' | 'guest';

export type AIPersona = 'organizer' | 'playful-tutor' | 'patient-companion' | 'professional' | 'analyst';

export type AIProvider = 'ollama' | 'llamacpp' | 'openai-compatible' | 'cloud';

export type Device = {
  id: string;
  name: string;
  kind: 'phone' | 'tablet' | 'laptop' | 'speaker' | 'sensor';
  platform: string;
  lastSeen: number;
  trusted: boolean;
};

export type FamilyMember = {
  memberId: string;
  name: string;
  role: MemberRole;
  age: number;
  accent: Accent;
  privacyLevel: PrivacyLevel;
  persona: AIPersona;
  tagline: string;
  status: string;
  online: boolean;
  devices: Device[];
  interests: string[];
};

export type Relationship = {
  id: string;
  from: string;
  to: string;
  kind: 'parent-of' | 'child-of' | 'spouse' | 'sibling' | 'grandparent-of' | 'guardian-of' | 'cares-for';
  label: string;
};

export type LifeEventType =
  | 'birthday'
  | 'anniversary'
  | 'medical'
  | 'achievement'
  | 'memory'
  | 'appointment'
  | 'school'
  | 'trip';

export type LifeEvent = {
  id: string;
  type: LifeEventType;
  title: string;
  description: string;
  /** ISO date. */
  date: string;
  time?: string;
  recurrence?: 'none' | 'yearly' | 'weekly' | 'monthly';
  participants: string[];
  tags: string[];
  emotionalWeight: number;
  source: 'manual' | 'ai_extracted' | 'calendar_sync' | 'photo_metadata';
  location?: string;
  done?: boolean;
};

export type HealthRecordType =
  | 'condition'
  | 'medication'
  | 'allergy'
  | 'vaccination'
  | 'appointment'
  | 'vital';

export type Severity = 'info' | 'mild' | 'moderate' | 'severe' | 'critical';

export type HealthRecord = {
  id: string;
  memberId: string;
  type: HealthRecordType;
  severity: Severity;
  status: 'active' | 'resolved' | 'monitoring';
  title: string;
  details: string;
  provider?: string;
  dosage?: string;
  schedule?: string;
  nextDose?: string;
  takenToday?: boolean;
  recordedAt: string;
  sharedWith: string[];
};

export type Vital = {
  id: string;
  memberId: string;
  label: string;
  value: number;
  unit: string;
  at: string;
  status: 'good' | 'watch' | 'alert';
};

export type Transaction = {
  id: string;
  memberId: string;
  label: string;
  category: 'groceries' | 'transport' | 'health' | 'school' | 'utilities' | 'fun' | 'savings';
  amount: number;
  date: string;
  note?: string;
};

export type Budget = {
  id: string;
  category: Transaction['category'];
  limit: number;
};

export type Goal = {
  id: string;
  title: string;
  target: number;
  saved: number;
  targetDate: string;
  icon: string;
};

export type TaskCategory = 'chore' | 'errand' | 'school' | 'health' | 'social' | 'home';

export type HouseholdTask = {
  id: string;
  title: string;
  category: TaskCategory;
  assigneeId: string;
  due: string;
  points: number;
  done: boolean;
  createdBy: string;
  streak?: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type InventoryItem = {
  id: string;
  name: string;
  category: 'pantry' | 'dairy' | 'produce' | 'frozen' | 'household' | 'medicine';
  quantity: number;
  unit: string;
  lowAt: number;
  expiresInDays?: number;
  barcode: string;
  updatedAt: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  addedBy: string;
  done: boolean;
  source: 'manual' | 'low-stock' | 'ai';
};

export type Memory = {
  id: string;
  title: string;
  story: string;
  date: string;
  participants: string[];
  tags: string[];
  emotionalWeight: number;
  source: 'photo' | 'voice' | 'text' | 'import' | 'ai_extracted';
  palette: [string, string];
  privacyLevel: PrivacyLevel;
};

export type AuditEntry = {
  id: string;
  at: number;
  actor: string;
  action: string;
  target: string;
  category: 'ai' | 'access' | 'edit' | 'consent' | 'sync' | 'security';
  hash: string;
  ok: boolean;
};

export type DataCategory = 'health' | 'finance' | 'location' | 'communications' | 'biometrics' | 'memories';

export type PrivacyConfig = {
  memberId: string;
  dataCategories: Record<DataCategory, PrivacyLevel>;
  allowLocal: boolean;
  allowCloud: boolean;
  cloudConsentRequired: boolean;
  anonymizeForCloud: boolean;
  retentionDays: number;
  autoDelete: boolean;
  logAccess: boolean;
  notifyOnAccess: boolean;
};

export type AgentId =
  | 'router'
  | 'context'
  | 'privacy'
  | 'health'
  | 'finance'
  | 'home'
  | 'memory'
  | 'tasks'
  | 'medical'
  | 'privacy-guardian';

export type Citation = {
  kind: 'record' | 'event' | 'task' | 'memory' | 'transaction' | 'graph';
  refId: string;
  label: string;
  detail: string;
  version: string;
};

export type ChatAction = {
  id: string;
  label: string;
  kind: 'primary' | 'ghost' | 'tone';
  tone?: 'positive' | 'warning' | 'danger' | 'info';
  /** A redux-style intent the store can execute when tapped. */
  intent?: ChatIntent;
};

export type ChatIntent =
  | { type: 'add-reminder'; memberId: string; title: string; time: string }
  | { type: 'add-task'; title: string; assigneeId: string; category: TaskCategory; points: number }
  | { type: 'mark-medication'; recordId: string }
  | { type: 'add-memory'; title: string; story: string; participants: string[]; tags: string[] }
  | { type: 'add-shopping'; name: string; quantity: number; unit: string }
  | { type: 'navigate'; route: string }
  | { type: 'notify-guardian'; memberId: string; message: string };

export type AgentStep = { label: string; detail: string; ms: number };

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  at: number;
  agent?: AgentId;
  agentLabel?: string;
  steps?: AgentStep[];
  citations?: Citation[];
  actions?: ChatAction[];
  tier?: 1 | 2 | 3;
  status?: 'streaming' | 'done';
};

export type Session = {
  id: string;
  memberId: string;
  title: string;
  startedAt: number;
  messages: ChatMessage[];
  model: string;
  tier: 1 | 2 | 3;
};

export type FamilyOKF = {
  version: string;
  familyId: string;
  familyName: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  members: FamilyMember[];
  relationships: Relationship[];
  events: LifeEvent[];
  health: HealthRecord[];
  vitals: Vital[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  tasks: HouseholdTask[];
  inventory: InventoryItem[];
  shopping: ShoppingItem[];
  memories: Memory[];
  audit: AuditEntry[];
  privacy: Record<string, PrivacyConfig>;
};
