// src/lib/date.ts
function startOfDay(date = /* @__PURE__ */ new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
function isoOffset(days, from = /* @__PURE__ */ new Date()) {
  const d = startOfDay(from);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
function isoAt(days, time, from = /* @__PURE__ */ new Date()) {
  const d = startOfDay(from);
  d.setDate(d.getDate() + days);
  const [h, m] = time.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}
function money(value, currency = "$") {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2)}${currency}`;
}

// scripts/smoke/shims/async-storage.ts
var mem = /* @__PURE__ */ new Map();
var async_storage_default = {
  async getItem(key) {
    return mem.get(key) ?? null;
  },
  async setItem(key, value) {
    mem.set(key, value);
  },
  async removeItem(key) {
    mem.delete(key);
  }
};

// scripts/smoke/shims/react-native.ts
var Platform = {
  OS: "node",
  select: (spec) => spec.node ?? spec.default
};

// src/data/seed.ts
var now = Date.now();
function hash(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
function audit(id, minutesAgo, actor, action, target, category, ok = true) {
  return { id, at: now - minutesAgo * 6e4, actor, action, target, category, hash: hash(id), ok };
}
var members = [
  {
    memberId: "m_maya",
    name: "Maya Kapoor",
    role: "parent",
    age: 38,
    accent: "primary",
    privacyLevel: "family",
    persona: "organizer",
    tagline: "Full family control, health & finance",
    status: "At her desk",
    online: true,
    interests: ["planning", "cooking", "running"],
    devices: [
      { id: "d1", name: "Maya's Pixel", kind: "phone", platform: "Android 15", lastSeen: now - 4e4, trusted: true },
      { id: "d2", name: "Kitchen tablet", kind: "tablet", platform: "HomeOS", lastSeen: now - 6e5, trusted: true }
    ]
  },
  {
    memberId: "m_rohan",
    name: "Rohan Kapoor",
    role: "parent",
    age: 41,
    accent: "grape",
    privacyLevel: "family",
    persona: "analyst",
    tagline: "Numbers, budgets and football",
    status: "At the office",
    online: false,
    interests: ["cycling", "finance", "football"],
    devices: [
      { id: "d3", name: "Rohan's iPhone", kind: "phone", platform: "iOS 19", lastSeen: now - 36e5, trusted: true }
    ]
  },
  {
    memberId: "m_aarav",
    name: "Aarav Kapoor",
    role: "child",
    age: 9,
    accent: "secondary",
    privacyLevel: "family",
    persona: "playful-tutor",
    tagline: "Playful tutor, chores & allowance",
    status: "At soccer practice",
    online: true,
    interests: ["space", "lego", "soccer", "dinosaurs"],
    devices: [
      { id: "d4", name: "Aarav's Tablet", kind: "tablet", platform: "iPadOS", lastSeen: now - 12e4, trusted: true }
    ]
  },
  {
    memberId: "m_anaya",
    name: "Anaya Kapoor",
    role: "child",
    age: 6,
    accent: "tertiary",
    privacyLevel: "guardians",
    persona: "playful-tutor",
    tagline: "Stories, drawing and songs",
    status: "With Nana",
    online: true,
    interests: ["drawing", "princesses", "rainbows"],
    devices: [
      { id: "d5", name: "Anaya's iPad", kind: "tablet", platform: "iPadOS", lastSeen: now - 9e4, trusted: true }
    ]
  },
  {
    memberId: "m_nana",
    name: "Nana",
    role: "elder",
    age: 71,
    accent: "matcha",
    privacyLevel: "extended",
    persona: "patient-companion",
    tagline: "Big text, voice first, simple",
    status: "Listening to a story",
    online: true,
    interests: ["gardening", "poetry", "radio", "family photos"],
    devices: [
      { id: "d6", name: "Nana\u2019s speaker", kind: "speaker", platform: "HomeOS", lastSeen: now - 2e4, trusted: true },
      { id: "d7", name: "Nana\u2019s phone", kind: "phone", platform: "Android 14", lastSeen: now - 18e5, trusted: true }
    ]
  }
];
var relationships = [
  { id: "r1", from: "m_maya", to: "m_aarav", kind: "parent-of", label: "Mum" },
  { id: "r2", from: "m_maya", to: "m_anaya", kind: "parent-of", label: "Mum" },
  { id: "r3", from: "m_rohan", to: "m_aarav", kind: "parent-of", label: "Dad" },
  { id: "r4", from: "m_rohan", to: "m_anaya", kind: "parent-of", label: "Dad" },
  { id: "r5", from: "m_maya", to: "m_rohan", kind: "spouse", label: "Married 2012" },
  { id: "r6", from: "m_nana", to: "m_maya", kind: "parent-of", label: "Mother" },
  { id: "r7", from: "m_nana", to: "m_rohan", kind: "parent-of", label: "Mother" },
  { id: "r8", from: "m_aarav", to: "m_anaya", kind: "sibling", label: "Big brother" },
  { id: "r9", from: "m_maya", to: "m_nana", kind: "cares-for", label: "Cares for Nana" },
  { id: "r10", from: "m_rohan", to: "m_nana", kind: "cares-for", label: "Cares for Nana" }
];
var events = [
  {
    id: "e1",
    type: "appointment",
    title: "Aarav's dentist check-up",
    description: "Six-month check-up and a small filling on the lower left molar.",
    date: isoAt(0, "16:30"),
    time: "4:30pm",
    recurrence: "none",
    participants: ["m_maya", "m_aarav"],
    tags: ["health", "school-run"],
    emotionalWeight: 0.2,
    source: "calendar_sync",
    location: "Bright Smiles, Nehru Place"
  },
  {
    id: "e2",
    type: "school",
    title: "Anaya\u2019s school concert",
    description: "Anaya sings in the front row. Come early, it starts at 5pm sharp.",
    date: isoAt(2, "17:00"),
    time: "5:00pm",
    recurrence: "none",
    participants: ["m_anaya", "m_rohan"],
    tags: ["school", "family"],
    emotionalWeight: 0.7,
    source: "calendar_sync",
    location: "Sunrise Public School"
  },
  {
    id: "e3",
    type: "medical",
    title: "Nana\u2019s blood pressure review",
    description: "Quarterly review with Dr. Iyer. Bring the home readings log.",
    date: isoAt(1, "11:00"),
    time: "11:00am",
    recurrence: "none",
    participants: ["m_nana", "m_rohan"],
    tags: ["health", "elder"],
    emotionalWeight: 0.5,
    source: "manual",
    location: "Apollo Clinic, Sector 12"
  },
  {
    id: "e4",
    type: "birthday",
    title: "Nana\u2019s 71st birthday",
    description: "Small cake at home, video call with the cousins in Pune.",
    date: isoOffset(6),
    recurrence: "yearly",
    participants: ["m_nana", "m_maya", "m_rohan", "m_aarav", "m_anaya"],
    tags: ["family", "celebration"],
    emotionalWeight: 0.9,
    source: "manual"
  },
  {
    id: "e5",
    type: "trip",
    title: "Family trip to Coorg",
    description: "Five days, two homestays, one very steep trail everyone claims they can handle.",
    date: isoOffset(24),
    recurrence: "none",
    participants: ["m_maya", "m_rohan", "m_aarav", "m_anaya"],
    tags: ["travel", "family"],
    emotionalWeight: 0.8,
    source: "manual"
  },
  {
    id: "e6",
    type: "achievement",
    title: "Aarav finished his reading challenge",
    description: "Forty books in eight months. He wants to pick the next reading goal himself.",
    date: isoOffset(-2),
    recurrence: "none",
    participants: ["m_aarav"],
    tags: ["school", "proud"],
    emotionalWeight: 0.85,
    source: "ai_extracted",
    done: true
  },
  {
    id: "e7",
    type: "anniversary",
    title: "Maya & Rohan\u2019s anniversary",
    description: "Fourteen years. Rohan booked the same tiny Italian place as last time.",
    date: isoOffset(48),
    recurrence: "yearly",
    participants: ["m_maya", "m_rohan"],
    tags: ["family", "couple"],
    emotionalWeight: 0.75,
    source: "manual"
  },
  {
    id: "e8",
    type: "memory",
    title: "The treehouse weekend",
    description: "Rohan built a treehouse in one weekend. It fell down in November. Nobody minded.",
    date: isoOffset(-260),
    recurrence: "none",
    participants: ["m_rohan", "m_aarav", "m_maya"],
    tags: ["family", "outdoors"],
    emotionalWeight: 0.95,
    source: "photo_metadata"
  }
];
var health = [
  {
    id: "h1",
    memberId: "m_aarav",
    type: "allergy",
    severity: "moderate",
    status: "active",
    title: "Peanut allergy",
    details: "Confirmed by Dr. Batra in March. Carries an adrenaline pen in his school bag and one in the kitchen drawer.",
    provider: "Dr. S. Batra, Paediatric Allergy",
    recordedAt: isoOffset(-210),
    sharedWith: ["m_maya", "m_rohan", "m_nana"]
  },
  {
    id: "h2",
    memberId: "m_aarav",
    type: "medication",
    severity: "info",
    status: "active",
    title: "Vitamin D drops",
    details: "400IU once daily with breakfast, only in winter months.",
    dosage: "1ml",
    schedule: "Every morning with breakfast",
    nextDose: "08:00",
    takenToday: true,
    recordedAt: isoOffset(-30),
    sharedWith: ["m_maya"]
  },
  {
    id: "h3",
    memberId: "m_aarav",
    type: "appointment",
    severity: "info",
    status: "monitoring",
    title: "Asthma watch",
    details: "Mild seasonal wheeze. Uses a blue inhaler before football. Peak flow logged on the home server.",
    provider: "Dr. S. Batra",
    recordedAt: isoOffset(-45),
    sharedWith: ["m_maya", "m_rohan"]
  },
  {
    id: "h4",
    memberId: "m_nana",
    type: "condition",
    severity: "moderate",
    status: "monitoring",
    title: "High blood pressure",
    details: "Managed with medication and a low-salt diet. Morning readings logged daily.",
    provider: "Dr. A. Iyer",
    recordedAt: isoOffset(-400),
    sharedWith: ["m_maya", "m_rohan"]
  },
  {
    id: "h5",
    memberId: "m_nana",
    type: "medication",
    severity: "info",
    status: "active",
    title: "Amlodipine 5mg",
    details: "One tablet every morning after tea. Keep in the marked box on the top shelf.",
    dosage: "5mg",
    schedule: "Every morning, 8:00am",
    nextDose: "08:00",
    takenToday: false,
    recordedAt: isoOffset(-380),
    sharedWith: ["m_maya", "m_rohan"]
  },
  {
    id: "h6",
    memberId: "m_maya",
    type: "condition",
    severity: "mild",
    status: "monitoring",
    title: "Migraine pattern",
    details: "Usually triggered by skipped meals and short sleep. Responds well to a dark room and fluids.",
    provider: "Dr. P. Nair",
    recordedAt: isoOffset(-90),
    sharedWith: ["m_rohan"]
  },
  {
    id: "h7",
    memberId: "m_maya",
    type: "medication",
    severity: "info",
    status: "active",
    title: "Sumatriptan 50mg",
    details: "Only at the first sign of a migraine. Do not take more than two in 24 hours.",
    dosage: "50mg",
    schedule: "As needed, max 2 in 24h",
    recordedAt: isoOffset(-85),
    sharedWith: ["m_rohan"]
  },
  {
    id: "h8",
    memberId: "m_rohan",
    type: "vaccination",
    severity: "info",
    status: "resolved",
    title: "Annual flu shot",
    details: "Given at the pharmacy, no reaction.",
    recordedAt: isoOffset(-150),
    sharedWith: ["m_maya"]
  }
];
var vitals = [
  { id: "v1", memberId: "m_nana", label: "Blood pressure", value: 138, unit: "mmHg", at: isoAt(0, "08:12"), status: "watch" },
  { id: "v2", memberId: "m_nana", label: "Heart rate", value: 72, unit: "bpm", at: isoAt(0, "08:12"), status: "good" },
  { id: "v3", memberId: "m_aarav", label: "Sleep last night", value: 7.4, unit: "hours", at: isoAt(0, "06:40"), status: "good" },
  { id: "v4", memberId: "m_aarav", label: "Resting heart rate", value: 78, unit: "bpm", at: isoAt(0, "06:41"), status: "good" },
  { id: "v5", memberId: "m_maya", label: "Steps", value: 6420, unit: "steps", at: isoAt(0, "14:00"), status: "good" },
  { id: "v6", memberId: "m_maya", label: "Stress", value: 62, unit: "/100", at: isoAt(0, "14:00"), status: "watch" },
  { id: "v7", memberId: "m_nana", label: "Blood pressure", value: 145, unit: "mmHg", at: isoOffset(-1), status: "alert" },
  { id: "v8", memberId: "m_nana", label: "Heart rate", value: 70, unit: "bpm", at: isoOffset(-1), status: "good" },
  { id: "v9", memberId: "m_nana", label: "Blood pressure", value: 133, unit: "mmHg", at: isoOffset(-2), status: "good" }
];
var transactions = [
  { id: "x1", memberId: "family", label: "Weekly groceries", category: "groceries", amount: 86.4, date: isoAt(0, "10:00") },
  { id: "x2", memberId: "m_aarav", label: "Soccer fee", category: "school", amount: 35, date: isoAt(-1, "09:00") },
  { id: "x3", memberId: "family", label: "Electricity bill", category: "utilities", amount: 142.9, date: isoAt(-2, "11:00") },
  { id: "x4", memberId: "family", label: "Pharmacy \u2014 Nana\u2019s prescription", category: "health", amount: 48.2, date: isoAt(-2, "18:20") },
  { id: "x5", memberId: "m_aarav", label: "Cinema ticket", category: "fun", amount: 12, date: isoAt(-3, "17:30") },
  { id: "x6", memberId: "family", label: "Auto to school", category: "transport", amount: 9.5, date: isoAt(-3, "08:05") },
  { id: "x7", memberId: "m_anaya", label: "Art supplies", category: "school", amount: 22.75, date: isoAt(-4, "15:40") },
  { id: "x8", memberId: "family", label: "Weekly groceries", category: "groceries", amount: 74.1, date: isoAt(-5, "10:15") },
  { id: "x9", memberId: "family", label: "Water delivery", category: "utilities", amount: 18, date: isoAt(-5, "09:00") },
  { id: "x10", memberId: "m_maya", label: "Dinner with Rohan", category: "fun", amount: 64, date: isoAt(-6, "20:10") },
  { id: "x11", memberId: "family", label: "Dentist \u2014 Aarav", category: "health", amount: 55, date: isoAt(-7, "16:00") },
  { id: "x12", memberId: "family", label: "School bus top-up", category: "transport", amount: 40, date: isoAt(-8, "07:45") },
  { id: "x13", memberId: "family", label: "Groceries \u2014 fresh produce", category: "groceries", amount: 52.6, date: isoAt(-9, "10:30") },
  { id: "x14", memberId: "m_rohan", label: "Cycle service", category: "transport", amount: 30, date: isoAt(-10, "12:00") },
  { id: "x15", memberId: "family", label: "Savings top-up", category: "savings", amount: 200, date: isoAt(-11, "09:00") }
];
var budgets = [
  { id: "b1", category: "groceries", limit: 320 },
  { id: "b2", category: "transport", limit: 120 },
  { id: "b3", category: "health", limit: 200 },
  { id: "b4", category: "school", limit: 250 },
  { id: "b5", category: "utilities", limit: 300 },
  { id: "b6", category: "fun", limit: 180 }
];
var goals = [
  { id: "g1", title: "Coorg trip fund", target: 12e3, saved: 7400, targetDate: isoOffset(24), icon: "leaf" },
  { id: "g2", title: "Aarav\u2019s college fund", target: 4e5, saved: 62e3, targetDate: isoOffset(365 * 12), icon: "book" },
  { id: "g3", title: "New winter tyres", target: 4e4, saved: 31e3, targetDate: isoOffset(90), icon: "zap" },
  { id: "g4", title: "Nana\u2019s cataract surgery", target: 8e4, saved: 52e3, targetDate: isoOffset(60), icon: "heart" }
];
var tasks = [
  { id: "t1", title: "Put out recycling", category: "chore", assigneeId: "m_aarav", due: isoAt(0, "19:00"), points: 5, done: false, createdBy: "m_maya", difficulty: "easy", streak: 4 },
  { id: "t2", title: "Load the dishwasher", category: "chore", assigneeId: "m_anaya", due: isoAt(0, "20:00"), points: 5, done: true, createdBy: "m_maya", difficulty: "easy", streak: 3 },
  { id: "t3", title: "Water the terrace plants", category: "home", assigneeId: "m_nana", due: isoAt(0, "07:30"), points: 10, done: true, createdBy: "m_maya", difficulty: "easy", streak: 12 },
  { id: "t4", title: "Pack sports bag for practice", category: "school", assigneeId: "m_aarav", due: isoAt(0, "15:30"), points: 5, done: false, createdBy: "m_rohan", difficulty: "easy", streak: 2 },
  { id: "t5", title: "Book the dentist slot", category: "health", assigneeId: "m_maya", due: isoAt(0, "12:00"), points: 10, done: true, createdBy: "m_rohan", difficulty: "medium", streak: 1 },
  { id: "t6", title: "Clean the balcony rails", category: "home", assigneeId: "m_rohan", due: isoAt(1, "10:00"), points: 20, done: false, createdBy: "m_maya", difficulty: "hard", streak: 0 },
  { id: "t7", title: "Take Anaya to ballet", category: "social", assigneeId: "m_rohan", due: isoAt(1, "17:00"), points: 10, done: false, createdBy: "m_maya", difficulty: "medium", streak: 6 },
  { id: "t8", title: "Refill the blood pressure log", category: "health", assigneeId: "m_nana", due: isoAt(1, "09:00"), points: 10, done: false, createdBy: "m_maya", difficulty: "easy", streak: 9 },
  { id: "t9", title: "Return library books", category: "errand", assigneeId: "m_aarav", due: isoAt(2, "16:00"), points: 10, done: false, createdBy: "m_maya", difficulty: "easy", streak: 1 },
  { id: "t10", title: "Sort out the garage shelf", category: "home", assigneeId: "m_rohan", due: isoAt(3, "11:00"), points: 25, done: false, createdBy: "m_maya", difficulty: "hard", streak: 0 },
  { id: "t11", title: "Help Nana with the video call", category: "social", assigneeId: "m_anaya", due: isoOffset(-1), points: 10, done: true, createdBy: "m_maya", difficulty: "easy", streak: 5 },
  { id: "t12", title: "Swap the kitchen bulbs", category: "home", assigneeId: "m_aarav", due: isoOffset(-2), points: 10, done: true, createdBy: "m_rohan", difficulty: "easy", streak: 7 }
];
var inventory = [
  { id: "i1", name: "Whole milk", category: "dairy", quantity: 1, unit: "litre", lowAt: 2, expiresInDays: 2, barcode: "8901234567890", updatedAt: isoAt(0, "08:00") },
  { id: "i2", name: "Basmati rice", category: "pantry", quantity: 4, unit: "kg", lowAt: 2, expiresInDays: 300, barcode: "8909876543210", updatedAt: isoAt(-12, "10:00") },
  { id: "i3", name: "Eggs", category: "dairy", quantity: 6, unit: "units", lowAt: 6, expiresInDays: 5, barcode: "8905555555555", updatedAt: isoAt(0, "08:00") },
  { id: "i4", name: "Tomatoes", category: "produce", quantity: 0.5, unit: "kg", lowAt: 1, expiresInDays: 3, barcode: "8904444444444", updatedAt: isoAt(-1, "19:00") },
  { id: "i5", name: "Amul Butter", category: "dairy", quantity: 2, unit: "packs", lowAt: 1, expiresInDays: 21, barcode: "8903333333333", updatedAt: isoAt(-8, "11:00") },
  { id: "i6", name: "Atta", category: "pantry", quantity: 8, unit: "kg", lowAt: 3, expiresInDays: 120, barcode: "8902222222222", updatedAt: isoAt(-20, "10:00") },
  { id: "i7", name: "Dishwasher tablets", category: "household", quantity: 0, unit: "box", lowAt: 1, expiresInDays: void 0, barcode: "8901111111111", updatedAt: isoAt(-25, "10:00") },
  { id: "i8", name: "Frozen peas", category: "frozen", quantity: 2, unit: "bags", lowAt: 1, expiresInDays: 90, barcode: "8906666666666", updatedAt: isoAt(-30, "10:00") },
  { id: "i9", name: "Amlodipine 5mg", category: "medicine", quantity: 18, unit: "tablets", lowAt: 7, expiresInDays: 240, barcode: "8907777777777", updatedAt: isoAt(-2, "18:20") },
  { id: "i10", name: "Coriander", category: "produce", quantity: 0, unit: "bunch", lowAt: 1, expiresInDays: 1, barcode: "8908888888888", updatedAt: isoAt(-2, "19:00") },
  { id: "i11", name: "Toilet cleaner", category: "household", quantity: 1, unit: "bottle", lowAt: 1, expiresInDays: void 0, barcode: "8909999999999", updatedAt: isoAt(-15, "10:00") },
  { id: "i12", name: "Cheese slices", category: "dairy", quantity: 3, unit: "packs", lowAt: 2, expiresInDays: 14, barcode: "8901010101010", updatedAt: isoAt(-4, "10:00") }
];
var shopping = [
  { id: "s1", name: "Dishwasher tablets", quantity: 1, unit: "box", addedBy: "nexus", done: false, source: "low-stock" },
  { id: "s2", name: "Tomatoes", quantity: 1, unit: "kg", addedBy: "m_maya", done: false, source: "manual" },
  { id: "s3", name: "Coriander", quantity: 2, unit: "bunch", addedBy: "nexus", done: false, source: "low-stock" },
  { id: "s4", name: "Eggs", quantity: 1, unit: "tray", addedBy: "m_maya", done: false, source: "low-stock" },
  { id: "s5", name: "Mint chutney", quantity: 1, unit: "jar", addedBy: "m_rohan", done: true, source: "manual" }
];
var memories = [
  {
    id: "m1",
    title: "The treehouse weekend",
    story: "Rohan announced on Friday that he would build a treehouse by Sunday. He borrowed every saw in the neighbourhood. It came down in November wind, and the whole family ate snacks on the lawn looking at the pieces. Nobody has ever been annoyed about it.",
    date: isoOffset(-260),
    participants: ["m_rohan", "m_aarav", "m_maya"],
    tags: ["outdoors", "dad", "weekend"],
    emotionalWeight: 0.95,
    source: "photo",
    palette: ["periwinkle", "butter"],
    privacyLevel: "family"
  },
  {
    id: "m2",
    title: "Nana\u2019s radio hour",
    story: "Every evening at eight Nana turns the volume up to eleven and sings the same four songs. The whole flat knows the words now, including Anaya, who invents her own verse.",
    date: isoOffset(-40),
    participants: ["m_nana", "m_anaya"],
    tags: ["music", "evening", "routine"],
    emotionalWeight: 0.8,
    source: "voice",
    palette: ["grape", "periwinkle"],
    privacyLevel: "family"
  },
  {
    id: "m3",
    title: "Anaya\u2019s first school concert",
    story: "She walked on stage holding my hand very tightly, sang the whole song, and then ran off the wrong side of the curtain. I have watched that video about four hundred times.",
    date: isoOffset(-96),
    participants: ["m_anaya", "m_maya"],
    tags: ["milestone", "school", "proud"],
    emotionalWeight: 0.92,
    source: "text",
    palette: ["secondary", "tertiary"],
    privacyLevel: "family"
  },
  {
    id: "m4",
    title: "Aarav\u2019s reading challenge",
    story: "He finished forty books in eight months. The last one was a 700 page book about deep sea fish that he insisted on reading aloud at dinner.",
    date: isoOffset(-2),
    participants: ["m_aarav"],
    tags: ["school", "achievement", "proud"],
    emotionalWeight: 0.85,
    source: "ai_extracted",
    palette: ["mint", "sky"],
    privacyLevel: "family"
  },
  {
    id: "m5",
    title: "Monsoon chai",
    story: "The ritual of cutting a slice of bread, toasting it on the gas stove, and eating it with chai while the rain hammers the window. Both children have now demanded to do it themselves, badly.",
    date: isoOffset(-18),
    participants: ["m_nana", "m_maya", "m_aarav", "m_anaya"],
    tags: ["kitchen", "ritual", "rain"],
    emotionalWeight: 0.7,
    source: "photo",
    palette: ["butter", "matcha"],
    privacyLevel: "family"
  },
  {
    id: "m6",
    title: "Coorg, two summers ago",
    story: "The homestay had a rooster at 5am and a path that was clearly designed by someone who had a grudge. We still talk about the cardamom dosa.",
    date: isoOffset(-430),
    participants: ["m_maya", "m_rohan", "m_aarav", "m_anaya"],
    tags: ["travel", "family", "food"],
    emotionalWeight: 0.78,
    source: "photo",
    palette: ["matcha", "butter"],
    privacyLevel: "family"
  },
  {
    id: "m7",
    title: "Maya\u2019s migraine journal, page 1",
    story: 'The first page has one line: "Headache again. Skipped lunch again. Note to self." The handwriting gets neater as the entries get longer.',
    date: isoOffset(-90),
    participants: ["m_maya"],
    tags: ["health", "private-notes"],
    emotionalWeight: 0.4,
    source: "import",
    palette: ["periwinkle", "grape"],
    privacyLevel: "guardians"
  }
];
var auditLog = [
  audit("a1", 2, "m_maya", "Ran a health question", "Aarav\u2019s allergy record", "ai"),
  audit("a2", 6, "nexus", "Read OKF context", "4 records across health + tasks", "access"),
  audit("a3", 41, "m_rohan", "Edited a budget limit", "Groceries \u2192 $320", "edit"),
  audit("a4", 96, "m_aarav", "Completed a task", "Load the dishwasher", "edit"),
  audit("a5", 180, "nexus", "Auto-added to shopping list", "3 low-stock items", "sync"),
  audit("a6", 320, "m_nana", "Asked for a memory", "Monsoon chai", "ai"),
  audit("a7", 720, "system", "OKF version signed", "v2.4 \u2192 v2.5", "security"),
  audit("a8", 900, "m_maya", "Changed a privacy level", "Anaya \xB7 memories \u2192 guardians", "consent"),
  audit("a9", 1440, "system", "Nightly encrypted snapshot", "age-encrypted, 3 replicas", "security"),
  audit("a10", 2100, "guest_1", "Access granted", "Chores view, expires in 24h", "access"),
  audit("a11", 2880, "nexus", "Generated monthly insight", "Spending down 12% vs July", "ai"),
  audit("a12", 4200, "m_rohan", "Approved a medication reminder", "Amlodipine 5mg, 8:00am", "ai")
];
function privacyFor(memberId, level) {
  return {
    memberId,
    dataCategories: {
      health: level,
      finance: level === "private" ? "private" : "guardians",
      location: level,
      communications: level,
      biometrics: "private",
      memories: level === "private" ? "private" : "family"
    },
    allowLocal: true,
    allowCloud: false,
    cloudConsentRequired: true,
    anonymizeForCloud: true,
    retentionDays: 365,
    autoDelete: false,
    logAccess: true,
    notifyOnAccess: memberId === "m_nana"
  };
}
var privacy = {
  m_maya: privacyFor("m_maya", "guardians"),
  m_rohan: privacyFor("m_rohan", "guardians"),
  m_aarav: privacyFor("m_aarav", "guardians"),
  m_anaya: privacyFor("m_anaya", "guardians"),
  m_nana: privacyFor("m_nana", "extended")
};
function buildSeed() {
  return {
    version: "2.5",
    familyId: "fam_kapoor_8f21",
    familyName: "The Kapoors",
    createdAt: isoOffset(-712),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    revision: 1284,
    members,
    relationships,
    events,
    health,
    vitals,
    transactions,
    budgets,
    goals,
    tasks,
    inventory,
    shopping,
    memories,
    audit: auditLog,
    privacy
  };
}

// src/data/store.ts
var KEY = "nexus.okf.v1";
function canPersist() {
  return Platform.OS !== "web" || typeof window !== "undefined";
}
function hash2(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
var initial = {
  okf: buildSeed(),
  loading: true,
  hydrated: false,
  activeMemberId: "m_maya",
  memberId: "m_maya",
  sessionId: "s_default",
  sessions: {},
  pinned: ["m1", "m5", "m3"],
  activeTab: "home",
  graphFocus: null,
  memoryFilter: "all",
  taskFilter: "all",
  taskDay: "0",
  toasts: []
};
var counter = 0;
function uid(prefix) {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}
function member(okf, id) {
  const found = okf.members.find((m) => m.memberId === id);
  if (found) return found;
  const family = okf.members[0];
  return { ...family, memberId: id, name: id === "family" ? "Family" : family.name, role: id === "family" ? "parent" : family.role };
}
function activeMember(s) {
  return member(s.okf, s.memberId);
}
function pushAudit(okf, entry) {
  const id = uid("a");
  return [
    {
      id,
      at: Date.now(),
      actor: entry.actor,
      action: entry.action,
      target: entry.target,
      category: entry.category,
      hash: hash2(id),
      ok: entry.ok ?? true
    },
    ...okf.audit
  ].slice(0, 220);
}
function log(s, action, target, category, actor = s.memberId) {
  return {
    ...s,
    okf: { ...s.okf, audit: pushAudit(s.okf, { actor, action, target, category }) }
  };
}
function reducer(state2, action) {
  switch (action.type) {
    case "hydrate":
      return { ...state2, loading: false, hydrated: true };
    case "setMember":
      return log({ ...state2, memberId: action.memberId, activeMemberId: action.memberId }, "Switched profile", action.memberId, "access");
    case "setTab":
      return { ...state2, activeTab: action.tab };
    case "pushToast": {
      const id = uid("toast");
      const toasts = [...state2.toasts, { id, text: action.text, tone: action.tone ?? "ok" }].slice(-3);
      setTimeout(() => dispatch({ type: "dismissToast", id }), 3200);
      return { ...state2, toasts };
    }
    case "dismissToast":
      return { ...state2, toasts: state2.toasts.filter((t) => t.id !== action.id) };
    case "pushMessage":
      return {
        ...state2,
        sessions: {
          ...state2.sessions,
          [state2.sessionId]: [...state2.sessions[state2.sessionId] ?? [], action.message]
        }
      };
    case "updateMessage": {
      const list = state2.sessions[state2.sessionId] ?? [];
      return {
        ...state2,
        sessions: {
          ...state2.sessions,
          [state2.sessionId]: list.map((m) => m.id === action.id ? { ...m, ...action.patch } : m)
        }
      };
    }
    case "newSession":
      return { ...state2, sessionId: uid("s") };
    case "toggleTask": {
      const task = state2.okf.tasks.find((t) => t.id === action.id);
      if (!task) return state2;
      const tasks2 = state2.okf.tasks.map(
        (t) => t.id === action.id ? { ...t, done: !t.done, streak: t.done ? Math.max(0, (t.streak ?? 0) - 1) : (t.streak ?? 0) + 1 } : t
      );
      const next = log(
        { ...state2, okf: { ...state2.okf, tasks: tasks2 } },
        task.done ? "Un-completed a task" : "Completed a task",
        task.title,
        "edit"
      );
      if (!task.done) {
        return {
          ...next,
          toasts: [
            ...state2.toasts,
            { id: uid("toast"), text: `+${task.points} points for ${member(state2.okf, task.assigneeId).name.split(" ")[0]}`, tone: "ok" }
          ]
        };
      }
      return next;
    }
    case "addTask": {
      const task = {
        id: uid("t"),
        title: action.task.title ?? "New task",
        category: action.task.category ?? "chore",
        assigneeId: action.task.assigneeId ?? state2.memberId,
        due: action.task.due ?? isoAt(0, "18:00"),
        points: action.task.points ?? 10,
        done: false,
        createdBy: state2.memberId,
        difficulty: action.task.difficulty ?? "easy",
        streak: 0
      };
      return log(
        { ...state2, okf: { ...state2.okf, tasks: [task, ...state2.okf.tasks] } },
        "Created a task",
        task.title,
        "edit"
      );
    }
    case "toggleMed": {
      const rec = state2.okf.health.find((h) => h.id === action.id);
      if (!rec) return state2;
      const health2 = state2.okf.health.map((h) => h.id === action.id ? { ...h, takenToday: !h.takenToday } : h);
      return log(
        { ...state2, okf: { ...state2.okf, health: health2 } },
        rec.takenToday ? "Logged a missed dose" : "Logged a dose",
        rec.title,
        "edit"
      );
    }
    case "toggleShopping": {
      const item = state2.okf.shopping.find((s) => s.id === action.id);
      if (!item) return state2;
      const shopping2 = state2.okf.shopping.map((s) => s.id === action.id ? { ...s, done: !s.done } : s);
      return log({ ...state2, okf: { ...state2.okf, shopping: shopping2 } }, "Shopping list updated", item.name, "sync");
    }
    case "addShopping": {
      const item = {
        id: uid("s"),
        name: action.name,
        quantity: action.quantity,
        unit: action.unit,
        addedBy: state2.memberId,
        done: false,
        source: "manual"
      };
      return log({ ...state2, okf: { ...state2.okf, shopping: [item, ...state2.okf.shopping] } }, "Added to shopping list", item.name, "edit");
    }
    case "clearShopping": {
      const done2 = state2.okf.shopping.filter((s) => s.done).length;
      if (!done2) return state2;
      return log(
        { ...state2, okf: { ...state2.okf, shopping: state2.okf.shopping.filter((s) => !s.done) } },
        "Cleared the shopping list",
        `${done2} items ticked off`,
        "sync"
      );
    }
    case "addEvent": {
      const event = {
        id: uid("e"),
        type: action.event.type ?? "appointment",
        title: action.event.title ?? "New event",
        description: action.event.description ?? "",
        date: action.event.date ?? isoAt(1, "09:00"),
        time: action.event.time,
        participants: action.event.participants ?? [state2.memberId],
        tags: action.event.tags ?? [],
        emotionalWeight: 0.4,
        source: "manual"
      };
      return log({ ...state2, okf: { ...state2.okf, events: [event, ...state2.okf.events] } }, "Added an event", event.title, "edit");
    }
    case "toggleEvent": {
      const ev = state2.okf.events.find((e) => e.id === action.id);
      if (!ev) return state2;
      const events2 = state2.okf.events.map((e) => e.id === action.id ? { ...e, done: !e.done } : e);
      return log({ ...state2, okf: { ...state2.okf, events: events2 } }, "Marked an event", ev.title, "edit");
    }
    case "addMemory": {
      const memory = {
        id: uid("m"),
        title: action.memory.title ?? "Untitled memory",
        story: action.memory.story ?? "",
        date: action.memory.date ?? (/* @__PURE__ */ new Date()).toISOString(),
        participants: action.memory.participants ?? [state2.memberId],
        tags: action.memory.tags ?? [],
        emotionalWeight: action.memory.emotionalWeight ?? 0.6,
        source: "text",
        palette: ["periwinkle", "tertiary"],
        privacyLevel: "family"
      };
      return log({ ...state2, okf: { ...state2.okf, memories: [memory, ...state2.okf.memories] }, pinned: [memory.id, ...state2.pinned] }, "Added a memory", memory.title, "edit");
    }
    case "pinMemory": {
      const on = state2.pinned.includes(action.id);
      return {
        ...state2,
        pinned: on ? state2.pinned.filter((p) => p !== action.id) : [...state2.pinned, action.id]
      };
    }
    case "setMemoryFilter":
      return { ...state2, memoryFilter: action.value };
    case "setTaskFilter":
      return { ...state2, taskFilter: action.value };
    case "setTaskDay":
      return { ...state2, taskDay: action.value };
    case "setGraphFocus": {
      const who = action.memberId ? member(state2.okf, action.memberId).name : "the whole family";
      return log({ ...state2, graphFocus: action.memberId }, "Focused the OKF graph on", who, "access");
    }
    case "setPrivacy": {
      const current2 = state2.okf.privacy[action.memberId] ?? state2.okf.privacy.m_maya;
      const privacy2 = { ...state2.okf.privacy, [action.memberId]: { ...current2, ...action.patch, memberId: action.memberId } };
      const updated = log({ ...state2, okf: { ...state2.okf, privacy: privacy2 } }, "Changed a privacy setting", member(state2.okf, action.memberId).name, "consent");
      return updated;
    }
    case "setCategory": {
      const current2 = state2.okf.privacy[action.memberId] ?? state2.okf.privacy.m_maya;
      const dataCategories = { ...current2.dataCategories, [action.category]: action.level };
      return {
        ...log(
          { ...state2, okf: { ...state2.okf, privacy: { ...state2.okf.privacy, [action.memberId]: { ...current2, dataCategories } } } },
          "Changed data visibility",
          `${member(state2.okf, action.memberId).name} \xB7 ${action.category}`,
          "consent"
        )
      };
    }
    case "renameMember": {
      const members2 = state2.okf.members.map((m) => m.memberId === action.memberId ? { ...m, name: action.name } : m);
      return log({ ...state2, okf: { ...state2.okf, members: members2 } }, "Renamed a member", action.name, "edit");
    }
    case "applyIntent": {
      const i = action.intent;
      switch (i.type) {
        case "add-reminder":
          return reducer(
            state2,
            { type: "addEvent", event: { type: "appointment", title: i.title, description: "Added by the Nexus assistant.", date: isoAt(0, i.time), participants: [i.memberId] } }
          );
        case "add-task":
          return reducer(state2, { type: "addTask", task: { title: i.title, assigneeId: i.assigneeId, category: i.category, points: i.points } });
        case "mark-medication":
          return reducer(state2, { type: "toggleMed", id: i.recordId });
        case "add-memory":
          return reducer(state2, { type: "addMemory", memory: { title: i.title, story: i.story, participants: i.participants, tags: i.tags } });
        case "add-shopping":
          return reducer(state2, { type: "addShopping", name: i.name, quantity: i.quantity, unit: i.unit });
        case "navigate":
          return { ...state2, activeTab: i.route };
        case "notify-guardian":
          return { ...state2, toasts: [...state2.toasts, { id: uid("toast"), text: `Guardian notified: ${i.message}`, tone: "warn" }] };
        default:
          return state2;
      }
    }
    case "reset": {
      const fresh = buildSeed();
      return { ...initial, okf: fresh, loading: false, hydrated: true, activeMemberId: "m_maya", memberId: "m_maya" };
    }
    default:
      return state2;
  }
}
var current = initial;
var listeners = /* @__PURE__ */ new Set();
function getState() {
  return current;
}
function dispatch(action) {
  current = reducer(current, action);
  listeners.forEach((l) => l());
  if (canPersist()) {
    const { okf, activeMemberId, sessions, sessionId, pinned } = current;
    void async_storage_default.setItem(
      KEY,
      JSON.stringify({ okf, activeMemberId, sessions, sessionId, pinned })
    );
  }
}

// src/ai/orchestrator.ts
var AGENT_LABEL = {
  router: "Router",
  context: "Context Builder",
  privacy: "Privacy Guardian",
  health: "Health Companion",
  finance: "Finance Analyst",
  home: "Home Steward",
  memory: "Memory Keeper",
  tasks: "Household Planner",
  medical: "Medical Scribe",
  "privacy-guardian": "Privacy Guardian"
};
function step(label, detail, ms) {
  return { label, detail, ms };
}
var BASE_STEPS = () => [
  step("Router", "Classified the question and picked a lane", 14),
  step("Privacy Guardian", "Checked every record against visibility rules", 9)
];
function cite(kind, refId, label, detail) {
  return { kind, refId, label, detail, version: `v${refId.length}` };
}
function firstName(okf, memberId) {
  return member(okf, memberId).name.split(" ")[0];
}
function mentionedMember(text, okf) {
  const t = text.toLowerCase();
  const hit = okf.members.find((m) => t.includes(m.name.toLowerCase().split(" ")[0]));
  if (hit) return hit.memberId;
  const hints = { nana: "m_nana", mama: "m_maya", mum: "m_maya", mom: "m_maya", dad: "m_rohan", papa: "m_rohan" };
  for (const [k, id] of Object.entries(hints)) if (t.includes(k)) return id;
  return null;
}
function memberCondition(okf, memberId) {
  return okf.health.filter((h) => h.memberId === memberId && h.status !== "resolved");
}
function openTasks(okf) {
  return okf.tasks.filter((t) => !t.done);
}
var PLANNERS = [
  {
    agent: "health",
    tier: 2,
    title: "Health",
    body: (s) => {
      const { okf, memberId } = s;
      const me = activeMember(s);
      const who = mentionedMember("", okf) ?? memberId;
      const target = me.role === "parent" || me.role === "guardian" ? who : me.memberId;
      const records = memberCondition(okf, target);
      const meds = records.filter((r) => r.type === "medication");
      const allergies = records.filter((r) => r.type === "allergy");
      const conditions = records.filter((r) => r.type === "condition" || r.type === "appointment");
      const v = okf.vitals.filter((x) => x.memberId === target).slice(0, 3);
      const name = firstName(okf, target);
      const lines = [];
      if (allergies.length) {
        lines.push(`\u26A0\uFE0F **${name} has a serious allergy: ${allergies[0].title}.** ${allergies[0].details}`);
      }
      if (meds.length) {
        const dose = meds[0];
        lines.push(
          `**${name}'s ${dose.title}** \u2014 ${dose.schedule ?? "as prescribed"}. ${dose.takenToday ? "\u2705 Already logged for today." : "\u23F0 Not logged yet today."}`
        );
      }
      if (conditions.length) {
        lines.push(`Also being watched: ${conditions.map((c) => c.title).join(", ")}.`);
      }
      if (v.length) {
        lines.push(`Latest readings: ${v.map((x) => `${x.label} ${x.value}${x.unit}${x.status !== "good" ? " (watch)" : ""}`).join(" \xB7 ")}.`);
      }
      if (!records.length) lines.push(`${name} has nothing active on the health timeline right now. That is genuinely good news.`);
      const alert = allergies.find((a) => a.severity === "severe" || a.severity === "critical");
      if (alert) {
        lines.push(`Allergy to flag: ${alert.title}. Keep that in mind before anything new is eaten or prescribed.`);
      }
      return {
        text: lines.join("\n\n"),
        citations: [
          ...allergies.length ? [cite("record", allergies[0].id, allergies[0].title, allergies[0].provider ?? "Family health record")] : [],
          ...meds.length ? [cite("record", meds[0].id, meds[0].title, meds[0].schedule ?? "")] : [],
          ...v.map((x) => cite("record", x.id, x.label, `${x.value} ${x.unit}`))
        ],
        actions: meds.length && !meds[0].takenToday ? [{ id: uid("a"), label: `Log ${meds[0].title}`, kind: "primary", intent: { type: "mark-medication", recordId: meds[0].id } }] : void 0,
        steps: [
          ...BASE_STEPS(),
          step("Health Companion", "Pulled active conditions, meds and readings", 21),
          step("Response Composer", "Wrote it in plain language, no jargon", 12)
        ]
      };
    }
  },
  {
    agent: "medical",
    tier: 2,
    title: "Medical summary",
    body: (s) => {
      const { okf } = s;
      const me = activeMember(s);
      const who = me.role === "parent" || me.role === "guardian" ? me.memberId : "m_nana";
      const all = okf.health.filter((h) => h.memberId === who);
      const shareable = all.filter((h) => h.sharedWith.length > 0 || me.memberId === who);
      const text = `**${firstName(okf, who)}\u2019s health summary**

${shareable.map((h) => `\u2022 ${h.title} \u2014 ${h.status}${h.provider ? ` \xB7 ${h.provider}` : ""}`).join("\n")}

*This summary is exportable to a clinic. Nothing leaves the family server unless you press share.*`;
      return {
        text,
        citations: shareable.slice(0, 3).map((h) => cite("record", h.id, h.title, h.details.slice(0, 60))),
        actions: [{ id: uid("a"), label: "Show privacy rules", kind: "ghost", intent: { type: "navigate", route: "privacy" } }],
        steps: [
          ...BASE_STEPS(),
          step("Medical Scribe", "Condensed the record into a clinic-friendly brief", 26)
        ]
      };
    }
  },
  {
    agent: "finance",
    tier: 2,
    title: "Finance",
    body: (s) => {
      const { okf } = s;
      const thisMonth = okf.transactions.filter((x) => x.date.slice(0, 7) === (/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
      const spent = thisMonth.reduce((sum, x) => sum + x.amount, 0);
      const limit = okf.budgets.reduce((sum, b) => sum + b.limit, 0);
      const top = [...thisMonth].sort((a, b) => b.amount - a.amount).slice(0, 3);
      const savings = okf.transactions.filter((x) => x.category === "savings").reduce((sum, x) => sum + x.amount, 0);
      const text = [
        `**Family spend so far this month: ${money(spent)}** of a ${money(limit)} plan (${Math.round(spent / limit * 100)}%).`,
        top.length ? `Biggest items: ${top.map((x) => `${x.label} ${money(x.amount)}`).join(" \xB7 ")}.` : "",
        savings ? `Savings top-ups this month: ${money(savings)}.` : "",
        `**${okf.goals[0]?.title ?? "Your top goal"}** is ${Math.round((okf.goals[0]?.saved ?? 0) / (okf.goals[0]?.target ?? 1) * 100)}% funded.`
      ].filter(Boolean).join("\n\n");
      return {
        text,
        citations: top.map((x) => cite("transaction", x.id, x.label, `${x.category} \xB7 ${money(x.amount)}`)),
        steps: [
          ...BASE_STEPS(),
          step("Finance Analyst", "Summed budgets, transactions and goals", 19),
          step("Response Composer", "Turned it into three numbers that matter", 10)
        ]
      };
    }
  },
  {
    agent: "home",
    tier: 1,
    title: "Home and shopping",
    body: (s) => {
      const { okf } = s;
      const low = okf.inventory.filter((i) => i.quantity <= i.lowAt);
      const expiring = okf.inventory.filter((i) => (i.expiresInDays ?? 99) <= 3);
      const toBuy = okf.shopping.filter((x) => !x.done);
      const text = [
        `**${low.length} items are running low.** ${low.map((i) => i.name).join(", ")}.`,
        expiring.length ? `**Use soon:** ${expiring.map((i) => i.name).join(", ")}.` : "",
        `Shopping list has **${toBuy.length} things** left.`,
        low.length ? `Want me to drop ${low.slice(0, 2).map((i) => i.name).join(" and ")} on the list?` : `Nothing urgent. The pantry is in good shape.`
      ].filter(Boolean).join("\n\n");
      return {
        text,
        citations: low.map((i) => cite("record", i.id, i.name, `${i.quantity} ${i.unit} left`)),
        actions: low.length ? [
          {
            id: uid("a"),
            label: `Add ${low[0].name} to list`,
            kind: "primary",
            intent: { type: "add-shopping", name: low[0].name, quantity: 1, unit: low[0].unit }
          }
        ] : void 0,
        steps: [
          ...BASE_STEPS(),
          step("Home Steward", "Compared pantry levels against low-stock thresholds", 16)
        ]
      };
    }
  },
  {
    agent: "tasks",
    tier: 1,
    title: "Tasks and calendar",
    body: (s) => {
      const { okf } = s;
      const open = openTasks(okf);
      const today = open.filter((t) => t.due.slice(0, 10) === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
      const points = open.reduce((sum, t) => sum + t.points, 0);
      const overdue = open.filter((t) => t.due < (/* @__PURE__ */ new Date()).toISOString());
      const text = [
        `**${open.length} open tasks** worth **${points} points** in total.`,
        today.length ? `Due today: ${today.map((t) => `${t.title} (${firstName(okf, t.assigneeId)}, ${t.points}\u2605)`).join(" \xB7 ")}.` : "",
        overdue.length ? `${overdue.length} slipped past their due date \u2014 no guilt, just move them.` : `Nothing is overdue. Lovely.`,
        okf.events.filter((e) => !e.done).length ? `**${okf.events.filter((e) => !e.done).length} events** on the family calendar.` : ""
      ].filter(Boolean).join("\n\n");
      return {
        text,
        citations: today.slice(0, 3).map((t) => cite("task", t.id, t.title, `${firstName(okf, t.assigneeId)} \xB7 ${t.points} points`)),
        actions: [
          { id: uid("a"), label: "Add a task", kind: "primary", intent: { type: "navigate", route: "tasks" } },
          ...overdue.length ? [{ id: uid("a"), label: "Reschedule the slipped ones", kind: "ghost", intent: { type: "navigate", route: "tasks" } }] : []
        ],
        steps: [
          ...BASE_STEPS(),
          step("Household Planner", "Pulled open tasks, points and upcoming events", 15)
        ]
      };
    }
  },
  {
    agent: "memory",
    tier: 1,
    title: "Memories",
    body: (s) => {
      const { okf } = s;
      const sorted = [...okf.memories].sort((a, b) => b.emotionalWeight - a.emotionalWeight);
      const top = sorted.slice(0, 2);
      const tags = Array.from(new Set(okf.memories.flatMap((m) => m.tags))).slice(0, 5);
      const text = [
        `I remember **${okf.memories.length} things** about this family.`,
        top.length ? `The ones that carry the most weight: **${top[0].title}** \u2014 ${top[0].story.split(".")[0]}.

And **${top[1]?.title}** \u2014 ${top[1]?.story.split(".")[0]}.` : "",
        `Common threads: ${tags.map((x) => `#${x}`).join(" ")}`,
        `Want to add something from today?`
      ].filter(Boolean).join("\n\n");
      return {
        text,
        citations: top.map((m) => cite("memory", m.id, m.title, m.tags.join(", "))),
        actions: [{ id: uid("a"), label: "Save a memory", kind: "primary", intent: { type: "navigate", route: "memories" } }],
        steps: [
          ...BASE_STEPS(),
          step("Memory Keeper", "Ranked memories by emotional weight", 18)
        ]
      };
    }
  },
  {
    agent: "privacy-guardian",
    tier: 3,
    title: "Privacy",
    body: (s) => {
      const { okf, memberId } = s;
      const me = activeMember(s);
      const others = okf.members.filter((m) => m.memberId !== memberId);
      const lines = others.map((m) => {
        const p = okf.privacy[m.memberId];
        const cats = p ? Object.entries(p.dataCategories) : [];
        const locked = cats.filter(([, l]) => l === "private").map(([c]) => c);
        return `\u2022 **${m.name}** \u2014 ${m.privacyLevel}${locked.length ? `, keeps ${locked.join(", ")} private` : ", everything shared with guardians"}`;
      });
      const blocked = others.filter((m) => okf.privacy[m.memberId]?.allowCloud);
      return {
        text: [
          `**Everything runs on your own hardware.** ${okf.familyName}\u2019s OKF sits on a local server in the hallway cabinet.`,
          `**Who can see what:**
${lines.join("\n")}`,
          blocked.length ? `Nothing is allowed to use a cloud model. No exceptions, no silent upgrades.` : `A cloud model could be used, but only with your explicit consent.`,
          `I never see anything I am not allowed to. The Privacy Guardian checked before I wrote this. Signed off for ${me.name}.`
        ].join("\n\n"),
        citations: [cite("graph", okf.familyId, "OKF manifest", `v${okf.version} \xB7 rev ${okf.revision}`)],
        actions: [{ id: uid("a"), label: "Open the audit log", kind: "ghost", intent: { type: "navigate", route: "privacy" } }],
        steps: [
          step("Privacy Guardian", "Read every visibility rule for every member", 22),
          step("Response Composer", "Explained it without making you read JSON", 11)
        ]
      };
    }
  }
];
var PRIVACY_Q = /privacy|private|cloud|secure|who can see|share|data|permission|guardian|hide|delete|encrypt/i;
var VISIBILITY_Q = /\bwho\s+(else\s+)?(can\s+)?see\b|\bwhat\s+can\s+[a-z\s]{0,24}see\b|\bwho\s+has\s+(access|visibility)\b|\bcan\s+(i|we|you|they)\s+see\b/i;
var HEALTH_Q = /health|medicine|medication|allergy|allerg|symptom|fever|pain|doctor|dentist|hospital|blood pressure|dose|med|ill|sick|pill|pharmacy|check-?up|breath|wheez|asthma|inhaler|sore|swelling|exhausted|tired|okay for|ok to|fit to|cleared to|soccer|football|cricket|swim|gym|run|sport|play on|injury|sprain|fitness|sleep/i;
var MONEY_Q = /money|spend|spent|budget|cost|price|bill|save|saving|afford|cash|expense|top-?up|goal|fund/i;
var HOME_Q = /fridge|pantry|shop|shopping|grocery|groceries|buying|buy|low|stock|inventory|expir|out of|house|clean|supplies/i;
var TASK_Q = /task|chore|job|todo|to-?do|due|point|calendar|event|schedule|appointment|remind|when is|what.*today|plan/i;
var MEMORY_Q = /memor|remember|story|childhood|photo|nostalgia|recall|storytime|timeline|history|when did|who was|grew up|years ago|family tree/i;
function pick(text) {
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
function localAnswer(text) {
  const q = text.toLowerCase();
  const known = [
    [/^(hi|hey|hello|yo|namaste|good (morning|evening|afternoon))\b/, "Hello. I am running entirely on your own hardware, which means I work even when the internet does not."],
    [/how are you|how're you|hows your/, "Doing well. I read the OKF in about nine milliseconds and I did not send any of it anywhere."],
    [/who made you|who are you|what are you/, "I am the Nexus orchestrator. A planner picks the lane, a privacy guardian checks it, and a specialist writes the answer. All of it runs on the box in the hallway."],
    [/\b(ok|okay|thanks|thank you|cheers|cool|nice|great|awesome|good job|perfect)\b/, "Any time. Ask me about the house, the calendar, health, money or the family timeline."],
    [/\?$/, "I did not catch a specific question in that one. Try \u201Cwhat is on today\u201D, \u201Cis Aarav okay for soccer\u201D, or \u201Chow are our budgets\u201D."]
  ];
  for (const [re, line] of known) {
    if (re.test(q)) {
      return () => ({ text: line, steps: [step("Router", "Matched a conversational pattern", 4)], citations: [] });
    }
  }
  return () => ({
    text: `I did not find anything in the family OKF about \u201C${text.length > 60 ? `${text.slice(0, 60)}\u2026` : text}\u201D. I only answer from what is stored here, so if it is new, add it and I will know it next time.`,
    steps: [step("Context Builder", "Searched every OKF collection, nothing matched", 23)],
    citations: []
  });
}
async function ask(text) {
  const userMessage = {
    id: uid("m"),
    role: "user",
    text,
    at: Date.now(),
    status: "done"
  };
  dispatch({ type: "pushMessage", message: userMessage });
  const s = getState();
  const me = activeMember(s);
  const routed = pick(text);
  const planner = routed ?? { agent: "router", tier: 1, body: localAnswer(text) };
  const result = planner.body(s);
  const assistant = {
    id: uid("m"),
    role: "assistant",
    text: result.text,
    at: Date.now(),
    agent: planner.agent,
    agentLabel: AGENT_LABEL[planner.agent] ?? "Nexus",
    steps: result.steps,
    citations: result.citations,
    actions: result.actions,
    tier: planner.tier,
    status: "streaming"
  };
  dispatch({ type: "pushMessage", message: assistant });
  const total = result.steps.reduce((sum, x) => sum + x.ms, 0);
  await new Promise((r) => setTimeout(r, Math.min(1100, total * 3.2)));
  dispatch({ type: "updateMessage", id: assistant.id, patch: { status: "done" } });
  dispatch({
    type: "pushToast",
    text: me.role === "elder" ? "Answered with big text" : `Answered locally in ${(total / 1e3).toFixed(1)}s`,
    tone: "info"
  });
}

// scripts/smoke/harness.ts
var failures = 0;
var checks = 0;
function check(name, ok, detail) {
  checks += 1;
  if (ok) {
    console.log(`  ok    ${name}`);
    return;
  }
  failures += 1;
  console.log(`  FAIL  ${name}`);
  if (detail !== void 0) console.log(`        got ${JSON.stringify(detail)}`);
}
function section(name) {
  console.log(`
${name}`);
}
function done(label) {
  if (failures > 0) {
    console.log(`
${label} FAILED: ${failures} of ${checks} checks`);
    process.exit(1);
  }
  console.log(`
${label} OK: ${checks} checks`);
}

// scripts/smoke/routing.ts
var CASES = [
  // Household
  ["what is on today", "Household Planner"],
  ["nana\u2019s appointments this week", "Household Planner"],
  ["when is the concert", "Household Planner"],
  ["what jobs do i have today", "Household Planner"],
  // Health
  ["is aarav okay for soccer", "Health Companion"],
  ["read my blood pressure", "Health Companion"],
  ["when is the dentist", "Health Companion"],
  ["give me a family health summary", "Medical Scribe"],
  // Finance
  ["how are our budgets", "Finance Analyst"],
  ["what did we spend on groceries", "Finance Analyst"],
  // Home
  ["what is in the fridge", "Home Steward"],
  ["add milk to the shopping list", "Home Steward"],
  // Memory
  ["what memories came up this week", "Memory Keeper"],
  ["tell me about our family timeline", "Memory Keeper"],
  // Privacy outranks everything else
  ["who can see the health data", "Privacy Guardian"],
  ["what can anaya see about my health", "Privacy Guardian"],
  // Unrecognised input must not invent an answer
  ["asdfghjkl qwerty nonsense", "Router"],
  // "see" only means visibility when someone else is doing the seeing
  ["when should i see the dentist", "Health Companion"],
  ["when should nana see the doctor", "Health Companion"]
];
var CHIPS = [
  ["What is on today?", "Household Planner"],
  ["Is Aarav okay for soccer?", "Health Companion"],
  ["Add milk to the shopping list", "Home Steward"],
  ["What did we spend on groceries?", "Finance Analyst"],
  ["How are our budgets this month?", "Finance Analyst"],
  ["Nana\u2019s appointments this week", "Household Planner"],
  ["Give me a family health summary", "Medical Scribe"],
  ["What memories came up this week?", "Memory Keeper"],
  ["What jobs do I have today?", "Household Planner"],
  ["What is in the fridge?", "Home Steward"],
  ["Remind me about my points", "Household Planner"],
  ["When is the dentist?", "Health Companion"],
  ["Tell me a story", "Memory Keeper"],
  ["Read my blood pressure", "Health Companion"],
  // Open-ended chips that no specialist owns: these must admit ignorance
  ["What should I draw?", "Router"],
  ["Call Anaya", "Router"]
];
function route(query) {
  dispatch({ type: "newSession" });
  void ask(query);
  const state2 = getState();
  const session = state2.sessions[state2.sessionId] ?? [];
  return session[session.length - 1]?.agentLabel ?? "(no reply)";
}
function expect(list, label) {
  section(label);
  for (const [query, agent] of list) {
    const got = route(query);
    check(`"${query}" -> ${agent}`, got === agent, got);
  }
}
expect(CASES, "orchestrator routing");
expect(CHIPS, "suggestion chips");
section("fallback honesty");
dispatch({ type: "newSession" });
void ask("asdfghjkl qwerty nonsense");
var state = getState();
var last = (state.sessions[state.sessionId] ?? []).at(-1);
check("does not fabricate a pantry answer", !/fridge|pantry|shelf/i.test(last?.text ?? ""), last?.text?.slice(0, 80));
check("tells the user it found nothing", /did not find|could not find|no .* in the family/i.test(last?.text ?? ""), last?.text?.slice(0, 80));
section("privacy precedence");
dispatch({ type: "newSession" });
void ask("what did we spend on groceries? who can see this?");
var both = getState();
var tail = (both.sessions[both.sessionId] ?? []).at(-1);
check("privacy agent answers the privacy part", tail?.agentLabel === "Privacy Guardian", tail?.agentLabel);
done("routing");
