import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { RoleTheme } from '../theme/roleVariants';
import { Icon } from './Icon';

interface RoleButtonProps {
  label: string;
  theme: RoleTheme;
  onPress: () => void;
  variant?: 'filled' | 'tonal' | 'outlined';
  icon?: string;
  style?: ViewStyle;
}

export function RoleButton({ label, theme, onPress, variant = 'filled', icon, style }: RoleButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 60 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 60 }).start();
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'filled':
        return { backgroundColor: theme.primary, borderColor: 'transparent', borderWidth: 0 };
      case 'tonal':
        return { backgroundColor: theme.primaryContainer, borderColor: 'transparent', borderWidth: 0 };
      case 'outlined':
        return { backgroundColor: 'transparent', borderColor: theme.primary, borderWidth: 1.5 };
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, { height: theme.buttonHeight, borderRadius: theme.roundness.full, ...getButtonStyle() }, style]}
      >
        {icon && <Icon name={icon as any} size={20} color={variant === 'outlined' ? theme.primary : variant === 'tonal' ? theme.onSurface : theme.onPrimary} />}
        <Text style={[styles.label, {
          color: variant === 'outlined' ? theme.primary : variant === 'tonal' ? theme.onSurface : theme.onPrimary,
          fontSize: theme.typography.labelLg.fontSize,
          fontWeight: theme.typography.labelLg.fontWeight,
        }]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 8 },
  label: { letterSpacing: 0.1 },
});
