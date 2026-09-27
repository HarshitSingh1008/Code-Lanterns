import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store';
import { roleThemes, darkRoleThemes } from '../../theme/roleVariants';
import { AnimatedCard } from '../../components/AnimatedCard';

export function ParentFamilyTab() {
  const theme = useAppStore((s) => s.isDark) ? darkRoleThemes.parent : roleThemes.parent;
  const { familyMembers } = useAppStore();

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <AnimatedCard theme={theme}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Family Members ({familyMembers.length})</Text>
        {familyMembers.map((member) => (
          <View key={member.id} style={[styles.memberRow, { borderBottomColor: theme.outlineVariant }]}>
            <Text style={styles.memberAvatar}>{member.avatar}</Text>
            <View style={styles.memberInfo}>
              <Text style={[styles.memberName, { color: theme.onSurface }]}>{member.name}</Text>
              <Text style={[styles.memberRole, { color: theme.onSurfaceVariant }]}>{member.role}</Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: theme.tertiary }]} />
          </View>
        ))}
      </AnimatedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, gap: 12 },
  memberAvatar: { fontSize: 28 },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 16, fontWeight: '600' },
  memberRole: { fontSize: 12, textTransform: 'capitalize', marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
});
