import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { FamilyMember } from '@/data/types';
import { useNexus } from '@/data/useNexus';
import { relativeTime } from '@/lib/date';
import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Avatar } from '@/ui/Avatar';
import { Button, IconButton } from '@/ui/Button';
import { BubbleInput, Field, ListRow, Sheet, Toggle } from '@/ui/Controls';
import { Icon } from '@/ui/Icon';
import { AppBar, Notice, Screen } from '@/ui/Screen';
import { accentSlot, Card, Row, StatTile } from '@/ui/Surface';
import { TabBar } from '@/ui/TabBar';
import { Txt } from '@/ui/Txt';

const ROLE_LABEL: Record<FamilyMember['role'], string> = {
  parent: 'Parent',
  child: 'Child',
  elder: 'Elder',
  guardian: 'Guardian',
  guest: 'Guest',
};

const PERSONAS: { value: FamilyMember['persona']; label: string; blurb: string }[] = [
  { value: 'organizer', label: 'The Organizer', blurb: 'Lists, plans, nags gently' },
  { value: 'playful-tutor', label: 'The Playful Tutor', blurb: 'Games, stickers, patience' },
  { value: 'patient-companion', label: 'The Patient Companion', blurb: 'Slow, warm, large type' },
  { value: 'professional', label: 'The Professional', blurb: 'Precise and brief' },
  { value: 'analyst', label: 'The Analyst', blurb: 'Numbers first, opinions later' },
];

