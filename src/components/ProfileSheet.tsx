import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { RoleTheme, Role, roleThemes } from '../theme/roleVariants';
import { Icon } from './Icon';

interface ProfileSheetProps {
  visible: boolean;
  onClose: () => void;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  theme: RoleTheme;
  isDark: boolean;
  onToggleDark: () => void;
}

const roles: { role: Role; label: string; icon: string }[] = [
  { role: 'parent', label: 'Parent', icon: 'family' },
  { role: 'child', label: 'Child', icon: 'baby' },
  { role: 'elder', label: 'Elder', icon: 'elder' },
  { role: 'guardian', label: 'Guardian', icon: 'shield' },
  { role: 'guest', label: 'Guest', icon: 'guest' },
];

export function ProfileSheet({ visible, onClose, currentRole, onRoleChange, theme, isDark, onToggleDark }: ProfileSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.surfaceContainer }]} onPress={() => {}}>
          <View style={[styles.handle, { backgroundColor: theme.outlineVariant }]} />
          <Text style={[styles.title, { color: theme.onSurface }]}>Profile & Settings</Text>

          <Text style={[styles.sectionLabel, { color: theme.onSurfaceVariant }]}>Switch Role</Text>
          <View style={styles.roleGrid}>
            {roles.map((item) => {
              const isActive = currentRole === item.role;
              return (
                <Pressable
                  key={item.role}
                  onPress={() => onRoleChange(item.role)}
                  style={[styles.roleItem, {
                    backgroundColor: isActive ? theme.primaryContainer : theme.surfaceContainerLow,
                    borderColor: isActive ? theme.primary : theme.outlineVariant,
                    borderRadius: theme.roundness.md,
                  }]}
                >
                  <Icon name={item.icon as any} size={24} color={isActive ? theme.primary : theme.onSurfaceVariant} />
                  <Text style={[styles.roleLabel, { color: isActive ? theme.primary : theme.onSurfaceVariant }]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, { color: theme.onSurfaceVariant }]}>Appearance</Text>
          <Pressable onPress={onToggleDark} style={[styles.settingRow, { backgroundColor: theme.surfaceContainerLow, borderRadius: theme.roundness.md }]}>
            <View style={styles.settingLeft}>
              <Icon name={isDark ? 'moon' : 'sun'} size={20} color={theme.onSurface} />
              <Text style={[styles.settingText, { color: theme.onSurface }]}>Dark Mode</Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: isDark ? theme.primary : theme.outlineVariant }]}>
              <View style={[styles.toggleThumb, { backgroundColor: theme.surface, alignSelf: isDark ? 'flex-end' : 'flex-start' }]} />
            </View>
          </Pressable>

          <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.primary, borderRadius: theme.roundness.full }]}>
            <Text style={[styles.closeText, { color: theme.onPrimary }]}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, marginTop: 8 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  roleItem: { width: '30%', padding: 12, alignItems: 'center', borderWidth: 1 },
  roleLabel: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, marginBottom: 16 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 14, fontWeight: '500' },
  toggle: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' },
  toggleThumb: { width: 20, height: 20, borderRadius: 10 },
  closeBtn: { paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  closeText: { fontSize: 16, fontWeight: '600' },
});
