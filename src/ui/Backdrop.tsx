import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';

type OrbSpec = { color: string; size: number; top: number; left: number; drift: number };

/**
 * The soft pastel atmosphere behind every screen: four slow-drifting colour orbs
 * plus a faint dot grid. Purely decorative, never intercepts touches.
 */
export function Backdrop({ variant = 'default' }: { variant?: 'default' | 'calm' }) {
  const { t } = useTheme();

  const orbs: OrbSpec[] =
    variant === 'calm'
      ? [
          { color: t.primary, size: 260, top: -70, left: -80, drift: 1 },
          { color: t.tertiary, size: 220, top: 120, left: 220, drift: -1 },
        ]
      : [
          { color: t.primary, size: 280, top: -90, left: -90, drift: 1 },
          { color: t.secondary, size: 230, top: 90, left: 230, drift: -1 },
          { color: t.tertiary, size: 250, top: 320, left: -70, drift: 1 },
          { color: t.butter, size: 210, top: 520, left: 250, drift: -1 },
        ];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} accessibilityElementsHidden>
      {orbs.map((o, i) => (
        <DriftOrb key={i} spec={o} seed={i} />
      ))}
      <DotGrid color={t.a.text(0.07)} step={26} radius={1.1} />
    </View>
  );
}

function DriftOrb({ spec, seed }: { spec: OrbSpec; seed: number }) {
  const { t } = useTheme();
  const [drift] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 9000 + seed * 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 9000 + seed * 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [drift, seed]);

  const dx = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 16 * spec.drift] });
  const dy = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -20 * spec.drift] });
  const scale = drift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: spec.top,
        left: spec.left,
        width: spec.size,
        height: spec.size,
        opacity: t.isDark ? 0.3 : 0.5,
        transform: [{ translateX: dx }, { translateY: dy }, { scale }],
      }}>
      <Svg width={spec.size} height={spec.size}>
        <Defs>
          <RadialGradient id={`orb-${seed}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={spec.color} stopOpacity={t.isDark ? 0.55 : 0.6} />
            <Stop offset="1" stopColor={spec.color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={spec.size / 2} cy={spec.size / 2} r={spec.size / 2} fill={`url(#orb-${seed})`} />
      </Svg>
    </Animated.View>
  );
}

export function DotGrid({
  color,
  step = 24,
  radius = 1.2,
  opacity = 1,
  style,
}: {
  color: string;
  step?: number;
  radius?: number;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { t } = useTheme();
  const columns = Math.ceil(LAYOUT_W / step);
  const rows = Math.ceil(600 / step);
  const dots = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < columns; c += 1) {
      dots.push(
        <Circle
          key={`${r}-${c}`}
          cx={c * step + step / 2}
          cy={r * step + step / 2}
          r={radius}
          fill={color}
        />
      );
    }
  }

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { opacity: opacity * (t.isDark ? 0.6 : 1) }, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${LAYOUT_W} 600`} preserveAspectRatio="xMidYMin slice">
        {dots}
      </Svg>
    </View>
  );
}

const LAYOUT_W = 420;
