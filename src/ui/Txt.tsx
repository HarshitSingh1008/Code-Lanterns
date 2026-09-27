import { StyleSheet, Text as RNText, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { FONTS, TYPE, type TypeToken } from '@/theme/tokens';

/** The next weight up from a token's face, so emphasis keeps the same family. */
const STRONGER: Record<string, string> = {
  [FONTS.nunito.regular]: FONTS.nunito.semibold,
  [FONTS.nunito.medium]: FONTS.nunito.semibold,
  [FONTS.nunito.semibold]: FONTS.nunito.bold,
  [FONTS.quicksand.medium]: FONTS.quicksand.semibold,
  [FONTS.quicksand.semibold]: FONTS.quicksand.bold,
};


export type TxtTone =
  | 'text'
  | 'muted'
  | 'faint'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'butter'
  | 'onPrimary'
  | 'positive'
  | 'warning'
  | 'danger'
  | 'info';

export type TxtProps = TextProps & {
  variant?: TypeToken;
  tone?: TxtTone;
  center?: boolean;
  /** Bumps the token's face one weight up. */
  strong?: boolean;
  /** Renders in ALL CAPS with the label-xs tracking. */
  overline?: boolean;
  style?: StyleProp<TextStyle>;
};

export type ThemeTokens = ReturnType<typeof useTheme>['t'];

/** Resolves a semantic tone to its colour, including the nested status tones. */
export function toneColor(t: ThemeTokens, tone: TxtTone): string {
  switch (tone) {
    case 'text':
      return t.text;
    case 'muted':
      return t.textMuted;
    case 'faint':
      return t.textFaint;
    case 'primary':
      return t.primary;
    case 'secondary':
      return t.secondary;
    case 'tertiary':
      return t.tertiary;
    case 'butter':
      return t.mode === 'dark' ? t.butter : '#8A6100';
    case 'onPrimary':
      return t.onPrimary;
    default:
      return t.tone[tone].fg;
  }
}

export function Txt({
  variant = 'body',
  tone = 'text',
  center,
  strong,
  overline,
  style,
  children,
  ...rest
}: TxtProps) {
  const { t, scale } = useTheme();
  const { font, tracking } = TYPE[variant] as { font: string; tracking?: number };
  const { fontSize, lineHeight } = scale(overline ? 'labelXs' : variant);

  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: strong ? STRONGER[font] ?? font : font,
          fontSize,
          lineHeight,
          color: toneColor(t, tone),
        },
        tracking ? { letterSpacing: tracking } : null,
        overline && styles.overline,
        center && styles.center,
        style,
      ]}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  overline: { textTransform: 'uppercase' },
  center: { textAlign: 'center' },
});
