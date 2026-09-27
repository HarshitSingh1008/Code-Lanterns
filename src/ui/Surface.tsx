import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';
import { ACCENTS, type ThemeName } from '@/theme/palettes';
import { LAYOUT, MOTION, RADIUS, SPACING } from '@/theme/tokens';
import { mix } from '@/lib/color';
import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

type Elevation = 0 | 1 | 2 | 3 | 'fab';

/** The only shadows in the system: a soft primary-tinted ambient glow. */
export function softShadow(t: ReturnType<typeof useTheme>['t'], level: Elevation) {
  if (level === 0) return {};
  const strength = level === 3 ? 0.22 : level === 'fab' ? 0.3 : level === 2 ? 0.14 : 0.08;
  if (Platform.OS === 'android') {
    return { elevation: level === 'fab' ? 8 : level === 2 ? 4 : 2 };
  }
  return {
    shadowColor: t.primary,
    shadowOffset: { width: 0, height: level === 'fab' ? 10 : level === 2 ? 8 : 5 },
    shadowOpacity: strength,
    shadowRadius: level === 'fab' ? 18 : level === 2 ? 16 : 12,
  };
}

export type CardTone =
  | 'surface'
  | 'raised'
  | 'alt'
  | 'tint'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'butter';

const CARD_TONES: CardTone[] = [
  'surface',
  'raised',
  'alt',
  'tint',
  'primary',
  'secondary',
  'tertiary',
  'butter',
];

function toneColors(t: ReturnType<typeof useTheme>['t'], tone: CardTone) {
  const map: Record<CardTone, { bg: string; border: string }> = {
    surface: { bg: t.surface, border: t.outline },
    raised: { bg: t.surfaceRaised, border: t.outlineSoft },
    alt: { bg: t.surfaceAlt, border: t.outlineSoft },
    tint: { bg: t.tint, border: t.a.primary(0.16) },
    primary: { bg: t.primarySoft, border: t.a.primary(0.24) },
    secondary: { bg: t.secondarySoft, border: t.a.secondary(0.24) },
    tertiary: { bg: t.tertiarySoft, border: t.a.tertiary(0.24) },
    butter: { bg: t.butterSoft, border: t.a.butter(0.36) },
  };
  return map[tone];
}

