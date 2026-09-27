import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { RoleTheme } from '../theme/roleVariants';

interface LoadingBarProps {
  progress: number;
  color: string;
  theme: RoleTheme;
  label?: string;
}

export function LoadingBar({ progress, color, theme, label }: LoadingBarProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [animValue, progress]);

  const widthInterpolate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: theme.onSurface }]}>{label}</Text>
          <Text style={[styles.percent, { color: theme.onSurfaceVariant }]}>{Math.round(progress * 100)}%</Text>
        </View>
      )}
      <View style={[styles.track, { backgroundColor: theme.surfaceContainerHigh, borderRadius: 4 }]}>
        <Animated.View style={[styles.fill, { backgroundColor: color, width: widthInterpolate, borderRadius: 4 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 6 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 12, fontWeight: '500' },
  percent: { fontSize: 12 },
  track: { height: 8, overflow: 'hidden' },
  fill: { height: '100%' },
});
