import React, { useRef, useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { RoleTheme } from '../theme/roleVariants';
import { Icon } from './Icon';

interface AIBlockProps {
  theme: RoleTheme;
  onPress: () => void;
}

export function AIBlock({ theme, onPress }: AIBlockProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <Pressable onPress={onPress} style={[styles.container, {
        backgroundColor: theme.primaryContainer,
        borderRadius: theme.roundness.lg,
        borderColor: theme.primary,
      }]}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary, borderRadius: theme.roundness.md }]}>
          <Icon name="ai" size={20} color={theme.onPrimary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.onSurface }]}>Family AI Assistant</Text>
          <Text style={[styles.subtitle, { color: theme.onSurfaceVariant }]}>Tap to ask anything...</Text>
        </View>
        <Icon name="back" size={18} color={theme.primary} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  textContainer: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600' },
  subtitle: { fontSize: 12, marginTop: 2 },
});
