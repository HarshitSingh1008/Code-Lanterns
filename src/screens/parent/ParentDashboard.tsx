import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store';
import { roleThemes, darkRoleThemes } from '../../theme/roleVariants';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { AnimatedCard } from '../../components/AnimatedCard';
import { RoleButton } from '../../components/RoleButton';
import { AIBlock } from '../../components/AIBlock';
import { AIChatSheet } from '../../components/AIChatSheet';
import { ProfileSheet } from '../../components/ProfileSheet';
import { CalendarSheet } from '../../components/CalendarSheet';
import { AddMemorySheet } from '../../components/AddMemorySheet';
import { PieChart } from '../../components/PieChart';
import { BarChart } from '../../components/BarChart';
import { LoadingBar } from '../../components/LoadingBar';
import { Icon } from '../../components/Icon';
import { ParentTasksTab } from './ParentTasksTab';
import { ParentFamilyTab } from './ParentFamilyTab';
import { ParentFinanceTab } from './ParentFinanceTab';
import { ParentMemoriesTab } from './ParentMemoriesTab';

const tabs = [
  { label: 'Home', icon: 'home' },
  { label: 'Tasks', icon: 'tasks' },
  { label: 'Family', icon: 'family' },
  { label: 'Finance', icon: 'finance' },
  { label: 'Memories', icon: 'memories' },
];

export function ParentDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const { tasks, events, familyMembers, expenses, clearRole, isDark, toggleDark, setRole, memories, addMemory } = useAppStore();
  const theme = isDark ? darkRoleThemes.parent : roleThemes.parent;

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <AnimatedCard theme={theme} delay={0}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Quick Stats</Text>
              <View style={styles.statsRow}>
                <View style={[styles.statBox, { backgroundColor: theme.primaryContainer, borderRadius: theme.roundness.md }]}>
                  <Text style={[styles.statNumber, { color: theme.primary }]}>{pendingTasks.length}</Text>
                  <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>Pending</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: theme.secondaryContainer, borderRadius: theme.roundness.md }]}>
                  <Text style={[styles.statNumber, { color: theme.secondary }]}>{familyMembers.length}</Text>
                  <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>Members</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: theme.tertiaryContainer, borderRadius: theme.roundness.md }]}>
                  <Text style={[styles.statNumber, { color: theme.tertiary }]}>${totalExpenses.toFixed(0)}</Text>
                  <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>Spent</Text>
                </View>
              </View>
            </AnimatedCard>

            <AnimatedCard theme={theme} delay={100}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Spending Breakdown</Text>
              <PieChart
                data={[
                  { label: 'Groceries', value: 125.50, color: theme.primary },
                  { label: 'Utilities', value: 89.00, color: theme.secondary },
                  { label: 'Entertainment', value: 45.00, color: theme.tertiary },
                  { label: 'Transport', value: 60.00, color: theme.error },
                ]}
                theme={theme}
              />
            </AnimatedCard>

            <AnimatedCard theme={theme} delay={200}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Task Progress</Text>
              <LoadingBar progress={0.7} color={theme.primary} theme={theme} label="Completed" />
              <LoadingBar progress={0.3} color={theme.secondary} theme={theme} label="In Progress" />
              <LoadingBar progress={0.1} color={theme.tertiary} theme={theme} label="Not Started" />
            </AnimatedCard>

            <AnimatedCard theme={theme} delay={300}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Upcoming Events</Text>
              {events.slice(0, 3).map((evt) => (
                <View key={evt.id} style={[styles.eventRow, { borderBottomColor: theme.outlineVariant }]}>
                  <Text style={[styles.eventTitle, { color: theme.onSurface }]}>{evt.title}</Text>
                  <Text style={[styles.eventDate, { color: theme.primary }]}>{evt.date}</Text>
                </View>
              ))}
            </AnimatedCard>
          </ScrollView>
        );
      case 1:
        return <ParentTasksTab />;
      case 2:
        return <ParentFamilyTab />;
      case 3:
        return <ParentFinanceTab />;
      case 4:
        return <ParentMemoriesTab />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Family Dashboard"
        subtitle="Welcome back, Mom"
        theme={theme}
        onBack={clearRole}
        onSettings={() => setShowProfile(true)}
        onCalendar={() => setShowCalendar(true)}
      />
      {renderTabContent()}
      <AIBlock theme={theme} onPress={() => setShowAI(true)} />
      <BottomNav theme={theme} activeTab={activeTab} onTabPress={setActiveTab} tabs={tabs} />
      <AIChatSheet visible={showAI} onClose={() => setShowAI(false)} theme={theme} />
      <ProfileSheet
        visible={showProfile}
        onClose={() => setShowProfile(false)}
        currentRole="parent"
        onRoleChange={(role) => { setRole(role, `${role}-1`); setShowProfile(false); }}
        theme={theme}
        isDark={isDark}
        onToggleDark={toggleDark}
      />
      <CalendarSheet visible={showCalendar} onClose={() => setShowCalendar(false)} theme={theme} events={events} />
      <AddMemorySheet visible={showAddMemory} onClose={() => setShowAddMemory(false)} theme={theme} onAdd={addMemory} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statBox: { flex: 1, padding: 12, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 11, marginTop: 2 },
  eventRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  eventTitle: { fontSize: 14, fontWeight: '500' },
  eventDate: { fontSize: 12, fontWeight: '600' },
});
