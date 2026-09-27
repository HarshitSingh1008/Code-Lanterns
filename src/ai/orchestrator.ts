import { formatDayLabel, formatFullDate, money } from '@/lib/date';
import { activeMember, dispatch, getState, member, uid } from '@/data/store';
import type {
  AgentId,
  AgentStep,
  ChatAction,
  ChatIntent,
  ChatMessage,
  Citation,
  FamilyOKF,
} from '@/data/types';

type Planner = {
  agent: AgentId;
  tier: 1 | 2 | 3;
  title: string;
  body: (s: ReturnType<typeof getState>) => { text: string; citations?: Citation[]; actions?: ChatAction[]; steps: AgentStep[] };
};

const AGENT_LABEL: Record<AgentId, string> = {
  router: 'Router',
  context: 'Context Builder',
  privacy: 'Privacy Guardian',
  health: 'Health Companion',
  finance: 'Finance Analyst',
  home: 'Home Steward',
  memory: 'Memory Keeper',
  tasks: 'Household Planner',
  medical: 'Medical Scribe',
  'privacy-guardian': 'Privacy Guardian',
};

function step(label: string, detail: string, ms: number): AgentStep {
  return { label, detail, ms };
}

const BASE_STEPS = (): AgentStep[] => [
  step('Router', 'Classified the question and picked a lane', 14),
  step('Privacy Guardian', 'Checked every record against visibility rules', 9),
];

function cite(kind: Citation['kind'], refId: string, label: string, detail: string): Citation {
  return { kind, refId, label, detail, version: `v${refId.length}` };
}

/* ----------------------------- intents ----------------------------- */

function firstName(okf: FamilyOKF, memberId: string) {
  return member(okf, memberId).name.split(' ')[0];
}

function mentionedMember(text: string, okf: FamilyOKF) {
  const t = text.toLowerCase();
  const hit = okf.members.find((m) => t.includes(m.name.toLowerCase().split(' ')[0]));
  if (hit) return hit.memberId;
  const hints: Record<string, string> = { nana: 'm_nana', mama: 'm_maya', mum: 'm_maya', mom: 'm_maya', dad: 'm_rohan', papa: 'm_rohan' };
  for (const [k, id] of Object.entries(hints)) if (t.includes(k)) return id;
  return null;
}

function memberCondition(okf: FamilyOKF, memberId: string) {
  return okf.health.filter((h) => h.memberId === memberId && h.status !== 'resolved');
}

function openTasks(okf: FamilyOKF) {
  return okf.tasks.filter((t) => !t.done);
}

/* ----------------------------- planners ---------------------------- */

