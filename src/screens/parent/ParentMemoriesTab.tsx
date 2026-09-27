import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store';
import { roleThemes, darkRoleThemes } from '../../theme/roleVariants';
import { AnimatedCard } from '../../components/AnimatedCard';
import { Icon } from '../../components/Icon';

export function ParentMemoriesTab() {
  const theme = useAppStore((s) => s.isDark) ? darkRoleThemes.parent : roleThemes.parent;
  const { memories } = useAppStore();

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <AnimatedCard theme={theme}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Family Timeline</Text>
        {memories.map((mem) => (
          <View key={mem.id} style={[styles.memoryCard, { backgroundColor: theme.surfaceContainerLow, borderRadius: theme.roundness.md }]}>
            <Text style={styles.memoryPhoto}>{mem.photo}</Text>
            <View style={styles.memoryInfo}>
              <Text style={[styles.memoryTitle, { color: theme.onSurface }]}>{mem.title}</Text>
              <Text style={[styles.memoryDate, { color: theme.onSurfaceVariant }]}>{mem.date}</Text>
            </View>
            <View style={styles.likesContainer}>
              <Icon name="heart" size={16} color={theme.primary} />
              <Text style={[styles.memoryLikes, { color: theme.primary }]}>{mem.likes}</Text>
            </View>
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
  memoryCard: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 8, gap: 12 },
  memoryPhoto: { fontSize: 32 },
  memoryInfo: { flex: 1 },
  memoryTitle: { fontSize: 14, fontWeight: '600' },
  memoryDate: { fontSize: 12, marginTop: 2 },
  likesContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  memoryLikes: { fontSize: 14, fontWeight: '600' },
});
