import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store';
import { roleThemes, darkRoleThemes } from '../../theme/roleVariants';
import { AnimatedCard } from '../../components/AnimatedCard';

export function ParentFinanceTab() {
  const theme = useAppStore((s) => s.isDark) ? darkRoleThemes.parent : roleThemes.parent;
  const { expenses } = useAppStore();

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <AnimatedCard theme={theme}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Spending Overview</Text>
        <View style={[styles.totalCard, { backgroundColor: theme.primaryContainer, borderRadius: theme.roundness.md }]}>
          <Text style={[styles.totalLabel, { color: theme.onSurfaceVariant }]}>Total This Month</Text>
          <Text style={[styles.totalAmount, { color: theme.primary }]}>${totalExpenses.toFixed(2)}</Text>
        </View>
      </AnimatedCard>

      <AnimatedCard theme={theme} delay={100}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>By Category</Text>
        {Object.entries(categoryTotals).map(([category, amount]) => (
          <View key={category} style={[styles.categoryRow, { borderBottomColor: theme.outlineVariant }]}>
            <Text style={[styles.categoryName, { color: theme.onSurface }]}>{category}</Text>
            <Text style={[styles.categoryAmount, { color: theme.primary }]}>${amount.toFixed(2)}</Text>
          </View>
        ))}
      </AnimatedCard>

      <AnimatedCard theme={theme} delay={200}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Recent Transactions</Text>
        {expenses.map((exp) => (
          <View key={exp.id} style={[styles.expenseRow, { borderBottomColor: theme.outlineVariant }]}>
            <View style={styles.expenseInfo}>
              <Text style={[styles.expenseCategory, { color: theme.onSurface }]}>{exp.category}</Text>
              <Text style={[styles.expenseMeta, { color: theme.onSurfaceVariant }]}>{exp.date} · {exp.paidBy}</Text>
            </View>
            <Text style={[styles.expenseAmount, { color: theme.secondary }]}>-${exp.amount.toFixed(2)}</Text>
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
  totalCard: { padding: 24, alignItems: 'center' },
  totalLabel: { fontSize: 12 },
  totalAmount: { fontSize: 28, fontWeight: '700', marginTop: 4 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  categoryName: { fontSize: 14, fontWeight: '500' },
  categoryAmount: { fontSize: 14, fontWeight: '600' },
  expenseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  expenseInfo: { flex: 1 },
  expenseCategory: { fontSize: 14, fontWeight: '500' },
  expenseMeta: { fontSize: 12, marginTop: 2 },
  expenseAmount: { fontSize: 14, fontWeight: '600' },
});
