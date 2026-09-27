const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isoOffset(days: number, from = new Date()): string {
  const d = startOfDay(from);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function isoAt(days: number, time: string, from = new Date()): string {
  const d = startOfDay(from);
  d.setDate(d.getDate() + days);
  const [h, m] = time.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export function parse(value: string | number | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function sameDay(a: string | Date, b: string | Date) {
  const da = parse(a);
  const db = parse(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

export function dayOffset(value: string | Date, from = new Date()) {
  const a = startOfDay(parse(value)).getTime();
  const b = startOfDay(from).getTime();
  return Math.round((a - b) / 86_400_000);
}

export function formatTime(value: string | Date) {
  const d = parse(value);
  const h = d.getHours();
  const m = d.getMinutes();
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, '0')}${suffix}`;
}

export function formatDayLabel(value: string | Date) {
  const offset = dayOffset(value);
  if (offset === 0) return 'Today';
  if (offset === 1) return 'Tomorrow';
  if (offset === -1) return 'Yesterday';
  const d = parse(value);
  if (offset > 1 && offset < 7) return WEEKDAYS[d.getDay()];
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatFullDate(value: string | Date) {
  const d = parse(value);
  return `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatMonthDay(value: string | Date) {
  const d = parse(value);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function monthName(value: string | Date) {
  return MONTHS[parse(value).getMonth()];
}

export function shortMonth(monthIndex: number) {
  return MONTHS[((monthIndex % 12) + 12) % 12];
}

export function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function relativeTime(at: number, from = Date.now()) {
  const diff = Math.max(0, from - at);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function dueLabel(value: string, from = new Date()) {
  const offset = dayOffset(value, from);
  if (offset < 0) return { label: 'Overdue', tone: 'danger' as const };
  if (offset === 0) return { label: 'Today', tone: 'warning' as const };
  if (offset === 1) return { label: 'Tomorrow', tone: 'info' as const };
  if (offset <= 6) return { label: `In ${offset} days`, tone: 'neutral' as const };
  return { label: formatDayLabel(value), tone: 'neutral' as const };
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

export function clockLabel(date = new Date()) {
  return `${formatTime(date)} · ${WEEKDAYS[date.getDay()]}`;
}

export function money(value: number, currency = '$') {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2)}${currency}`;
}

export function monthKey(value: string | Date) {
  const d = parse(value);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export function monthLabelFromKey(key: string) {
  const [y, m] = key.split('-').map(Number);
  return `${MONTHS[m]} ${y}`;
}
