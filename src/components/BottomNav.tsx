import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RoleTheme } from '../theme/roleVariants';
import { Icon } from './Icon';

interface BottomNavProps {
  theme: RoleTheme;
  activeTab: number;
  onTabPress: (index: number) => void;
  tabs: { label: string; icon: string }[];
}

export function BottomNav({ theme, activeTab, onTabPress, tabs }: BottomNavProps) {
  return (
    <View style={[styles.container, {
      backgroundColor: theme.surfaceContainer,
      borderTopColor: theme.outlineVariant,
      borderRadius: theme.roundness.lg,
      marginBottom: 8,
      marginHorizontal: 8,
    }]}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === index;
        return (
          <Pressable key={index} onPress={() => onTabPress(index)} style={styles.tab}>
            <View style={[styles.iconContainer, isActive && {
              backgroundColor: theme.primaryContainer,
              borderRadius: theme.roundness.full,
              paddingHorizontal: 16,
              paddingVertical: 4,
            }]}>
              <Icon name={tab.icon as any} size={22} color={isActive ? theme.primary : theme.onSurfaceVariant} />
            </View>
            <Text style={[styles.label, {
              color: isActive ? theme.primary : theme.onSurfaceVariant,
              fontSize: theme.fontScale > 1.1 ? 14 : theme.typography.labelSm.fontSize,
              fontWeight: isActive ? '700' : '500',
            }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderTopWidth: 1, paddingVertical: 12, paddingHorizontal: 8, justifyContent: 'space-around' },
  tab: { alignItems: 'center', justifyContent: 'center', paddingVertical: 4, minWidth: 60 },
  iconContainer: { paddingVertical: 4, paddingHorizontal: 8, marginBottom: 4 },
  label: { letterSpacing: 0.2 },
});
