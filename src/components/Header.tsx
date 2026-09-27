import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { RoleTheme } from '../theme/roleVariants';
import { Icon } from './Icon';

interface HeaderProps {
  title: string;
  subtitle?: string;
  theme: RoleTheme;
  onBack?: () => void;
  onSettings?: () => void;
  onCalendar?: () => void;
}

export function Header({ title, subtitle, theme, onBack, onSettings, onCalendar }: HeaderProps) {
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [opacityAnim, slideAnim]);

  return (
    <Animated.View style={[styles.container, {
      backgroundColor: theme.surface,
      borderBottomColor: theme.outlineVariant,
      transform: [{ translateY: slideAnim }],
      opacity: opacityAnim,
    }]}>
      <View style={styles.titleRow}>
        {onBack && (
          <Pressable onPress={onBack}>
            <Icon name="back" size={24} color={theme.primary} />
          </Pressable>
        )}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, {
            color: theme.onSurface,
            fontSize: theme.typography.headlineMd.fontSize,
            fontWeight: theme.typography.headlineMd.fontWeight,
          }]}>
            {title}
          </Text>
          {subtitle && <Text style={[styles.subtitle, {
            color: theme.onSurfaceVariant,
            fontSize: theme.fontScale > 1.1 ? 14 : theme.typography.bodySm.fontSize,
          }]}>
            {subtitle}
          </Text>}
        </View>
        {onCalendar && (
          <Pressable onPress={onCalendar}>
            <Icon name="calendar" size={22} color={theme.primary} />
          </Pressable>
        )}
        {onSettings && (
          <Pressable onPress={onSettings}>
            <Icon name="settings" size={22} color={theme.primary} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { borderBottomWidth: 1, paddingTop: 48, paddingBottom: 12, paddingHorizontal: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titleContainer: { flex: 1 },
  title: { letterSpacing: -0.2 },
  subtitle: { marginTop: 2 },
});
