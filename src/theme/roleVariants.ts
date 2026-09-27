import { baseColors, spacing, roundness, typography } from './tokens';

export type Role = 'parent' | 'child' | 'elder' | 'guardian' | 'guest';

export interface RoleTheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  surface: string;
  surfaceContainer: string;
  surfaceContainerLow: string;
  onSurface: string;
  onSurfaceVariant: string;
  background: string;
  roundness: {
    sm: number;
    DEFAULT: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  spacing: typeof spacing;
  typography: typeof typography;
  fontScale: number;
  buttonHeight: number;
  touchTarget: number;
}

const darkColors = {
  surface: '#131315',
  surfaceContainer: '#1c1b1d',
  surfaceContainerLow: '#1c1b1d',
  onSurface: '#e5e1e4',
  onSurfaceVariant: '#c4c7c8',
  background: '#131315',
  primary: '#9fccee',
  onPrimary: '#001e2f',
  primaryContainer: '#194b68',
  onPrimaryContainer: '#cee9ff',
  secondary: '#ffb59e',
  secondaryContainer: '#77311a',
  tertiary: '#a5d0b8',
  tertiaryContainer: '#264e3c',
  onTertiaryContainer: '#c3f0d7',
  outline: '#8e9192',
  outlineVariant: '#444748',
  error: '#ffb4ab',
  errorContainer: '#93000a',
};

export const roleThemes: Record<Role, RoleTheme> = {
  parent: {
    ...baseColors,
    primary: '#3e6b89',
    primaryContainer: '#ebf1f5',
    secondary: '#e08365',
    secondaryContainer: '#fff0eb',
    roundness: { sm: 4, DEFAULT: 8, md: 12, lg: 16, xl: 24, full: 9999 },
    spacing: { ...spacing },
    typography: { ...typography },
    fontScale: 1.0,
    buttonHeight: 48,
    touchTarget: 40,
  },
  child: {
    ...baseColors,
    primary: '#e08365',
    primaryContainer: '#fff0eb',
    onPrimary: '#ffffff',
    secondary: '#f4c95d',
    secondaryContainer: '#fff8e1',
    surface: '#fffbf2',
    surfaceContainer: '#fff3e0',
    surfaceContainerLow: '#fff8ec',
    onSurface: '#191c1d',
    onSurfaceVariant: '#5a4a3a',
    background: '#fffbf2',
    roundness: { sm: 8, DEFAULT: 16, md: 20, lg: 28, xl: 36, full: 9999 },
    spacing: { xs: 6, sm: 12, md: 20, lg: 28, xl: 36, xxl: 52 },
    typography: {
      ...typography,
      bodyLg: { fontSize: 17, fontWeight: '400' as const, lineHeight: 26 },
      headlineLg: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
    },
    fontScale: 1.1,
    buttonHeight: 56,
    touchTarget: 48,
  },
  elder: {
    ...baseColors,
    primary: '#1e3f56',
    primaryContainer: '#d4e4f0',
    onPrimary: '#ffffff',
    secondary: '#95482e',
    secondaryContainer: '#f5e0d6',
    surface: '#faf8f5',
    surfaceContainer: '#f0ece6',
    surfaceContainerLow: '#f5f1ec',
    onSurface: '#121212',
    onSurfaceVariant: '#333333',
    background: '#faf8f5',
    roundness: { sm: 4, DEFAULT: 8, md: 12, lg: 16, xl: 24, full: 9999 },
    spacing: { xs: 6, sm: 12, md: 20, lg: 28, xl: 40, xxl: 56 },
    typography: {
      displayLg: { fontSize: 52, fontWeight: '700' as const, lineHeight: 60 },
      headlineLg: { fontSize: 34, fontWeight: '700' as const, lineHeight: 42 },
      headlineMd: { fontSize: 26, fontWeight: '700' as const, lineHeight: 34 },
      titleLg: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
      titleMd: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
      bodyLg: { fontSize: 20, fontWeight: '500' as const, lineHeight: 30 },
      bodyMd: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
      labelLg: { fontSize: 16, fontWeight: '700' as const, lineHeight: 22 },
      labelMd: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
    },
    fontScale: 1.2,
    buttonHeight: 64,
    touchTarget: 56,
  },
  guardian: {
    ...baseColors,
    primary: '#235370',
    primaryContainer: '#d4e4f0',
    secondary: '#95482e',
    secondaryContainer: '#f5e0d6',
    roundness: { sm: 4, DEFAULT: 8, md: 12, lg: 16, xl: 24, full: 9999 },
    spacing: { ...spacing },
    typography: { ...typography },
    fontScale: 1.0,
    buttonHeight: 48,
    touchTarget: 40,
  },
  guest: {
    ...baseColors,
    primary: '#3e6b89',
    primaryContainer: '#ebf1f5',
    secondary: '#95482e',
    secondaryContainer: '#f5e0d6',
    roundness: { sm: 4, DEFAULT: 8, md: 12, lg: 16, xl: 24, full: 9999 },
    spacing: { ...spacing },
    typography: { ...typography },
    fontScale: 1.0,
    buttonHeight: 48,
    touchTarget: 40,
  },
};

export const darkRoleThemes: Record<Role, RoleTheme> = {
  parent: {
    ...roleThemes.parent,
    ...darkColors,
    primary: '#9fccee',
    primaryContainer: '#194b68',
    onPrimaryContainer: '#cee9ff',
    secondary: '#ffb59e',
    secondaryContainer: '#77311a',
    tertiary: '#a5d0b8',
    tertiaryContainer: '#264e3c',
    onTertiaryContainer: '#c3f0d7',
  },
  child: {
    ...roleThemes.child,
    ...darkColors,
    primary: '#ffb59e',
    primaryContainer: '#77311a',
    onPrimaryContainer: '#fff0eb',
    secondary: '#f4c95d',
    secondaryContainer: '#5a4a1a',
  },
  elder: {
    ...roleThemes.elder,
    ...darkColors,
    primary: '#9fccee',
    primaryContainer: '#194b68',
    onPrimaryContainer: '#cee9ff',
  },
  guardian: {
    ...roleThemes.guardian,
    ...darkColors,
    primary: '#9fccee',
    primaryContainer: '#194b68',
    onPrimaryContainer: '#cee9ff',
  },
  guest: {
    ...roleThemes.guest,
    ...darkColors,
    primary: '#9fccee',
    primaryContainer: '#194b68',
    onPrimaryContainer: '#cee9ff',
  },
};
