import { alpha, bestOn, darken, lighten, mix } from '@/lib/color';

export const THEME_NAMES = [
  'periwinkle',
  'bubblegum',
  'mint',
  'peach',
  'lemon',
  'sky',
  'grape',
  'matcha',
] as const;

export type ThemeName = (typeof THEME_NAMES)[number];
export type ColorMode = 'light' | 'dark';

type AccentSet = {
  label: string;
  /** Swatch shown in the theme picker. */
  swatch: [string, string, string];
  primary: string;
  secondary: string;
  tertiary: string;
  butter: string;
};

export const ACCENTS: Record<ThemeName, AccentSet> = {
  periwinkle: {
    label: 'Periwinkle',
    swatch: ['#6C7CE4', '#FFA6C9', '#7FE3C3'],
    primary: '#6C7CE4',
    secondary: '#FFA6C9',
    tertiary: '#7FE3C3',
    butter: '#FFE78F',
  },
  bubblegum: {
    label: 'Bubblegum',
    swatch: ['#F2679B', '#6C7CE4', '#FFC46B'],
    primary: '#F2679B',
    secondary: '#6C7CE4',
    tertiary: '#FFC46B',
    butter: '#FFE3B0',
  },
  mint: {
    label: 'Mint',
    swatch: ['#21B08A', '#7FB2FF', '#FFD166'],
    primary: '#21B08A',
    secondary: '#7FB2FF',
    tertiary: '#FFD166',
    butter: '#FFF0B3',
  },
  peach: {
    label: 'Peach',
    swatch: ['#F2794E', '#FFA6C9', '#6FD6C2'],
    primary: '#F2794E',
    secondary: '#FFA6C9',
    tertiary: '#6FD6C2',
    butter: '#FFE1A8',
  },
  lemon: {
    label: 'Lemon',
    swatch: ['#D89A0B', '#7FB2FF', '#FF9FB6'],
    primary: '#D89A0B',
    secondary: '#7FB2FF',
    tertiary: '#FF9FB6',
    butter: '#FFF3C4',
  },
  sky: {
    label: 'Sky',
    swatch: ['#3B93E8', '#8AD3C8', '#FFC46B'],
    primary: '#3B93E8',
    secondary: '#8AD3C8',
    tertiary: '#FFC46B',
    butter: '#FFE9A8',
  },
  grape: {
    label: 'Grape',
    swatch: ['#8B4FD6', '#FF8FB1', '#63D2B0'],
    primary: '#8B4FD6',
    secondary: '#FF8FB1',
    tertiary: '#63D2B0',
    butter: '#FFD98E',
  },
  matcha: {
    label: 'Matcha',
    swatch: ['#6E9E4E', '#E8A87C', '#7FC8D8'],
    primary: '#6E9E4E',
    secondary: '#E8A87C',
    tertiary: '#7FC8D8',
    butter: '#F2E8A0',
  },
};

export const PRIVACY_LEVELS = [
  'private',
  'guardians',
  'family',
  'extended',
  'professionals',
  'anonymous',
] as const;

export type PrivacyLevel = (typeof PRIVACY_LEVELS)[number];

export const PRIVACY_META: Record<
  PrivacyLevel,
  { label: string; blurb: string; glyph: string }
> = {
  private: { label: 'Private', blurb: 'Only this member', glyph: '🔒' },
  guardians: { label: 'Guardians', blurb: 'Parents & guardians', glyph: '🛡️' },
  family: { label: 'Family', blurb: 'All family members', glyph: '🏡' },
  extended: { label: 'Extended', blurb: 'Grandparents & caregivers', glyph: '🤝' },
  professionals: { label: 'Professionals', blurb: 'Doctors & advisors, with consent', glyph: '🩺' },
  anonymous: { label: 'Anonymous', blurb: 'Aggregated for insights', glyph: '✨' },
};

export type SemanticTone = 'positive' | 'warning' | 'danger' | 'info';

export type ThemeTokens = {
  name: ThemeName;
  mode: ColorMode;
  isDark: boolean;

  /** Canvas behind everything. */
  canvas: string;
  /** Cards and modules. */
  surface: string;
  /** Slightly recessed / alternate surface. */
  surfaceAlt: string;
  /** Sheets, tab bar, sticky headers. */
  surfaceRaised: string;
  /** 12% primary wash used for icon orbs and active pills. */
  tint: string;
  /** Hairline border. */
  outline: string;
  /** Softest hairline, for nested dividers. */
  outlineSoft: string;

  primary: string;
  onPrimary: string;
  primarySoft: string;
  secondary: string;
  secondarySoft: string;
  tertiary: string;
  tertiarySoft: string;
  butter: string;
  butterSoft: string;

  text: string;
  textMuted: string;
  textFaint: string;

  onCanvasScrim: string;

  tone: Record<SemanticTone, { fg: string; bg: string; border: string }>;
  privacy: Record<PrivacyLevel, { fg: string; bg: string; border: string }>;

  /** Translucent helpers so components never hard-code rgba(). */
  a: {
    primary: (o: number) => string;
    secondary: (o: number) => string;
    tertiary: (o: number) => string;
    butter: (o: number) => string;
    text: (o: number) => string;
    canvas: (o: number) => string;
  };
};

