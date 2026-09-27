import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { PRIVACY_META, type PrivacyLevel } from '@/theme/palettes';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { accentSlot, type AccentSlot } from './Surface';
import { Txt } from './Txt';

export type Tone = 'neutral' | 'primary' | 'secondary' | 'tertiary' | 'butter' | 'positive' | 'warning' | 'danger' | 'info';

export function Chip({
  label,
  onPress,
  tone = 'neutral',
  active,
  icon,
  size = 'md',
  style,
}: {
  label: string;
  onPress?: () => void;
  tone?: Tone;
  active?: boolean;
  icon?: IconName;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}) {
  const { t, elder } = useTheme();

  const c = resolveTone(t, tone, active);
  const minHeight = size === 'sm' ? (elder ? 38 : 30) : elder ? 48 : 38;

  const body = (
    <>
      {icon ? <Icon name={icon} size={size === 'sm' ? 13 : 15} color={c.fg} /> : null}
      <Txt variant={size === 'sm' ? 'labelXs' : 'labelSm'} style={{ color: c.fg }} numberOfLines={1}>
        {label}
      </Txt>
    </>
  );

  const base: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight,
    paddingHorizontal: size === 'sm' ? SPACING.sm : SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: c.bg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: c.border,
  };

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: !!active }}
        onPress={onPress}
        style={({ pressed }) => [base, { transform: [{ scale: pressed ? 0.94 : 1 }] }, style]}>
        {body}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{body}</View>;
}

export function PrivacyPill({ level, compact }: { level: PrivacyLevel; compact?: boolean }) {
  const { t } = useTheme();
  const meta = PRIVACY_META[level];
  const c = t.privacy[level];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-start',
        backgroundColor: c.bg,
        borderColor: c.border,
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderRadius: RADIUS.pill,
        paddingHorizontal: compact ? SPACING.sm : SPACING.md,
        paddingVertical: compact ? 4 : 7,
      }}>
      <Txt variant="caption" style={{ color: c.fg, fontSize: compact ? 11 : 12 }}>
        {meta.glyph}
      </Txt>
      <Txt variant="labelSm" style={{ color: c.fg }}>
        {meta.label}
      </Txt>
    </View>
  );
}

export function Badge({ label, tone = 'primary' }: { label: string; tone?: Tone }) {
  const { t } = useTheme();
  const c = resolveTone(t, tone, true);
  return (
    <View
      style={{
        backgroundColor: c.bg,
        borderRadius: RADIUS.pill,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 3,
        alignSelf: 'flex-start',
      }}>
      <Txt variant="labelXs" style={{ color: c.fg }}>
        {label}
      </Txt>
    </View>
  );
}

function resolveTone(
  t: ReturnType<typeof useTheme>['t'],
  tone: Tone,
  active: boolean | undefined
): { fg: string; bg: string; border: string } {
  if (tone === 'neutral') {
    if (active) return { fg: t.primary, bg: t.primarySoft, border: t.a.primary(0.2) };
    return { fg: t.textMuted, bg: t.surfaceAlt, border: t.outlineSoft };
  }
  if (tone === 'primary' || tone === 'secondary' || tone === 'tertiary' || tone === 'butter') {
    const slot = accentSlot(t, tone as AccentSlot);
    if (tone === 'butter' && t.isDark === false) {
      return active
        ? { fg: '#7A5500', bg: t.butterSoft, border: t.a.butter(0.5) }
        : { fg: t.textMuted, bg: 'transparent', border: t.outline };
    }
    return { fg: slot.fg, bg: active ? slot.bg : 'transparent', border: active ? slot.bg : t.outline };
  }
  const s = t.tone[tone];
  return { fg: s.fg, bg: s.bg, border: s.border };
}