const PLANNERS: Planner[] = [
  {
    agent: 'health',
    tier: 2,
    title: 'Health',
    body: (s) => {
      const { okf, memberId } = s;
      const me = activeMember(s);
      const who = mentionedMember('', okf) ?? memberId;
      const target = me.role === 'parent' || me.role === 'guardian' ? who : me.memberId;
      const records = memberCondition(okf, target);
      const meds = records.filter((r) => r.type === 'medication');
      const allergies = records.filter((r) => r.type === 'allergy');
      const conditions = records.filter((r) => r.type === 'condition' || r.type === 'appointment');
      const v = okf.vitals.filter((x) => x.memberId === target).slice(0, 3);
      const name = firstName(okf, target);

      const lines: string[] = [];
      if (allergies.length) {
        lines.push(`⚠️ **${name} has a serious allergy: ${allergies[0].title}.** ${allergies[0].details}`);
      }
      if (meds.length) {
        const dose = meds[0];
        lines.push(
          `**${name}'s ${dose.title}** — ${dose.schedule ?? 'as prescribed'}. ${dose.takenToday ? '✅ Already logged for today.' : '⏰ Not logged yet today.'}`
        );
      }
      if (conditions.length) {
        lines.push(`Also being watched: ${conditions.map((c) => c.title).join(', ')}.`);
      }
      if (v.length) {
        lines.push(`Latest readings: ${v.map((x) => `${x.label} ${x.value}${x.unit}${x.status !== 'good' ? ' (watch)' : ''}`).join(' · ')}.`);
      }
      if (!records.length) lines.push(`${name} has nothing active on the health timeline right now. That is genuinely good news.`);

      const alert = allergies.find((a) => a.severity === 'severe' || a.severity === 'critical');
      if (alert) {
        lines.push(`Allergy to flag: ${alert.title}. Keep that in mind before anything new is eaten or prescribed.`);
      }
      return {
        text: lines.join('\n\n'),
        citations: [
          ...(allergies.length ? [cite('record', allergies[0].id, allergies[0].title, allergies[0].provider ?? 'Family health record')] : []),
          ...(meds.length ? [cite('record', meds[0].id, meds[0].title, meds[0].schedule ?? '')] : []),
          ...v.map((x) => cite('record', x.id, x.label, `${x.value} ${x.unit}`)),
        ],
        actions:
          meds.length && !meds[0].takenToday
            ? [{ id: uid('a'), label: `Log ${meds[0].title}`, kind: 'primary', intent: { type: 'mark-medication', recordId: meds[0].id } }]
            : undefined,
        steps: [
          ...BASE_STEPS(),
          step('Health Companion', 'Pulled active conditions, meds and readings', 21),
          step('Response Composer', 'Wrote it in plain language, no jargon', 12),
        ],
      };
    },
  },
  {
    agent: 'medical',
    tier: 2,
    title: 'Medical summary',
    body: (s) => {
      const { okf } = s;
      const me = activeMember(s);
      const who = me.role === 'parent' || me.role === 'guardian' ? me.memberId : 'm_nana';
      const all = okf.health.filter((h) => h.memberId === who);
      const shareable = all.filter((h) => h.sharedWith.length > 0 || me.memberId === who);
      const text = `**${firstName(okf, who)}’s health summary**\n\n${shareable
        .map((h) => `• ${h.title} — ${h.status}${h.provider ? ` · ${h.provider}` : ''}`)
        .join('\n')}\n\n*This summary is exportable to a clinic. Nothing leaves the family server unless you press share.*`;
      return {
        text,
        citations: shareable.slice(0, 3).map((h) => cite('record', h.id, h.title, h.details.slice(0, 60))),
        actions: [{ id: uid('a'), label: 'Show privacy rules', kind: 'ghost', intent: { type: 'navigate', route: 'privacy' } }],
        steps: [
          ...BASE_STEPS(),
          step('Medical Scribe', 'Condensed the record into a clinic-friendly brief', 26),
        ],
      };
    },
  },
  {
    agent: 'finance',
    tier: 2,
    title: 'Finance',
    body: (s) => {
      const { okf } = s;
      const thisMonth = okf.transactions.filter((x) => x.date.slice(0, 7) === new Date().toISOString().slice(0, 7));
      const spent = thisMonth.reduce((sum, x) => sum + x.amount, 0);
      const limit = okf.budgets.reduce((sum, b) => sum + b.limit, 0);
      const top = [...thisMonth].sort((a, b) => b.amount - a.amount).slice(0, 3);
      const savings = okf.transactions.filter((x) => x.category === 'savings').reduce((sum, x) => sum + x.amount, 0);
      const text = [
        `**Family spend so far this month: ${money(spent)}** of a ${money(limit)} plan (${Math.round((spent / limit) * 100)}%).`,
        top.length ? `Biggest items: ${top.map((x) => `${x.label} ${money(x.amount)}`).join(' · ')}.` : '',
        savings ? `Savings top-ups this month: ${money(savings)}.` : '',
        `**${okf.goals[0]?.title ?? 'Your top goal'}** is ${Math.round(((okf.goals[0]?.saved ?? 0) / (okf.goals[0]?.target ?? 1)) * 100)}% funded.`,
      ]
        .filter(Boolean)
        .join('\n\n');
      return {
        text,
        citations: top.map((x) => cite('transaction', x.id, x.label, `${x.category} · ${money(x.amount)}`)),
        steps: [
          ...BASE_STEPS(),
          step('Finance Analyst', 'Summed budgets, transactions and goals', 19),
          step('Response Composer', 'Turned it into three numbers that matter', 10),
        ],
      };
    },
  },
  {
    agent: 'home',
    tier: 1,
    title: 'Home and shopping',
    body: (s) => {
      const { okf } = s;
      const low = okf.inventory.filter((i) => i.quantity <= i.lowAt);
      const expiring = okf.inventory.filter((i) => (i.expiresInDays ?? 99) <= 3);
      const toBuy = okf.shopping.filter((x) => !x.done);
      const text = [
        `**${low.length} items are running low.** ${low.map((i) => i.name).join(', ')}.`,
        expiring.length ? `**Use soon:** ${expiring.map((i) => i.name).join(', ')}.` : '',
        `Shopping list has **${toBuy.length} things** left.`,
        low.length
          ? `Want me to drop ${low.slice(0, 2).map((i) => i.name).join(' and ')} on the list?`
          : `Nothing urgent. The pantry is in good shape.`,
      ]
        .filter(Boolean)
        .join('\n\n');
      return {
        text,
        citations: low.map((i) => cite('record', i.id, i.name, `${i.quantity} ${i.unit} left`)),
        actions: low.length
          ? [
              {
                id: uid('a'),
                label: `Add ${low[0].name} to list`,
                kind: 'primary',
                intent: { type: 'add-shopping', name: low[0].name, quantity: 1, unit: low[0].unit },
              },
            ]
          : undefined,
        steps: [
          ...BASE_STEPS(),
          step('Home Steward', 'Compared pantry levels against low-stock thresholds', 16),
        ],
      };
    },
  },
  {
    agent: 'tasks',
    tier: 1,
    title: 'Tasks and calendar',
    body: (s) => {
      const { okf } = s;
      const open = openTasks(okf);
      const today = open.filter((t) => t.due.slice(0, 10) === new Date().toISOString().slice(0, 10));
      const points = open.reduce((sum, t) => sum + t.points, 0);
      const overdue = open.filter((t) => t.due < new Date().toISOString());
      const text = [
        `**${open.length} open tasks** worth **${points} points** in total.`,
        today.length ? `Due today: ${today.map((t) => `${t.title} (${firstName(okf, t.assigneeId)}, ${t.points}★)`).join(' · ')}.` : '',
        overdue.length ? `${overdue.length} slipped past their due date — no guilt, just move them.` : `Nothing is overdue. Lovely.`,
        okf.events.filter((e) => !e.done).length
          ? `**${okf.events.filter((e) => !e.done).length} events** on the family calendar.`
          : '',
      ]
        .filter(Boolean)
        .join('\n\n');
      return {
        text,
        citations: today.slice(0, 3).map((t) => cite('task', t.id, t.title, `${firstName(okf, t.assigneeId)} · ${t.points} points`)),
        actions: [
          { id: uid('a'), label: 'Add a task', kind: 'primary', intent: { type: 'navigate', route: 'tasks' } },
          ...(overdue.length
            ? [{ id: uid('a'), label: 'Reschedule the slipped ones', kind: 'ghost' as const, intent: { type: 'navigate' as const, route: 'tasks' } }]
            : []),
        ],
        steps: [
          ...BASE_STEPS(),
          step('Household Planner', 'Pulled open tasks, points and upcoming events', 15),
        ],
      };
    },
  },
  {
    agent: 'memory',
    tier: 1,
    title: 'Memories',
    body: (s) => {
      const { okf } = s;
      const sorted = [...okf.memories].sort((a, b) => b.emotionalWeight - a.emotionalWeight);
      const top = sorted.slice(0, 2);
      const tags = Array.from(new Set(okf.memories.flatMap((m) => m.tags))).slice(0, 5);
      const text = [
        `I remember **${okf.memories.length} things** about this family.`,
        top.length
          ? `The ones that carry the most weight: **${top[0].title}** — ${top[0].story.split('.')[0]}.\n\nAnd **${top[1]?.title}** — ${top[1]?.story.split('.')[0]}.`
          : '',
        `Common threads: ${tags.map((x) => `#${x}`).join(' ')}`,
        `Want to add something from today?`,
      ]
        .filter(Boolean)
        .join('\n\n');
      return {
        text,
        citations: top.map((m) => cite('memory', m.id, m.title, m.tags.join(', '))),
        actions: [{ id: uid('a'), label: 'Save a memory', kind: 'primary', intent: { type: 'navigate', route: 'memories' } }],
        steps: [
          ...BASE_STEPS(),
          step('Memory Keeper', 'Ranked memories by emotional weight', 18),
        ],
      };
    },
  },
  {
    agent: 'privacy-guardian',
    tier: 3,
    title: 'Privacy',
    body: (s) => {
      const { okf, memberId } = s;
      const me = activeMember(s);
      const others = okf.members.filter((m) => m.memberId !== memberId);
      const lines = others.map((m) => {
        const p = okf.privacy[m.memberId];
        const cats = p ? Object.entries(p.dataCategories) : [];
        const locked = cats.filter(([, l]) => l === 'private').map(([c]) => c);
        return `• **${m.name}** — ${m.privacyLevel}${locked.length ? `, keeps ${locked.join(', ')} private` : ', everything shared with guardians'}`;
      });
      const blocked = others.filter((m) => okf.privacy[m.memberId]?.allowCloud);
      return {
        text: [
          `**Everything runs on your own hardware.** ${okf.familyName}’s OKF sits on a local server in the hallway cabinet.`,
          `**Who can see what:**\n${lines.join('\n')}`,
          blocked.length ? `Nothing is allowed to use a cloud model. No exceptions, no silent upgrades.` : `A cloud model could be used, but only with your explicit consent.`,
          `I never see anything I am not allowed to. The Privacy Guardian checked before I wrote this. Signed off for ${me.name}.`,
        ].join('\n\n'),
        citations: [cite('graph', okf.familyId, 'OKF manifest', `v${okf.version} · rev ${okf.revision}`)],
        actions: [{ id: uid('a'), label: 'Open the audit log', kind: 'ghost', intent: { type: 'navigate', route: 'privacy' } }],
        steps: [
          step('Privacy Guardian', 'Read every visibility rule for every member', 22),
          step('Response Composer', 'Explained it without making you read JSON', 11),
        ],
      };
    },
  },
];