const INK = '#2D2E49';
const NIGHT_INK = '#F3F2FB';
const NIGHT_BASE = '#12131F';

function buildTone(fg: string, bg: string, border: string, isDark: boolean) {
  return {
    fg: isDark ? lighten(fg, 0.24) : darken(fg, 0.06),
    bg: isDark ? mix(fg, NIGHT_BASE, 0.82) : mix(fg, '#ffffff', 0.86),
    border: isDark ? mix(fg, NIGHT_BASE, 0.62) : mix(fg, '#ffffff', 0.68),
  };
}

export function buildTheme(name: ThemeName, mode: ColorMode): ThemeTokens {
  const accent = ACCENTS[name];
  const isDark = mode === 'dark';

  // Dark mode needs a lifted primary so it reads on near-black surfaces.
  const primary = isDark ? lighten(accent.primary, 0.26) : accent.primary;
  const secondary = isDark ? lighten(accent.secondary, 0.2) : accent.secondary;
  const tertiary = isDark ? lighten(accent.tertiary, 0.18) : accent.tertiary;
  const butter = isDark ? lighten(accent.butter, 0.1) : accent.butter;

  const canvas = isDark
    ? mix(primary, NIGHT_BASE, 0.16)
    : mix(primary, '#ffffff', 0.965);
  const surface = isDark ? mix(primary, NIGHT_BASE, 0.09) : '#ffffff';
  const surfaceAlt = isDark ? mix(primary, NIGHT_BASE, 0.14) : mix(primary, '#ffffff', 0.945);
  const surfaceRaised = isDark ? mix(primary, NIGHT_BASE, 0.05) : '#ffffff';
  const tint = isDark ? mix(primary, NIGHT_BASE, 0.28) : mix(primary, '#ffffff', 0.885);
  const outline = isDark ? mix(primary, NIGHT_BASE, 0.3) : mix(primary, '#ffffff', 0.855);
  const outlineSoft = isDark ? mix(primary, NIGHT_BASE, 0.2) : mix(primary, '#ffffff', 0.915);

  const text = isDark ? NIGHT_INK : INK;
  const textMuted = isDark ? mix(text, canvas, 0.36) : mix(text, canvas, 0.34);
  const textFaint = isDark ? mix(text, canvas, 0.55) : mix(text, canvas, 0.55);

  const make = (c: string, softBase: string) => ({
    soft: isDark ? mix(c, NIGHT_BASE, 0.76) : mix(c, '#ffffff', 0.855),
    tint: isDark ? mix(c, NIGHT_BASE, 0.7) : mix(c, softBase, 0.9),
  });

  return {
    name,
    mode,
    isDark,

    canvas,
    surface,
    surfaceAlt,
    surfaceRaised,
    tint,
    outline,
    outlineSoft,

    primary,
    onPrimary: bestOn(primary),
    primarySoft: isDark ? mix(primary, NIGHT_BASE, 0.76) : mix(primary, '#ffffff', 0.86),
    secondary,
    secondarySoft: make(secondary, canvas).soft,
    tertiary,
    tertiarySoft: make(tertiary, canvas).soft,
    butter,
    butterSoft: make(butter, canvas).soft,

    text,
    textMuted,
    textFaint,

    onCanvasScrim: isDark ? alpha('#000000', 0.55) : alpha(INK, 0.32),

    tone: {
      positive: buildTone('#1FA97F', '', '', isDark),
      warning: buildTone('#C2850C', '', '', isDark),
      danger: buildTone('#D1435B', '', '', isDark),
      info: buildTone('#3A6FD8', '', '', isDark),
    },
    privacy: {
      private: buildTone('#7A5AF8', '', '', isDark),
      guardians: buildTone('#3A6FD8', '', '', isDark),
      family: buildTone('#1FA97F', '', '', isDark),
      extended: buildTone('#C2850C', '', '', isDark),
      professionals: buildTone('#C2578E', '', '', isDark),
      anonymous: buildTone('#5C6478', '', '', isDark),
    },

    a: {
      primary: (o) => alpha(primary, o),
      secondary: (o) => alpha(secondary, o),
      tertiary: (o) => alpha(tertiary, o),
      butter: (o) => alpha(butter, o),
      text: (o) => alpha(text, o),
      canvas: (o) => alpha(canvas, o),
    },
  };
}

export type RoleAccent = 'primary' | 'secondary' | 'tertiary' | 'butter';

/** Resolve one of the four accent slots to concrete colours. */
export function accentOf(t: ThemeTokens, slot: RoleAccent | ThemeName) {
  if (slot === 'primary') return { fg: t.primary, bg: t.primarySoft };
  if (slot === 'secondary') return { fg: t.secondary, bg: t.secondarySoft };
  if (slot === 'tertiary') return { fg: t.tertiary, bg: t.tertiarySoft };
  if (slot === 'butter') return { fg: t.butter, bg: t.butterSoft };
  const a = ACCENTS[slot as ThemeName];
  return { fg: a.primary, bg: mix(a.primary, '#ffffff', 0.86) };
}
