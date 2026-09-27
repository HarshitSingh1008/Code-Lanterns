import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store';
import { roleThemes, darkRoleThemes } from '../../theme/roleVariants';
import { AnimatedCard } from '../../components/AnimatedCard';
import { RoleButton } from '../../components/RoleButton';
import { Icon } from '../../components/Icon';

export function ParentTasksTab() {
  const theme = useAppStore((s) => s.isDark) ? darkRoleThemes.parent : roleThemes.parent;
  const { tasks, completeTask } = useAppStore();

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <AnimatedCard theme={theme}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>All Tasks ({tasks.length})</Text>
        {tasks.map((task) => (
          <View key={task.id} style={[styles.taskRow, { borderBottomColor: theme.outlineVariant }]}>
            <View style={styles.taskInfo}>
              <Text style={[styles.taskTitle, { color: theme.onSurface }]}>
                {task.status === 'completed' ? '✓ ' : ''}{task.title}
              </Text>
              <Text style={[styles.taskMeta, { color: theme.onSurfaceVariant }]}>
                {task.assignee} · {task.dueDate} · {task.priority}
              </Text>
            </View>
            {task.status !== 'completed' && (
              <RoleButton label="Done" theme={theme} onPress={() => completeTask(task.id)} variant="tonal" style={styles.doneBtn} />
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
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  taskRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: '500' },
  taskMeta: { fontSize: 12, marginTop: 2 },
  doneBtn: { paddingHorizontal: 16, paddingVertical: 8, height: 36, minWidth: 60 },
});
