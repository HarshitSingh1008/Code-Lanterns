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
import { LoadingBar } from '../../components/LoadingBar';
import { ChildChoresTab } from './ChildChoresTab';
import { ChildRewardsTab } from './ChildRewardsTab';

const tabs = [
  { label: 'Home', icon: 'home' },
  { label: 'Chores', icon: 'star' },
  { label: 'Rewards', icon: 'shield' },
];

export function ChildDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { tasks, events, clearRole, isDark, toggleDark, setRole } = useAppStore();
  const theme = isDark ? darkRoleThemes.child : roleThemes.child;

  const myTasks = tasks.filter((t) => t.assignee === 'Emma' || t.assignee === 'Liam');
  const completedTasks = myTasks.filter((t) => t.status === 'completed');
  const stars = completedTasks.length * 10;

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <AnimatedCard theme={theme} delay={0} style={styles.starsCard}>
              <Text style={[styles.starsEmoji, { color: theme.secondary }]}>⭐</Text>
              <Text style={[styles.starsCount, { color: theme.onSurface }]}>{stars}</Text>
              <Text style={[styles.starsLabel, { color: theme.onSurfaceVariant }]}>Stars Earned!</Text>
            </AnimatedCard>
            <AnimatedCard theme={theme} delay={100}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>My Progress</Text>
              <LoadingBar progress={completedTasks.length / Math.max(myTasks.length, 1)} color={theme.primary} theme={theme} label="Chores Done" />
              <LoadingBar progress={0.6} color={theme.secondary} theme={theme} label="Level Progress" />
            </AnimatedCard>
            <AnimatedCard theme={theme} delay={200}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>My Chores</Text>
              {myTasks.slice(0, 3).map((task) => (
                <View key={task.id} style={[styles.choreRow, { backgroundColor: theme.surfaceContainerLow, borderRadius: theme.roundness.md }]}>
                  <Text style={styles.choreEmoji}>{task.status === 'completed' ? '✅' : '📋'}</Text>
                  <View style={styles.choreInfo}>
                    <Text style={[styles.choreTitle, { color: theme.onSurface }]}>{task.title}</Text>
                    <Text style={[styles.choreMeta, { color: theme.onSurfaceVariant }]}>{task.dueDate}</Text>
                  </View>
                </View>
              ))}
            </AnimatedCard>
          </ScrollView>
        );
      case 1:
        return <ChildChoresTab />;
      case 2:
        return <ChildRewardsTab />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="My Day"
        subtitle="Hi Emma! Ready to shine?"
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
        currentRole="child"
        onRoleChange={(role) => { setRole(role, `${role}-1`); setShowProfile(false); }}
        theme={theme}
        isDark={isDark}
        onToggleDark={toggleDark}
      />
      <CalendarSheet visible={showCalendar} onClose={() => setShowCalendar(false)} theme={theme} events={events} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  starsCard: { alignItems: 'center', padding: 24 },
  starsEmoji: { fontSize: 36 },
  starsCount: { fontSize: 36, fontWeight: '700', marginTop: 4 },
  starsLabel: { fontSize: 16, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  choreRow: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8, gap: 12 },
  choreEmoji: { fontSize: 24 },
  choreInfo: { flex: 1 },
  choreTitle: { fontSize: 16, fontWeight: '600' },
  choreMeta: { fontSize: 12, marginTop: 2 },
});