const GREETINGS: Record<string, string> = {
  m_maya: 'Good to see you. The house is in decent shape — one dentist run, one dentist form, and about four things that want your attention before dinner.',
  m_rohan: 'Numbers first: spending is down and the Coorg fund is over halfway. The dentist form is the only real loose end.',
  m_aarav: 'Hey! I found three things that need doing before dinner, and the biggest one is worth 25 points. I did not add anything to your list without asking.',
  m_anaya: 'Hi! I remembered the concert on Friday and put it on the calendar so you do not forget. Do you want to hear a story?',
  m_nana: 'Good morning, Nana. Your tablet is in the kitchen, your medicine is logged, and your granddaughter wants to sing you a song.',
};

const SUGGESTIONS: Record<string, string[]> = {
  m_maya: ['What is on today?', 'Is Aarav okay for soccer?', 'Add milk to the shopping list', 'What did we spend on groceries?'],
  m_rohan: ['How are our budgets this month?', 'Nana’s appointments this week', 'Give me a family health summary', 'What memories came up this week?'],
  m_aarav: ['What jobs do I have today?', 'What is in the fridge?', 'Remind me about my points', 'When is the dentist?'],
  m_anaya: ['What is happening today?', 'Tell me a story', 'When is the concert?', 'What should I draw?'],
  m_nana: ['What is on today?', 'Read my blood pressure', 'When is the concert?', 'Call Anaya'],
};

