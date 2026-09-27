import { ask } from '@/ai/orchestrator';
import { dispatch, getState } from '@/data/store';
import { check, done, section } from './harness';

type Route = [query: string, agent: string];

const CASES: Route[] = [
  // Household
  ['what is on today', 'Household Planner'],
  ['nana\u2019s appointments this week', 'Household Planner'],
  ['when is the concert', 'Household Planner'],
  ['what jobs do i have today', 'Household Planner'],
  // Health
  ['is aarav okay for soccer', 'Health Companion'],
  ['read my blood pressure', 'Health Companion'],
  ['when is the dentist', 'Health Companion'],
  ['give me a family health summary', 'Medical Scribe'],
  // Finance
  ['how are our budgets', 'Finance Analyst'],
  ['what did we spend on groceries', 'Finance Analyst'],
  // Home
  ['what is in the fridge', 'Home Steward'],
  ['add milk to the shopping list', 'Home Steward'],
  // Memory
  ['what memories came up this week', 'Memory Keeper'],
  ['tell me about our family timeline', 'Memory Keeper'],
  // Privacy outranks everything else
  ['who can see the health data', 'Privacy Guardian'],
  ['what can anaya see about my health', 'Privacy Guardian'],
  // Unrecognised input must not invent an answer
  ['asdfghjkl qwerty nonsense', 'Router'],
  // "see" only means visibility when someone else is doing the seeing
  ['when should i see the dentist', 'Health Companion'],
  ['when should nana see the doctor', 'Health Companion'],
];

/** Every chip the chat screen offers, per persona. */
const CHIPS: Route[] = [
  ['What is on today?', 'Household Planner'],
  ['Is Aarav okay for soccer?', 'Health Companion'],
  ['Add milk to the shopping list', 'Home Steward'],
  ['What did we spend on groceries?', 'Finance Analyst'],
  ['How are our budgets this month?', 'Finance Analyst'],
  ['Nana\u2019s appointments this week', 'Household Planner'],
  ['Give me a family health summary', 'Medical Scribe'],
  ['What memories came up this week?', 'Memory Keeper'],
  ['What jobs do I have today?', 'Household Planner'],
  ['What is in the fridge?', 'Home Steward'],
  ['Remind me about my points', 'Household Planner'],
  ['When is the dentist?', 'Health Companion'],
  ['Tell me a story', 'Memory Keeper'],
  ['Read my blood pressure', 'Health Companion'],
  // Open-ended chips that no specialist owns: these must admit ignorance
  ['What should I draw?', 'Router'],
  ['Call Anaya', 'Router'],
];

function route(query: string): string {
  dispatch({ type: 'newSession' });
  void ask(query);
  const state = getState();
  const session = state.sessions[state.sessionId] ?? [];
  return session[session.length - 1]?.agentLabel ?? '(no reply)';
}

function expect(list: Route[], label: string) {
  section(label);
  for (const [query, agent] of list) {
    const got = route(query);
    check(`"${query}" -> ${agent}`, got === agent, got);
  }
}

expect(CASES, 'orchestrator routing');
expect(CHIPS, 'suggestion chips');

section('fallback honesty');
dispatch({ type: 'newSession' });
void ask('asdfghjkl qwerty nonsense');
const state = getState();
const last = (state.sessions[state.sessionId] ?? []).at(-1);
check('does not fabricate a pantry answer', !/fridge|pantry|shelf/i.test(last?.text ?? ''), last?.text?.slice(0, 80));
check('tells the user it found nothing', /did not find|could not find|no .* in the family/i.test(last?.text ?? ''), last?.text?.slice(0, 80));

section('privacy precedence');
dispatch({ type: 'newSession' });
void ask('what did we spend on groceries? who can see this?');
const both = getState();
const tail = (both.sessions[both.sessionId] ?? []).at(-1);
check('privacy agent answers the privacy part', tail?.agentLabel === 'Privacy Guardian', tail?.agentLabel);

done('routing');
