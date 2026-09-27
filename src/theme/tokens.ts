/** Fixed font faces, mapped from the Stitch "Nexus Bubbles" design system. */
export const FONTS = {
  quicksand: {
    medium: 'Quicksand_500Medium',
    semibold: 'Quicksand_600SemiBold',
    bold: 'Quicksand_700Bold',
  },
  nunito: {
    regular: 'NunitoSans_400Regular',
    medium: 'NunitoSans_500Medium',
    semibold: 'NunitoSans_600SemiBold',
    bold: 'NunitoSans_700Bold',
  },
} as const;

export const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
  gutter: 20,
} as const;

export const RADIUS = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

/** Font sizes before the Elder Mode multiplier is applied. */
export const TYPE = {
  displayLg: { size: 32, line: 38, font: FONTS.quicksand.bold, tracking: -0.6 },
  displaySm: { size: 26, line: 32, font: FONTS.quicksand.bold, tracking: -0.4 },
  headline: { size: 21, line: 28, font: FONTS.quicksand.bold, tracking: -0.2 },
  title: { size: 17, line: 23, font: FONTS.quicksand.semibold },
  label: { size: 15, line: 20, font: FONTS.quicksand.semibold },
  labelSm: { size: 12, line: 16, font: FONTS.quicksand.semibold, tracking: 0.3 },
  labelXs: { size: 10, line: 14, font: FONTS.quicksand.bold, tracking: 0.7 },
  body: { size: 15, line: 22, font: FONTS.nunito.regular },
  bodySm: { size: 13, line: 19, font: FONTS.nunito.regular },
  bodySmMedium: { size: 13, line: 19, font: FONTS.nunito.semibold },
  caption: { size: 12, line: 16, font: FONTS.nunito.regular },
} as const;

export type TypeToken = keyof typeof TYPE;

/** Elder Mode floor: nothing renders below 19px and line heights open up. */
export const ELDER_SCALE: Record<TypeToken, number> = {
  displayLg: 1.18,
  displaySm: 1.24,
  headline: 1.28,
  title: 1.26,
  label: 1.24,
  labelSm: 1.3,
  labelXs: 1.25,
  body: 1.36,
  bodySm: 1.38,
  bodySmMedium: 1.34,
  caption: 1.34,
};

export const MOTION = {
  fast: 160,
  base: 220,
  slow: 320,
} as const;

export const LAYOUT = {
  /** Keeps the web build reading as a phone app on wide screens. */
  maxContentWidth: 520,
  tabBarHeight: 84,
  appBarHeight: 56,
} as const;
