import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import {
  buildTheme,
  THEME_NAMES,
  type ColorMode,
  type ThemeName,
  type ThemeTokens,
} from './palettes';
import { ELDER_SCALE, TYPE, type TypeToken } from './tokens';

const KEY = 'nexus.theme.v1';

type Persisted = { name: ThemeName; mode: ColorMode | 'system'; elderBoost: boolean };

export type ThemeContextValue = {
  t: ThemeTokens;
  name: ThemeName;
  mode: ColorMode;
  setName: (name: ThemeName) => void;
  setMode: (mode: ColorMode | 'system') => void;
  /** True when Elder Mode typography is active. */
  elder: boolean;
  setElder: (value: boolean) => void;
  /** Apply the Elder Mode multiplier to a type token. */
  scale: (token: TypeToken) => { fontSize: number; lineHeight: number };
  hydrated: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [name, setNameState] = useState<ThemeName>('periwinkle');
  const [mode, setModeState] = useState<ColorMode | 'system'>('system');
  const [elder, setElder] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!alive || !raw) return;
        const parsed = JSON.parse(raw) as Persisted;
        if (parsed && typeof parsed === 'object') {
          if (THEME_NAMES.includes(parsed.name)) setNameState(parsed.name);
          if (['light', 'dark', 'system'].includes(parsed.mode)) setModeState(parsed.mode);
          if (typeof parsed.elderBoost === 'boolean') setElder(parsed.elderBoost);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (alive) setHydrated(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ name, mode, elderBoost: elder } satisfies Persisted)).catch(
      () => undefined
    );
  }, [name, mode, elder, hydrated]);

  const resolvedMode: ColorMode = mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
  const t = useMemo(() => buildTheme(name, resolvedMode), [name, resolvedMode]);

  const setName = useCallback((next: ThemeName) => setNameState(next), []);
  const setMode = useCallback((next: ColorMode | 'system') => setModeState(next), []);

  const scale = useCallback(
    (token: TypeToken) => {
      const base = TYPE[token];
      const k = elder ? ELDER_SCALE[token] : 1;
      return { fontSize: Math.round(base.size * k), lineHeight: Math.round(base.line * k * 1.06) };
    },
    [elder]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ t, name, mode: resolvedMode, setName, setMode, elder, setElder, scale, hydrated }),
    [t, name, resolvedMode, setName, setMode, elder, scale, hydrated]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
