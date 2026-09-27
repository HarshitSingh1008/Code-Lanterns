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
import { Icon } from '../../components/Icon';

const tabs = [
  { label: 'Home', icon: 'home' },
  { label: 'Memories', icon: 'memories' },
  { label: 'Help', icon: 'alert' },
];

export function ElderDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { events, memories, clearRole, isDark, toggleDark, setRole } = useAppStore();
  const theme = isDark ? darkRoleThemes.elder : roleThemes.elder;

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <AnimatedCard theme={theme} delay={0} style={styles.emergencyCard}>
              <RoleButton label="Emergency Call" theme={theme} icon="phone" onPress={() => {}} style={styles.emergencyBtn} />
            </AnimatedCard>
            <AnimatedCard theme={theme} delay={100}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface, fontSize: theme.typography.grandparentTitle.fontSize }]}>
                Today's Schedule
              </Text>
              {events.slice(0, 3).map((evt) => (
                <View key={evt.id} style={[styles.scheduleRow, { borderBottomColor: theme.outlineVariant }]}>
                  <Text style={[styles.scheduleTime, { color: theme.primary, fontSize: theme.typography.grandparentAction.fontSize }]}>
                    {evt.time}
                  </Text>
                  <Text style={[styles.scheduleTitle, { color: theme.onSurface, fontSize: theme.typography.grandparentBody.fontSize }]}>
                    {evt.title}
                  </Text>
                </View>
              ))}
            </AnimatedCard>
            <AnimatedCard theme={theme} delay={200}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface, fontSize: theme.typography.grandparentTitle.fontSize }]}>
                Quick Actions
              </Text>
              <View style={styles.quickActions}>
                <RoleButton label="Call Family" theme={theme} icon="phone" onPress={() => {}} variant="tonal" style={styles.actionBtn} />
                <RoleButton label="Add Photo" theme={theme} icon="camera" onPress={() => {}} variant="tonal" style={styles.actionBtn} />
              </View>
            </AnimatedCard>
          </ScrollView>
        );
      case 1:
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <AnimatedCard theme={theme}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface, fontSize: theme.typography.grandparentTitle.fontSize }]}>
                Family Photos
              </Text>
              <View style={styles.photoGrid}>
                {memories.map((mem) => (
                  <View key={mem.id} style={[styles.photoCard, { backgroundColor: theme.surfaceContainerLow, borderRadius: theme.roundness.md }]}>
                    <Text style={styles.photoEmoji}>{mem.photo}</Text>
                    <Text style={[styles.photoTitle, { color: theme.onSurface }]}>{mem.title}</Text>
                  </View>
                ))}
              </View>
            </AnimatedCard>
          </ScrollView>
        );
      case 2:
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <AnimatedCard theme={theme}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface, fontSize: theme.typography.grandparentTitle.fontSize }]}>
                Help & Support
              </Text>
              <RoleButton label="Call for Help" theme={theme} icon="alert" onPress={() => {}} variant="filled" style={styles.helpBtn} />
              <RoleButton label="Contact Family" theme={theme} icon="phone" onPress={() => {}} variant="tonal" style={styles.helpBtn} />
              <RoleButton label="Medical Info" theme={theme} icon="heart" onPress={() => {}} variant="outlined" style={styles.helpBtn} />
            </AnimatedCard>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Hello, Grandma" subtitle="How are you today?" theme={theme} onBack={clearRole} onSettings={() => setShowProfile(true)} onCalendar={() => setShowCalendar(true)} />
      {renderTabContent()}
      <AIBlock theme={theme} onPress={() => setShowAI(true)} />
      <BottomNav theme={theme} activeTab={activeTab} onTabPress={setActiveTab} tabs={tabs} />
      <AIChatSheet visible={showAI} onClose={() => setShowAI(false)} theme={theme} />
      <ProfileSheet
        visible={showProfile}
        onClose={() => setShowProfile(false)}
        currentRole="elder"
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
  scrollContent: { padding: 20, paddingBottom: 100 },
  emergencyCard: { padding: 12, backgroundColor: '#fff0f0' },
  emergencyBtn: { height: 64 },
  sectionTitle: { fontWeight: '700', marginBottom: 16 },
  scheduleRow: { paddingVertical: 16, borderBottomWidth: 2 },
  scheduleTime: { fontWeight: '700' },
  scheduleTitle: { fontWeight: '500', marginTop: 4 },
  quickActions: { gap: 12 },
  actionBtn: { height: 64 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  photoCard: { width: '47%', padding: 16, alignItems: 'center' },
  photoEmoji: { fontSize: 40 },
  photoTitle: { fontSize: 14, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  helpBtn: { height: 64, marginBottom: 12 },
});
