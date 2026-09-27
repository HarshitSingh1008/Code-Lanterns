import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { RoleTheme } from '../theme/roleVariants';

interface BarChartProps {
  data: { label: string; value: number; color: string }[];
  theme: RoleTheme;
  height?: number;
}

export function BarChart({ data, theme, height = 120 }: BarChartProps) {
  const animValues = useRef(data.map(() => new Animated.Value(0))).current;
  const maxValue = Math.max(...data.map((d) => d.value));

  useEffect(() => {
    Animated.stagger(100, animValues.map((av) =>
      Animated.timing(av, { toValue: 1, duration: 800, useNativeDriver: false })
    )).start();
  }, [animValues]);

  return (
    <View style={styles.container}>
      <View style={[styles.chart, { height }]}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <Animated.View style={[
              styles.bar,
              {
                backgroundColor: item.color,
                height: animValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, (item.value / maxValue) * (height - 20)],
                }),
              },
            ]} />
            <Text style={[styles.barLabel, { color: theme.onSurfaceVariant }]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 8, paddingHorizontal: 8 },
  barContainer: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '80%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 10, textAlign: 'center' },
});
