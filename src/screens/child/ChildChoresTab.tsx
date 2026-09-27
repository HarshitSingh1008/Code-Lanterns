import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store';
import { roleThemes, darkRoleThemes } from '../../theme/roleVariants';
import { AnimatedCard } from '../../components/AnimatedCard';
import { RoleButton } from '../../components/RoleButton';

export function ChildChoresTab() {
  const theme = useAppStore((s) => s.isDark) ? darkRoleThemes.child : roleThemes.child;
  const { tasks, completeTask } = useAppStore();

  const myTasks = tasks.filter((t) => t.assignee === 'Emma' || t.assignee === 'Liam');

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <AnimatedCard theme={theme}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>My Chores</Text>
        {myTasks.map((task) => (
          <View key={task.id} style={[styles.choreRow, { backgroundColor: theme.surfaceContainerLow, borderRadius: theme.roundness.md }]}>
            <Text style={styles.choreEmoji}>{task.status === 'completed' ? '✅' : '📋'}</Text>
            <View style={styles.choreInfo}>
              <Text style={[styles.choreTitle, { color: theme.onSurface }]}>{task.title}</Text>
              <Text style={[styles.choreMeta, { color: theme.onSurfaceVariant }]}>{task.dueDate} · +10 ⭐</Text>
            </View>
            {!task.status || task.status !== 'completed' ? (
              <RoleButton label="Done!" theme={theme} onPress={() => completeTask(task.id)} variant="filled" style={styles.doneBtn} />
            ) : (
              <Text style={styles.doneText}>+10 ⭐</Text>
            )}
          </View>
        ))}
      </AnimatedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  choreRow: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8, gap: 12 },
  choreEmoji: { fontSize: 24 },
  choreInfo: { flex: 1 },
  choreTitle: { fontSize: 16, fontWeight: '600' },
  choreMeta: { fontSize: 12, marginTop: 2 },
  doneBtn: { paddingHorizontal: 16, paddingVertical: 8, height: 40 },
  doneText: { fontSize: 14, fontWeight: '600', color: '#5b8c67' },
});