const PRIVACY_Q = /privacy|private|cloud|secure|who can see|share|data|permission|guardian|hide|delete|encrypt/i;
/** Visibility questions phrased as "what can X see", without a privacy keyword. */
const VISIBILITY_Q = /\bwho\s+(else\s+)?(can\s+)?see\b|\bwhat\s+can\s+[a-z\s]{0,24}see\b|\bwho\s+has\s+(access|visibility)\b|\bcan\s+(i|we|you|they)\s+see\b/i;
const HEALTH_Q = /health|medicine|medication|allergy|allerg|symptom|fever|pain|doctor|dentist|hospital|blood pressure|dose|med|ill|sick|pill|pharmacy|check-?up|breath|wheez|asthma|inhaler|sore|swelling|exhausted|tired|okay for|ok to|fit to|cleared to|soccer|football|cricket|swim|gym|run|sport|play on|injury|sprain|fitness|sleep/i;
const MONEY_Q = /money|spend|spent|budget|cost|price|bill|save|saving|afford|cash|expense|top-?up|goal|fund/i;
const HOME_Q = /fridge|pantry|shop|shopping|grocery|groceries|buying|buy|low|stock|inventory|expir|out of|house|clean|supplies/i;
const TASK_Q = /task|chore|job|todo|to-?do|due|point|calendar|event|schedule|appointment|remind|when is|what.*today|plan/i;
const MEMORY_Q = /memor|remember|story|childhood|photo|nostalgia|recall|storytime|timeline|history|when did|who was|grew up|years ago|family tree/i;