export default function Members() {
  const [state, dispatch] = useNexus();
  const { t } = useTheme();
  const [editing, setEditing] = useState<FamilyMember | null>(null);
  const [name, setName] = useState('');

  const { okf, memberId } = state;
  const online = okf.members.filter((m) => m.online);

  const stats = useMemo(
    () =>
      okf.members.map((m) => ({
        m,
        tasks: okf.tasks.filter((x) => x.assigneeId === m.memberId && !x.done).length,
        health: okf.health.filter((h) => h.memberId === m.memberId && h.status !== 'resolved').length,
        memories: okf.memories.filter((x) => x.participants.includes(m.memberId)).length,
        points: okf.tasks.filter((x) => x.assigneeId === m.memberId).reduce((s, x) => s + x.points, 0),
      })),
    [okf]
  );

  return (
    <Screen
      footer={<TabBar />}
      contentStyle={{ paddingBottom: 96 }}>
      <AppBar
        title="Family"
        eyebrow={`${okf.members.length} members · ${online.length} online now`}
        right={
          <IconButton
            name="plus"
            variant="ghost"
            onPress={() => dispatch({ type: 'pushToast', text: 'Invites are simulated in this demo', tone: 'info' })}
            accessibilityLabel="Invite someone"
          />
        }
      />

      <Row gap={SPACING.md} wrap={false}>
        <StatTile value={`${okf.members.length}`} label="Members" icon="user" tone="primary" />
        <StatTile value={`${online.length}`} label="Online right now" icon="activity" tone="tertiary" />
      </Row>

      {stats.map(({ m, tasks, health, memories, points }, i) => {
        const active = m.memberId === memberId;
        const { fg } = accentSlot(t, m.accent);
        return (
          <Pressable
            key={m.memberId}
            onPress={() => dispatch({ type: 'setMember', memberId: m.memberId })}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
            <Card padded tone={active ? 'primary' : 'surface'}>
              <Row gap={SPACING.md} align="flex-start">
                <View>
                  <Avatar name={m.name} accent={m.accent} size={54} online={m.online} />
                </View>
                <View style={{ flex: 1 }}>
                  <Row gap={6}>
                    <Txt variant="title">{m.name}</Txt>
                    {active ? (
                      <View style={{ backgroundColor: t.primary, paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.pill }}>
                        <Txt variant="labelXs" style={{ color: t.isDark ? '#14151F' : '#ffffff' }}>
                          ACTIVE
                        </Txt>
                      </View>
                    ) : null}
                  </Row>
                  <Txt variant="caption" tone="muted">
                    {ROLE_LABEL[m.role]} · {m.age} · {m.tagline}
                  </Txt>
                  <Row gap={6} style={{ marginTop: 6, flexWrap: 'wrap' }}>
                    <View style={[styles.pill, { backgroundColor: t.privacy[m.privacyLevel].bg }]}>
                      <Txt variant="labelXs" style={{ color: t.privacy[m.privacyLevel].fg }}>
                        {m.privacyLevel.toUpperCase()}
                      </Txt>
                    </View>
                    <View style={[styles.pill, { backgroundColor: t.surfaceAlt }]}>
                      <Txt variant="labelXs" tone="muted">
                        {PERSONAS.find((p) => p.value === m.persona)?.label.toUpperCase()}
                      </Txt>
                    </View>
                    {m.online ? (
                      <Row gap={4}>
                        <View style={{ width: 6, height: 6, borderRadius: RADIUS.pill, backgroundColor: fg }} />
                        <Txt variant="labelXs" tone="muted">
                          {m.status.toUpperCase()}
                        </Txt>
                      </Row>
                    ) : null}
                  </Row>
                </View>
                <IconButton
                  name="edit"
                  size={34}
                  variant="ghost"
                  onPress={() => {
                    setEditing(m);
                    setName(m.name);
                  }}
                  accessibilityLabel={`Edit ${m.name}`}
                />
              </Row>

              <Row gap={SPACING.md} style={{ marginTop: SPACING.md }}>
                {[
                  ['Tasks', String(tasks), 'checkCircle'],
                  ['Health', String(health), 'heart'],
                  ['Memories', String(memories), 'photo'],
                  ['Points', String(points), 'star'],
                ].map(([label, value, icon]) => (
                  <View key={label} style={{ flex: 1, backgroundColor: t.surfaceAlt, borderRadius: RADIUS.md, padding: 10, gap: 2 }}>
                    <Row gap={4}>
                      <Icon name={icon as never} size={12} color={t.textFaint} />
                      <Txt variant="labelXs" tone="faint">
                        {label.toUpperCase()}
                      </Txt>
                    </Row>
                    <Txt variant="title">{value}</Txt>
                  </View>
                ))}
              </Row>

              {i < stats.length - 1 ? (
                <View style={{ marginTop: SPACING.md, gap: 6 }}>
                  <Txt variant="labelXs" tone="faint">
                    DEVICES
                  </Txt>
                  {m.devices.map((d) => (
                    <Row key={d.id} gap={SPACING.sm}>
                      <Icon name={d.kind === 'speaker' ? 'volume' : d.kind === 'tablet' ? 'photo' : 'user'} size={13} color={t.textFaint} />
                      <Txt variant="caption" tone="muted" style={{ flex: 1 }}>
                        {d.name} · {d.platform}
                      </Txt>
                      <Txt variant="caption" tone="faint">
                        {relativeTime(d.lastSeen)}
                      </Txt>
                      {d.trusted ? <Icon name="shield" size={12} color={t.tone.positive.fg} /> : <Icon name="alert" size={12} color={t.tone.warning.fg} />}
                    </Row>
                  ))}
                </View>
              ) : null}
            </Card>
          </Pressable>
        );
      })}

      <Notice
        icon="sparkle"
        tone="info"
        text="Tap anyone to switch the whole app into their view. Their privacy rules apply immediately."
      />

      <Sheet
        visible={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing ? `Editing ${editing.name.split(' ')[0]}` : 'Edit member'}
        footer={
          <Button
            label="Save changes"
            icon="check"
            full
            onPress={() => {
              if (editing && name.trim()) dispatch({ type: 'renameMember', memberId: editing.memberId, name: name.trim() });
              setEditing(null);
              dispatch({ type: 'pushToast', text: 'Member updated', tone: 'ok' });
            }}
          />
        }>
        <Field label="Name">
          <BubbleInput value={name} onChangeText={setName} placeholder="Full name" />
        </Field>
        {editing ? (
          <Field label="Assistant persona" hint="Changes the tone, never the privacy rules.">
            <View style={{ gap: SPACING.sm }}>
              {PERSONAS.map((p) => {
                const on = p.value === editing.persona;
                return (
                  <ListRow
                    key={p.value}
                    title={p.label}
                    subtitle={p.blurb}
                    onPress={() => {
                      setEditing({ ...editing, persona: p.value });
                      dispatch({ type: 'pushToast', text: `${p.label} selected`, tone: 'info' });
                    }}
                    right={on ? <Icon name="checkCircle" size={17} color={t.primary} /> : undefined}
                  />
                );
              })}
            </View>
          </Field>
        ) : null}
        <Toggle value={false} onChange={() => undefined} label="Elder Mode for this person" hint="Larger type and fewer choices" icon="eye" />
        <Toggle value onChange={() => undefined} label="Can approve spending" icon="wallet" />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
});
