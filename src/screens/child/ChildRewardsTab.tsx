import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store';
import { roleThemes, darkRoleThemes } from '../../theme/roleVariants';
import { AnimatedCard } from '../../components/AnimatedCard';

export function ChildRewardsTab() {
  const theme = useAppStore((s) => s.isDark) ? darkRoleThemes.child : roleThemes.child;
  const { tasks } = useAppStore();

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const stars = completedTasks.length * 10;
  const level = Math.floor(stars / 50) + 1;
  const badges = ['🌟', '🎨', '📚', '🏅', '🎯'];

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <AnimatedCard theme={theme}>
        <Text style={[styles.levelText, { color: theme.primary }]}>Level {level}</Text>
        <View style={[styles.starsCard, { backgroundColor: theme.secondaryContainer, borderRadius: theme.roundness.lg }]}>
          <Text style={styles.starsEmoji}>⭐</Text>
          <Text style={[styles.starsCount, { color: theme.onSurface }]}>{stars}</Text>
          <Text style={[styles.starsLabel, { color: theme.onSurfaceVariant }]}>Total Stars</Text>
        </View>
      </AnimatedCard>

      <AnimatedCard theme={theme} delay={100}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>My Badges</Text>
        <View style={styles.badgeGrid}>
          {badges.map((badge, i) => (
            <View key={i} style={[styles.badgeCard, { backgroundColor: theme.surfaceContainerLow, borderRadius: theme.roundness.md }]}>
              <Text style={styles.badgeEmoji}>{badge}</Text>
              <Text style={[styles.badgeLabel, { color: theme.onSurfaceVariant }]}>
                {i < completedTasks.length ? 'Earned' : 'Locked'}
              </Text>
            </View>
          ))}
        </View>
      </AnimatedCard>

      <AnimatedCard theme={theme} delay={200}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Completed</Text>
        {completedTasks.map((task) => (
          <View key={task.id} style={[styles.completedRow, { borderBottomColor: theme.outlineVariant }]}>
            <Text style={styles.completedEmoji}>✅</Text>
            <Text style={[styles.completedTitle, { color: theme.onSurface }]}>{task.title}</Text>
            <Text style={styles.completedStars}>+10 ⭐</Text>
          </View>
        ))}
      </AnimatedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  levelText: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  starsCard: { padding: 24, alignItems: 'center', marginTop: 12 },
  starsEmoji: { fontSize: 48 },
  starsCount: { fontSize: 36, fontWeight: '700', marginTop: 8 },
  starsLabel: { fontSize: 16, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeCard: { width: '30%', padding: 16, alignItems: 'center' },
  badgeEmoji: { fontSize: 32 },
  badgeLabel: { fontSize: 12, marginTop: 8 },
  completedRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
  completedEmoji: { fontSize: 20 },
  completedTitle: { flex: 1, fontSize: 14, fontWeight: '500' },
  completedStars: { fontSize: 14, fontWeight: '600', color: '#5b8c67' },
});
