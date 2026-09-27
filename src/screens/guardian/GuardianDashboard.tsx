import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store';
import { roleThemes, darkRoleThemes } from '../../theme/roleVariants';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { AnimatedCard } from '../../components/AnimatedCard';
import { AIBlock } from '../../components/AIBlock';
import { AIChatSheet } from '../../components/AIChatSheet';
import { ProfileSheet } from '../../components/ProfileSheet';
import { CalendarSheet } from '../../components/CalendarSheet';
import { BarChart } from '../../components/BarChart';

const tabs = [
  { label: 'Overview', icon: 'chart' },
  { label: 'Alerts', icon: 'alert' },
  { label: 'Logs', icon: 'tasks' },
];

export function GuardianDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { familyMembers, tasks, healthRecords, clearRole, isDark, toggleDark, setRole } = useAppStore();
  const theme = isDark ? darkRoleThemes.guardian : roleThemes.guardian;

  const pendingTasks = tasks.filter((t) => t.status === 'pending');

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <AnimatedCard theme={theme}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Family Overview</Text>
              <View style={styles.overviewGrid}>
                {familyMembers.map((member) => (
                  <View key={member.id} style={[styles.memberCard, { backgroundColor: theme.surfaceContainerLow, borderRadius: theme.roundness.md }]}>
                    <Text style={styles.memberAvatar}>{member.avatar}</Text>
                    <Text style={[styles.memberName, { color: theme.onSurface }]}>{member.name}</Text>
                    <Text style={[styles.memberRole, { color: theme.onSurfaceVariant }]}>{member.role}</Text>
                  </View>
                ))}
              </View>
            </AnimatedCard>
            <AnimatedCard theme={theme} delay={100}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Task Completion</Text>
              <BarChart
                data={[
                  { label: 'Done', value: tasks.filter((t) => t.status === 'completed').length, color: theme.primary },
                  { label: 'Pending', value: pendingTasks.length, color: theme.secondary },
                ]}
                theme={theme}
              />
            </AnimatedCard>
            <AnimatedCard theme={theme} delay={200}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Pending Tasks ({pendingTasks.length})</Text>
              {pendingTasks.map((task) => (
                <View key={task.id} style={[styles.taskRow, { borderBottomColor: theme.outlineVariant }]}>
                  <Text style={[styles.taskTitle, { color: theme.onSurface }]}>{task.title}</Text>
                  <Text style={[styles.taskMeta, { color: theme.onSurfaceVariant }]}>{task.assignee}</Text>
                </View>
              ))}
            </AnimatedCard>
          </ScrollView>
        );
      case 1:
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <AnimatedCard theme={theme}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Health Alerts</Text>
              {healthRecords.map((record) => (
                <View key={record.id} style={[styles.alertRow, { borderBottomColor: theme.outlineVariant }]}>
                  <Text style={[styles.alertText, { color: theme.onSurface }]}>
                    {record.member}: {record.type} - {record.date}
                  </Text>
                  <Text style={[styles.alertStatus, { color: record.status === 'completed' ? theme.tertiary : theme.secondary }]}>
                    {record.status}
                  </Text>
                </View>
              ))}
            </AnimatedCard>
            <AnimatedCard theme={theme} delay={100}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Task Alerts</Text>
              {pendingTasks.filter((t) => t.priority === 'high').map((task) => (
                <View key={task.id} style={[styles.alertRow, { borderBottomColor: theme.outlineVariant }]}>
                  <Text style={[styles.alertText, { color: theme.onSurface }]}>
                    High priority: {task.title}
                  </Text>
                  <Text style={[styles.alertStatus, { color: theme.secondary }]}>pending</Text>
                </View>
              ))}
            </AnimatedCard>
          </ScrollView>
        );
      case 2:
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <AnimatedCard theme={theme}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Activity Log</Text>
              {tasks.map((task) => (
                <View key={task.id} style={[styles.logRow, { borderBottomColor: theme.outlineVariant }]}>
                  <Text style={[styles.logText, { color: theme.onSurface }]}>
                    {task.status === 'completed' ? '✓' : '○'} {task.title} - {task.assignee}
                  </Text>
                  <Text style={[styles.logDate, { color: theme.onSurfaceVariant }]}>{task.dueDate}</Text>
                </View>
              ))}
            </AnimatedCard>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Guardian View" subtitle="Oversight Dashboard" theme={theme} onBack={clearRole} onSettings={() => setShowProfile(true)} onCalendar={() => setShowCalendar(true)} />
      {renderTabContent()}
      <AIBlock theme={theme} onPress={() => setShowAI(true)} />
      <BottomNav theme={theme} activeTab={activeTab} onTabPress={setActiveTab} tabs={tabs} />
      <AIChatSheet visible={showAI} onClose={() => setShowAI(false)} theme={theme} />
      <ProfileSheet
        visible={showProfile}
        onClose={() => setShowProfile(false)}
        currentRole="guardian"
        onRoleChange={(role) => { setRole(role, `${role}-1`); setShowProfile(false); }}
        theme={theme}
        isDark={isDark}
        onToggleDark={toggleDark}
      />
      <CalendarSheet visible={showCalendar} onClose={() => setShowCalendar(false)} theme={theme} events={[]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  memberCard: { width: '30%', padding: 12, alignItems: 'center' },
  memberAvatar: { fontSize: 28 },
  memberName: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  memberRole: { fontSize: 10, textTransform: 'capitalize' },
  taskRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  taskTitle: { fontSize: 14, fontWeight: '500' },
  taskMeta: { fontSize: 12 },
  alertRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  alertText: { fontSize: 13, flex: 1 },
  alertStatus: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  logText: { fontSize: 13, flex: 1 },
  logDate: { fontSize: 12 },
});
