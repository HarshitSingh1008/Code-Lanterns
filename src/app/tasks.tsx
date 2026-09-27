import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { member } from '@/data/store';
import type { HouseholdTask } from '@/data/types';
import { useNexus } from '@/data/useNexus';
import { dueLabel, formatDayLabel } from '@/lib/date';
import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Avatar } from '@/ui/Avatar';
import { Button, Fab, IconButton } from '@/ui/Button';
import { BubbleInput, Field, ListRow, SegmentedControl, Sheet, Toggle } from '@/ui/Controls';
import { Icon } from '@/ui/Icon';
import { AppBar, EmptyState, Notice, Screen, SectionTitle } from '@/ui/Screen';
import { Card, ProgressRing, Row, StatTile } from '@/ui/Surface';
import { TabBar } from '@/ui/TabBar';
import { Txt } from '@/ui/Txt';

const CATEGORIES: { value: HouseholdTask['category']; label: string; icon: 'house' | 'cart' | 'book' | 'heart' | 'user' | 'sparkle' }[] = [
  { value: 'chore', label: 'Chore', icon: 'house' },
  { value: 'errand', label: 'Errand', icon: 'cart' },
  { value: 'school', label: 'School', icon: 'book' },
  { value: 'health', label: 'Health', icon: 'heart' },
  { value: 'social', label: 'Social', icon: 'user' },
  { value: 'home', label: 'Home', icon: 'sparkle' },
];

const DAY_TABS = [
  { value: '0', label: 'Today' },
  { value: '1', label: 'Tomorrow' },
  { value: '2', label: 'In 2 days' },
  { value: 'week', label: 'Week' },
];

