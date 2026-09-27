import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store';
import { roleThemes, darkRoleThemes } from '../../theme/roleVariants';
import { Header } from '../../components/Header';
import { AnimatedCard } from '../../components/AnimatedCard';
import { RoleButton } from '../../components/RoleButton';
import { AIBlock } from '../../components/AIBlock';
import { AIChatSheet } from '../../components/AIChatSheet';
import { ProfileSheet } from '../../components/ProfileSheet';
import { CalendarSheet } from '../../components/CalendarSheet';

const tabs = [
  { label: 'Home', icon: 'home' },
  { label: 'Events', icon: 'calendar' },
];

export function GuestView() {
  const [activeTab, setActiveTab] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { events, clearRole, isDark, toggleDark, setRole } = useAppStore();
  const theme = isDark ? darkRoleThemes.guest : roleThemes.guest;

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <AnimatedCard theme={theme} delay={0}>
              <Text style={[styles.welcomeEmoji]}>👋</Text>
              <Text style={[styles.welcomeTitle, { color: theme.onSurface }]}>Hello, Family Friend!</Text>
              <Text style={[styles.welcomeText, { color: theme.onSurfaceVariant }]}>
                You have limited access to family events and can RSVP to upcoming gatherings.
              </Text>
            </AnimatedCard>
            <AnimatedCard theme={theme} delay={100}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Upcoming Events</Text>
              {events.map((evt) => (
                <View key={evt.id} style={[styles.eventCard, { borderBottomColor: theme.outlineVariant }]}>
                  <Text style={[styles.eventTitle, { color: theme.onSurface }]}>{evt.title}</Text>
                  <Text style={[styles.eventDate, { color: theme.primary }]}>{evt.date} at {evt.time}</Text>
                  <RoleButton label="RSVP" theme={theme} variant="outlined" onPress={() => {}} style={styles.rsvpBtn} />
                </View>
              ))}
            </AnimatedCard>
          </ScrollView>
        );
      case 1:
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <AnimatedCard theme={theme}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>All Events</Text>
              {events.map((evt) => (
                <View key={evt.id} style={[styles.eventCard, { borderBottomColor: theme.outlineVariant }]}>
                  <Text style={[styles.eventTitle, { color: theme.onSurface }]}>{evt.title}</Text>
                  <Text style={[styles.eventDate, { color: theme.primary }]}>{evt.date} at {evt.time}</Text>
                  <RoleButton label="RSVP" theme={theme} variant="outlined" onPress={() => {}} style={styles.rsvpBtn} />
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
      <Header title="Welcome!" subtitle="Guest Access" theme={theme} onBack={clearRole} onSettings={() => setShowProfile(true)} onCalendar={() => setShowCalendar(true)} />
      {renderTabContent()}
      <AIBlock theme={theme} onPress={() => setShowAI(true)} />
      <BottomNav theme={theme} activeTab={activeTab} onTabPress={setActiveTab} tabs={tabs} />
      <AIChatSheet visible={showAI} onClose={() => setShowAI(false)} theme={theme} />
      <ProfileSheet
        visible={showProfile}
        onClose={() => setShowProfile(false)}
        currentRole="guest"
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
  welcomeEmoji: { fontSize: 48, textAlign: 'center' },
  welcomeTitle: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginTop: 12 },
  welcomeText: { fontSize: 14, textAlign: 'center', marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  eventCard: { paddingVertical: 16, borderBottomWidth: 1 },
  eventTitle: { fontSize: 16, fontWeight: '600' },
  eventDate: { fontSize: 13, marginTop: 4 },
  rsvpBtn: { marginTop: 8, alignSelf: 'flex-start' },
});
