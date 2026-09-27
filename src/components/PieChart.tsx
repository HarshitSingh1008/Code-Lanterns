import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { RoleTheme } from '../theme/roleVariants';

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  theme: RoleTheme;
}

export function PieChart({ data, size = 120, theme }: PieChartProps) {
  const animValue = useRef(new Animated.Value(0)).current;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercent = 0;

  useEffect(() => {
    Animated.timing(animValue, { toValue: 1, duration: 1000, useNativeDriver: false }).start();
  }, [animValue]);

  const radius = size / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {data.map((item, index) => {
          const percent = item.value / total;
          const strokeDasharray = `${percent * circumference} ${circumference}`;
          const strokeDashoffset = -cumulativePercent * circumference;
          cumulativePercent += percent;
          return (
            <Circle
              key={index}
              cx={radius}
              cy={radius}
              r={radius - 10}
              fill="none"
              stroke={item.color}
              strokeWidth={20}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${radius} ${radius})`}
            />
          );
        })}
      </Svg>
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: theme.onSurfaceVariant }]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 12 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11 },
});
