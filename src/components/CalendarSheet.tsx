import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { RoleTheme } from '../theme/roleVariants';
import { Icon } from './Icon';

interface CalendarSheetProps {
  visible: boolean;
  onClose: () => void;
  theme: RoleTheme;
  events: { date: string; title: string; time: string }[];
}

export function CalendarSheet({ visible, onClose, theme, events }: CalendarSheetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8, 1));
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.date === dateStr);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.surfaceContainer }]} onPress={() => {}}>
          <View style={[styles.handle, { backgroundColor: theme.outlineVariant }]} />
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.onSurface }]}>{monthName}</Text>
            <Pressable onPress={onClose}>
              <Icon name="back" size={20} color={theme.onSurfaceVariant} />
            </Pressable>
          </View>
          <View style={styles.weekRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <Text key={d} style={[styles.weekDay, { color: theme.onSurfaceVariant }]}>{d}</Text>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {days.map((day, i) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              return (
                <View key={i} style={[styles.dayCell, { backgroundColor: day ? theme.surfaceContainerLow : 'transparent', borderRadius: theme.roundness.sm }]}>
                  {day && (
                    <>
                      <Text style={[styles.dayText, { color: theme.onSurface }]}>{day}</Text>
                      {dayEvents.length > 0 && <View style={[styles.eventDot, { backgroundColor: theme.primary }]} />}
                    </>
                  )}
                </View>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  weekDay: { width: '14%', textAlign: 'center', fontSize: 12, fontWeight: '600' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', marginVertical: 2 },
  dayText: { fontSize: 14 },
  eventDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
});
