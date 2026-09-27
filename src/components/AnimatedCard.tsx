import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { RoleTheme } from '../theme/roleVariants';

interface AnimatedCardProps {
  children: React.ReactNode;
  theme: RoleTheme;
  delay?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

export function AnimatedCard({ children, theme, delay = 0, style }: AnimatedCardProps) {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, delay, useNativeDriver: true, speed: 50 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, [delay, opacityAnim, scaleAnim, translateY]);

  return (
    <Animated.View style={[styles.card, {
      backgroundColor: theme.surfaceContainerLow,
      borderRadius: theme.roundness.lg,
      borderColor: theme.outlineVariant,
      transform: [{ scale: scaleAnim }, { translateY }],
      opacity: opacityAnim,
    }, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, padding: 16, marginBottom: 12 },
});
