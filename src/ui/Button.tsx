import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { accentSlot, softShadow, type Accent } from './Surface';
import { Txt } from './Txt';

export type ButtonVariant = 'filled' | 'tonal' | 'ghost' | 'danger' | 'butter';

export function Button({
  label,
  onPress,
  variant = 'filled',
  icon,
  iconRight,
  accent = 'primary',
  disabled,
  full,
  style,
  tone,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  iconRight?: IconName;
  accent?: Accent;
  disabled?: boolean;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
  tone?: 'positive' | 'warning' | 'danger' | 'info';
}) {
  const { t, elder } = useTheme();
  const slot = accentSlot(t, accent);
  const minHeight = elder ? 64 : 52;

  const semantic = tone
    ? { fg: t.tone[tone].fg, bg: t.tone[tone].bg, border: t.tone[tone].border }
    : null;

  let bg = t.primary;
  let fg = t.onPrimary;
  let border = 'transparent';

  if (variant === 'tonal') {
    bg = semantic?.bg ?? slot.bg;
    fg = semantic?.fg ?? slot.fg;
    border = semantic?.border ?? t.a.text(0.06);
  } else if (variant === 'ghost') {
    bg = 'transparent';
    fg = semantic?.fg ?? slot.fg;
    border = t.outline;
  } else if (variant === 'danger') {
    bg = t.tone.danger.bg;
    fg = t.tone.danger.fg;
    border = t.tone.danger.border;
  } else if (variant === 'butter') {
    bg = t.butterSoft;
    fg = t.mode === 'dark' ? t.butter : '#7A5500';
    border = t.a.butter(0.4);
  } else if (semantic) {
    bg = semantic.fg;
    fg = t.isDark ? '#14151F' : '#ffffff';
    border = 'transparent';
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          minHeight,
          backgroundColor: bg,
          borderColor: border,
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
          alignSelf: full ? 'stretch' : 'flex-start',
          transform: [{ scale: pressed && !disabled ? 0.965 : 1 }],
          ...(variant === 'filled' ? softShadow(t, 3) : {}),
        },
        style,
      ]}>
      {icon ? <Icon name={icon} size={elder ? 22 : 19} color={fg} /> : null}
      <Txt variant="label" style={{ color: fg }} numberOfLines={1}>
        {label}
      </Txt>
      {iconRight ? <Icon name={iconRight} size={elder ? 22 : 19} color={fg} /> : null}
    </Pressable>
  );
}

export function IconButton({
  name,
  onPress,
  size = 42,
  iconSize,
  variant = 'tonal',
  accent = 'primary',
  filled,
  badge,
  accessibilityLabel,
  style,
}: {
  name: IconName;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  variant?: 'tonal' | 'filled' | 'ghost';
  accent?: Accent;
  filled?: boolean;
  badge?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { t } = useTheme();
  const slot = accentSlot(t, accent);

  const bg = variant === 'filled' ? slot.fg : variant === 'ghost' ? 'transparent' : slot.bg;
  const fg = variant === 'filled' ? (t.isDark ? '#14151F' : '#ffffff') : slot.fg;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: RADIUS.pill,
          backgroundColor: bg,
          borderWidth: variant === 'ghost' ? StyleSheet.hairlineWidth * 2 : 0,
          borderColor: t.outline,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale: pressed ? 0.9 : 1 }],
        },
        style,
      ]}>
      <Icon name={name} size={iconSize ?? Math.round(size * 0.5)} color={fg} filled={filled} />
      {badge && badge > 0 ? (
        <View
          style={[
            styles.badge,
            { backgroundColor: t.secondary, borderColor: bg },
          ]}>
          <Txt variant="labelXs" style={{ color: t.isDark ? '#14151F' : '#ffffff' }}>
            {badge > 9 ? '9+' : String(badge)}
          </Txt>
        </View>
      ) : null}
    </Pressable>
  );
}

export function Fab({ name, onPress, style }: { name: IconName; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add"
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        softShadow(t, 'fab'),
        { backgroundColor: t.primary, transform: [{ scale: pressed ? 0.92 : 1 }] },
        style,
      ]}>
      <Icon name={name} size={26} color={t.isDark ? '#14151F' : '#ffffff'} />
    </Pressable>
  );
}

export function ButtonRow({ children }: { children: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>{children}</View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.pill,
    backgroundColor: '#6C7CE4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