export function Card({
  children,
  tone = 'surface',
  padded = true,
  radius = RADIUS.lg,
  elevation = 1,
  style,
  onPress,
  accessibilityLabel,
}: {
  children: ReactNode;
  tone?: CardTone;
  padded?: boolean;
  radius?: number;
  elevation?: Elevation;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const { t } = useTheme();
  const { bg, border } = toneColors(t, tone);

  const base: ViewStyle = {
    backgroundColor: bg,
    borderRadius: radius,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: border,
    padding: padded ? SPACING.lg : 0,
    overflow: 'hidden',
    ...softShadow(t, elevation),
  };

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [base, pressed && { transform: [{ scale: 0.975 }], opacity: 0.96 }, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}

export type AccentSlot = 'primary' | 'secondary' | 'tertiary' | 'butter';

/** A slot within the active theme, or a fixed named theme for per-member identity. */
export type Accent = AccentSlot | ThemeName;

const NIGHT = '#12131F';

export function accentSlot(t: ReturnType<typeof useTheme>['t'], slot: Accent) {
  switch (slot) {
    case 'primary':
      return { fg: t.primary, bg: t.primarySoft };
    case 'secondary':
      return { fg: t.secondary, bg: t.secondarySoft };
    case 'tertiary':
      return { fg: t.tertiary, bg: t.tertiarySoft };
    case 'butter':
      return { fg: t.mode === 'dark' ? t.butter : '#8A6100', bg: t.butterSoft };
    default: {
      const a = ACCENTS[slot];
      return {
        fg: a.primary,
        bg: t.isDark ? mix(a.primary, NIGHT, 0.76) : mix(a.primary, '#ffffff', 0.86),
      };
    }
  }
}

/** A pastel icon bubble used at the top-left of cards. */
export function IconOrb({
  name,
  tone = 'primary',
  size = 40,
  filled,
}: {
  name: IconName;
  tone?: AccentSlot | 'text';
  size?: number;
  filled?: boolean;
}) {
  const { t } = useTheme();
  const { fg, bg } = tone === 'text' ? { fg: t.textMuted, bg: t.surfaceAlt } : accentSlot(t, tone);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.pill,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon name={name} size={Math.round(size * 0.5)} color={fg} filled={filled} />
    </View>
  );
}

export function ProgressRing({
  value,
  size = 34,
  color,
  track,
  width = 6,
  children,
}: {
  value: number;
  size?: number;
  color: string;
  track: string;
  width?: number;
  children?: ReactNode;
}) {
  const radius = (size - width) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={track} strokeWidth={width} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference * pct} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

export function StatTile({
  value,
  label,
  tone = 'primary',
  icon,
  ring,
  onPress,
}: {
  value: string;
  label: string;
  tone?: AccentSlot;
  icon?: IconName;
  ring?: number;
  onPress?: () => void;
}) {
  const { t } = useTheme();
  const { fg, bg } = accentSlot(t, tone);

  const inner = (
    <>
      <View style={styles.tileTop}>
        {icon ? <IconOrb name={icon} tone={tone} size={34} /> : <View />}
        {typeof ring === 'number' ? (
          <ProgressRing value={ring} color={fg} track={t.a.text(0.12)} size={34}>
            <Icon name="check" size={16} color={fg} />
          </ProgressRing>
        ) : null}
      </View>
      <Txt variant="displaySm" style={{ color: fg, marginTop: SPACING.sm }}>
        {value}
      </Txt>
      <Txt variant="caption" tone="muted" numberOfLines={2}>
        {label}
      </Txt>
    </>
  );

  const base: ViewStyle = {
    flexGrow: 1,
    flexBasis: 140,
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    padding: SPACING.md,
    minHeight: 112,
    backgroundColor: bg,
    borderColor: t.a.text(0.07),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [base, pressed && { transform: [{ scale: 0.97 }] }]}>
        {inner}
      </Pressable>
    );
  }
  return <View style={base}>{inner}</View>;
}

export function Divider({ inset = 0 }: { inset?: number }) {
  const { t } = useTheme();
  return (
    <View style={{ height: StyleSheet.hairlineWidth * 2, backgroundColor: t.outlineSoft, marginLeft: inset }} />
  );
}

export function Row({
  children,
  gap = SPACING.sm,
  style,
  wrap,
  align = 'center',
}: {
  children: ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  wrap?: boolean;
  align?: ViewStyle['alignItems'];
}) {
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: align, gap, flexWrap: wrap ? 'wrap' : 'nowrap' },
        style,
      ]}>
      {children}
    </View>
  );
}

/** Centres content and caps its width so the web build always reads as a phone app. */
export function PhoneFrame({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.phone, style]}>{children}</View>;
}

export function Spacer({ size = SPACING.md }: { size?: number }) {
  return <View style={{ height: size }} />;
}

export function FadeIn({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: MOTION.slow + 80,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start();
    return () => animation.stop();
  }, [delay, progress]);

  return (
    <Animated.View
      style={[
        {
          opacity: progress,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
        },
        style,
      ]}>
      {children}
    </Animated.View>
  );
}

export function Pulse({ size = 12, color }: { size?: number; color: string }) {
  const [loop] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(loop, { toValue: 1, duration: 620, easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(loop, { toValue: 0, duration: 0, useNativeDriver: Platform.OS !== 'web' }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [loop]);

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.pill,
        backgroundColor: color,
        opacity: loop.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
        transform: [{ scale: loop.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.18] }) }],
      }}
    />
  );
}

const styles = StyleSheet.create({
  phone: {
    flex: 1,
    width: '100%',
    maxWidth: LAYOUT.maxContentWidth,
    alignSelf: 'center',
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export { CARD_TONES };