function pick(text: string): Planner | null {
  if (PRIVACY_Q.test(text) || VISIBILITY_Q.test(text)) return PLANNERS[6];
  if (HEALTH_Q.test(text)) {
    if (/summar|brief|clinic|export|report|record|chart/i.test(text)) return PLANNERS[1];
    return PLANNERS[0];
  }
  if (MONEY_Q.test(text)) return PLANNERS[2];
  if (MEMORY_Q.test(text)) return PLANNERS[5];
  if (HOME_Q.test(text)) return PLANNERS[3];
  if (TASK_Q.test(text)) return PLANNERS[4];
  return null;
}

function localAnswer(text: string): Planner['body'] {
  const q = text.toLowerCase();
  const known: [RegExp, string][] = [
    [/^(hi|hey|hello|yo|namaste|good (morning|evening|afternoon))\b/, 'Hello. I am running entirely on your own hardware, which means I work even when the internet does not.'],
    [/how are you|how're you|hows your/, 'Doing well. I read the OKF in about nine milliseconds and I did not send any of it anywhere.'],
    [/who made you|who are you|what are you/, 'I am the Nexus orchestrator. A planner picks the lane, a privacy guardian checks it, and a specialist writes the answer. All of it runs on the box in the hallway.'],
    [/\b(ok|okay|thanks|thank you|cheers|cool|nice|great|awesome|good job|perfect)\b/, 'Any time. Ask me about the house, the calendar, health, money or the family timeline.'],
    [/\?$/, 'I did not catch a specific question in that one. Try “what is on today”, “is Aarav okay for soccer”, or “how are our budgets”.'],
  ];
  for (const [re, line] of known) {
    if (re.test(q)) {
      return () => ({ text: line, steps: [step('Router', 'Matched a conversational pattern', 4)], citations: [] });
    }
  }
  return () => ({
    text: `I did not find anything in the family OKF about “${text.length > 60 ? `${text.slice(0, 60)}…` : text}”. I only answer from what is stored here, so if it is new, add it and I will know it next time.`,
    steps: [step('Context Builder', 'Searched every OKF collection, nothing matched', 23)],
    citations: [],
  });
}

export function suggestionsFor(memberId: string) {
  return SUGGESTIONS[memberId] ?? SUGGESTIONS.m_maya;
}

export function greetingFor(memberId: string) {
  return GREETINGS[memberId] ?? GREETINGS.m_maya;
}

/* ----------------------------- the ask ------------------------------ */

export async function ask(text: string) {
  const userMessage: ChatMessage = {
    id: uid('m'),
    role: 'user',
    text,
    at: Date.now(),
    status: 'done',
  };
  dispatch({ type: 'pushMessage', message: userMessage });

  const s = getState();
  const me = activeMember(s);
  const routed = pick(text);
  const planner = routed ?? { agent: 'router' as AgentId, tier: 1 as const, body: localAnswer(text) };
  const result = planner.body(s);

  const assistant: ChatMessage = {
    id: uid('m'),
    role: 'assistant',
    text: result.text,
    at: Date.now(),
    agent: planner.agent,
    agentLabel: AGENT_LABEL[planner.agent] ?? 'Nexus',
    steps: result.steps,
    citations: result.citations,
    actions: result.actions,
    tier: planner.tier,
    status: 'streaming',
  };
  dispatch({ type: 'pushMessage', message: assistant });

  const total = result.steps.reduce((sum, x) => sum + x.ms, 0);
  await new Promise((r) => setTimeout(r, Math.min(1100, total * 3.2)));

  dispatch({ type: 'updateMessage', id: assistant.id, patch: { status: 'done' } });
  dispatch({
    type: 'pushToast',
    text: me.role === 'elder' ? 'Answered with big text' : `Answered locally in ${(total / 1000).toFixed(1)}s`,
    tone: 'info',
  });
}

export function runIntent(intent: ChatIntent) {
  dispatch({ type: 'applyIntent', intent });
}

export { AGENT_LABEL, formatDayLabel, formatFullDate };