export default function Tasks() {
  const [state, dispatch] = useNexus();
  const { t } = useTheme();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(state.memberId);
  const [category, setCategory] = useState<HouseholdTask['category']>('chore');
  const [points, setPoints] = useState(10);

  const { okf, taskDay, taskFilter } = state;
  const me = member(okf, state.memberId);
  const [now] = useState(() => Date.now());

  const dayTasks = useMemo(() => {
    const offset = taskDay === 'week' ? 7 : Number(taskDay);
    const cutoff = now + offset * 86_400_000;
    return okf.tasks
      .filter((x) => new Date(x.due).getTime() <= cutoff)
      .filter((x) => (taskFilter === 'all' ? true : taskFilter === 'mine' ? x.assigneeId === me.memberId : x.done))
      .sort((a, b) => Number(a.done) - Number(b.done) || a.due.localeCompare(b.due));
  }, [okf.tasks, taskDay, taskFilter, me.memberId, now]);

  const events = okf.events
    .filter((e) => !e.done)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const myPoints = okf.tasks.filter((x) => x.assigneeId === me.memberId).reduce((s, x) => s + x.points, 0);
  const earnedToday = okf.tasks
    .filter((x) => x.assigneeId === me.memberId && x.done)
    .reduce((s, x) => s + x.points, 0);
  const doneCount = dayTasks.filter((x) => x.done).length;
  const progress = dayTasks.length ? doneCount / dayTasks.length : 0;

  function submit() {
    if (!title.trim()) return;
    dispatch({ type: 'addTask', task: { title: title.trim(), assigneeId: assignee, category, points } });
    setTitle('');
    setAdding(false);
    dispatch({ type: 'pushToast', text: 'Task added to the family list', tone: 'ok' });
  }

  return (
    <Screen
      footer={<TabBar />}
      contentStyle={{ paddingBottom: 96 }}>
      <AppBar
        title="Tasks & calendar"
        eyebrow={`${okf.familyName} · everyone sees their own`}
        right={<IconButton name="sliders" variant="ghost" onPress={() => dispatch({ type: 'setTaskFilter', value: taskFilter === 'all' ? 'mine' : 'all' })} accessibilityLabel="Filter tasks" />}
      />

      <Card tone="primary" padded>
        <Row gap={SPACING.md}>
          <ProgressRing value={progress} color={t.primary} track={t.a.text(0.14)} size={62} width={8}>
            <Txt variant="labelSm" style={{ color: t.primary }}>
              {doneCount}/{dayTasks.length}
            </Txt>
          </ProgressRing>
          <View style={{ flex: 1 }}>
            <Txt variant="title">Today’s family effort</Txt>
            <Txt variant="bodySm" tone="muted" style={{ marginTop: 2 }}>
              {doneCount === 0
                ? 'Nothing ticked yet. Someone has to go first.'
                : `${doneCount} done. ${earnedToday} points earned today.`}
            </Txt>
          </View>
        </Row>
        <Row gap={SPACING.md} wrap={false} style={{ marginTop: SPACING.md }}>
          <StatTile value={`${myPoints}`} label="Your total points" icon="star" tone="butter" />
          <StatTile value={`${okf.tasks.filter((x) => x.done).length}`} label="Done all time" icon="check" tone="tertiary" />
        </Row>
      </Card>

      <SegmentedControl
        value={taskDay}
        onChange={(v) => dispatch({ type: 'setTaskDay', value: v })}
        options={DAY_TABS}
      />

      <SegmentedControl
        value={taskFilter}
        onChange={(v) => dispatch({ type: 'setTaskFilter', value: v })}
        options={[
          { value: 'all', label: 'Everyone' },
          { value: 'mine', label: 'Just me' },
          { value: 'done', label: 'Completed' },
        ]}
      />

      {dayTasks.length === 0 ? (
        <EmptyState
          icon="checkCircle"
          title="A clean list"
          body="Nothing due in this window. Add something if you have the energy, otherwise enjoy the quiet.">
          <Button label="Add a task" icon="plus" onPress={() => setAdding(true)} />
        </EmptyState>
      ) : (
        <Card padded>
          <SectionTitle
            title={taskDay === 'week' ? 'Next seven days' : formatDayLabel(new Date(now + (Number(taskDay) || 0) * 86_400_000))}
            icon="list"
          />
          <View style={{ marginTop: SPACING.xs }}>
            {dayTasks.map((task) => {
              const owner = member(okf, task.assigneeId);
              const due = dueLabel(task.due);
              return (
                <Pressable
                  key={task.id}
                  onPress={() => dispatch({ type: 'toggleTask', id: task.id })}
                  style={({ pressed }) => [
                    styles.taskRow,
                    { borderColor: t.outlineSoft, backgroundColor: task.done ? t.surfaceAlt : t.surface },
                    pressed && { opacity: 0.75 },
                  ]}>
                  <View
                    style={[
                      styles.check,
                      {
                        backgroundColor: task.done ? t.primary : 'transparent',
                        borderColor: task.done ? t.primary : t.outline,
                      },
                    ]}>
                    {task.done ? <Icon name="check" size={13} color={t.isDark ? '#14151F' : '#ffffff'} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt
                      variant="label"
                      numberOfLines={1}
                      style={task.done ? { textDecorationLine: 'line-through', color: t.textFaint } : undefined}>
                      {task.title}
                    </Txt>
                    <Row gap={6} style={{ marginTop: 4 }}>
                      <Avatar name={owner.name} accent={owner.accent} size={18} />
                      <Txt variant="caption" tone="faint">
                        {owner.name.split(' ')[0]} · {task.points} pts
                        {task.streak ? ` · ${task.streak} day streak` : ''}
                      </Txt>
                    </Row>
                  </View>
                  <View
                    style={{
                      backgroundColor: due.tone === 'danger' ? t.tone.danger.bg : due.tone === 'warning' ? t.tone.warning.bg : t.surfaceAlt,
                      paddingHorizontal: 9,
                      paddingVertical: 5,
                      borderRadius: RADIUS.pill,
                    }}>
                    <Txt
                      variant="labelXs"
                      style={{
                        color:
                          due.tone === 'danger'
                            ? t.tone.danger.fg
                            : due.tone === 'warning'
                              ? t.tone.warning.fg
                              : t.textMuted,
                      }}>
                      {due.label.toUpperCase()}
                    </Txt>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Card>
      )}

      <Card padded>
        <SectionTitle title="Family calendar" icon="calendar" />
        {events.map((e) => (
          <Pressable
            key={e.id}
            onPress={() => dispatch({ type: 'toggleEvent', id: e.id })}
            style={({ pressed }) => [{ paddingVertical: 9, opacity: pressed ? 0.7 : 1 }]}>
            <Row gap={SPACING.md} align="flex-start">
              <View style={{ alignItems: 'center', width: 46 }}>
                <Txt variant="labelSm" tone="primary">
                  {e.date.slice(8, 10)}
                </Txt>
                <Txt variant="labelXs" tone="faint">
                  {e.date.slice(5, 7)}
                </Txt>
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="label" numberOfLines={1}>
                  {e.title}
                </Txt>
                <Txt variant="caption" tone="muted" numberOfLines={1} style={{ marginTop: 2 }}>
                  {e.time ? `${e.time} · ` : ''}
                  {e.participants.map((p) => member(okf, p).name.split(' ')[0]).join(', ')}
                </Txt>
              </View>
              <Icon name="chevronRight" size={14} color={t.textFaint} />
            </Row>
          </Pressable>
        ))}
      </Card>

      <Notice icon="star" tone="info" text="Points are not a currency. They are a way of saying thank you without having to say it eleven times." />

      <Fab name="plus" onPress={() => setAdding(true)} style={styles.fab} />

      <Sheet
        visible={adding}
        onClose={() => setAdding(false)}
        title="New task"
        footer={<Button label="Add to the list" icon="check" full onPress={submit} disabled={!title.trim()} />}>
        <Field label="What needs doing">
          <BubbleInput value={title} onChangeText={setTitle} placeholder="Water the plants" autoFocus />
        </Field>
        <Field label="Who is doing it">
          <Row gap={SPACING.sm} wrap>
            {okf.members.map((m) => {
              const active = m.memberId === assignee;
              return (
                <Pressable
                  key={m.memberId}
                  onPress={() => setAssignee(m.memberId)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: RADIUS.pill,
                    backgroundColor: active ? t.primarySoft : t.surfaceAlt,
                    borderWidth: StyleSheet.hairlineWidth * 2,
                    borderColor: active ? t.primary : 'transparent',
                  }}>
                  <Avatar name={m.name} accent={m.accent} size={20} />
                  <Txt variant="labelSm" tone={active ? 'primary' : 'muted'}>
                    {m.name.split(' ')[0]}
                  </Txt>
                </Pressable>
              );
            })}
          </Row>
        </Field>
        <Field label="What kind of job">
          <Row gap={SPACING.sm} wrap>
            {CATEGORIES.map((c) => {
              const active = c.value === category;
              return (
                <Pressable
                  key={c.value}
                  onPress={() => setCategory(c.value)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: RADIUS.pill,
                    backgroundColor: active ? t.primarySoft : t.surfaceAlt,
                    borderWidth: StyleSheet.hairlineWidth * 2,
                    borderColor: active ? t.primary : 'transparent',
                  }}>
                  <Icon name={c.icon} size={13} color={active ? t.primary : t.textMuted} />
                  <Txt variant="labelSm" tone={active ? 'primary' : 'muted'}>
                    {c.label}
                  </Txt>
                </Pressable>
              );
            })}
          </Row>
        </Field>
        <Field label={`Points: ${points}`} hint="Keep it small. Twenty-five is a big job.">
          <Row gap={SPACING.xs}>
            {[5, 10, 20, 25].map((p) => (
              <Pressable key={p} onPress={() => setPoints(p)} style={{ flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderRadius: RADIUS.md,
                    backgroundColor: points === p ? t.primary : t.surfaceAlt,
                  }}>
                  <Txt variant="labelSm" style={{ color: points === p ? (t.isDark ? '#14151F' : '#ffffff') : t.textMuted }}>
                    {p}
                  </Txt>
                </View>
              </Pressable>
            ))}
          </Row>
        </Field>
        <Toggle
          value={false}
          onChange={() => undefined}
          label="Repeat every week"
          hint="Chores stick better with a rhythm"
          icon="refresh"
        />
        <ListRow
          icon="bell"
          title="Notify the assignee"
          subtitle="A gentle nudge, not a siren"
          right={<Icon name="check" size={15} color={t.textFaint} />}
        />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    marginBottom: SPACING.sm,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 108,
  },
});
