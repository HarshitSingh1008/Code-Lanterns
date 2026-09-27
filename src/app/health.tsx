import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { canSee, member } from '@/data/store';
import type { HealthRecord } from '@/data/types';
import { useNexus } from '@/data/useNexus';
import { formatMonthDay, relativeTime } from '@/lib/date';
import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Avatar } from '@/ui/Avatar';
import { Button } from '@/ui/Button';
import { SegmentedControl } from '@/ui/Controls';
import { Icon, type IconName } from '@/ui/Icon';
import { AppBar, EmptyState, Notice, Screen, SectionTitle } from '@/ui/Screen';
import { Card, ProgressRing, Row, StatTile } from '@/ui/Surface';
import { TabBar } from '@/ui/TabBar';
import { Txt } from '@/ui/Txt';

const TYPE_ICON: Record<HealthRecord['type'], IconName> = {
  condition: 'activity',
  medication: 'pill',
  allergy: 'alert',
  vaccination: 'shield',
  appointment: 'calendar',
  vital: 'heart',
};

const SEVERITY_TONE: Record<HealthRecord['severity'], 'positive' | 'warning' | 'danger' | 'info'> = {
  info: 'info',
  mild: 'warning',
  moderate: 'warning',
  severe: 'danger',
  critical: 'danger',
};

export default function Health() {
  const [state, dispatch] = useNexus();
  const { t } = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [scope, setScope] = useState<string>('all');

  const { okf, memberId } = state;
  const me = member(okf, memberId);

  const visible = useMemo(() => {
    const privacyOf = (id: string) => okf.privacy[id];
    return okf.health
      .filter((h) => (scope === 'all' ? true : h.memberId === scope))
      .filter((h) => canSee(privacyOf(h.memberId)?.dataCategories.health ?? 'family', me, privacyOf(h.memberId)))
      .filter((h) => (filter === 'all' ? true : filter === 'active' ? h.status !== 'resolved' : h.status === 'resolved'))
      .sort((a, b) => {
        const order = { critical: 0, severe: 1, moderate: 2, mild: 3, info: 4 };
        return order[a.severity] - order[b.severity] || b.recordedAt.localeCompare(a.recordedAt);
      });
  }, [okf, scope, filter, me]);

  const hidden = okf.health.length - visible.length;
  const meds = visible.filter((h) => h.type === 'medication' && h.status === 'active');
  const dueToday = meds.filter((m) => !m.takenToday);
  const allergies = visible.filter((h) => h.type === 'allergy');

  const grouped = okf.members
    .filter((m) => okf.health.some((h) => h.memberId === m.memberId))
    .map((m) => {
      const vs = okf.vitals.filter((v) => v.memberId === m.memberId).slice(0, 3);
      return { member: m, vitals: vs };
    });

  return (
    <Screen
      footer={<TabBar />}
      contentStyle={{ paddingBottom: 96 }}>
      <AppBar title="Health" eyebrow="Encrypted at rest · never leaves the house" />

      {allergies.length > 0 ? (
        <Notice
          icon="alert"
          tone="danger"
          text={`Allergy alert: ${allergies.map((a) => `${member(okf, a.memberId).name.split(' ')[0]} — ${a.title}`).join(' · ')}`}
        />
      ) : null}

      <Card tone="tertiary" padded>
        <Row gap={SPACING.md}>
          <ProgressRing
            value={meds.length ? meds.filter((m) => m.takenToday).length / meds.length : 1}
            color={t.tertiary}
            track={t.a.text(0.14)}
            size={62}
            width={8}>
            <Icon name="pill" size={20} color={t.tertiary} />
          </ProgressRing>
          <View style={{ flex: 1 }}>
            <Txt variant="title">Medication today</Txt>
            <Txt variant="bodySm" tone="muted" style={{ marginTop: 2 }}>
              {meds.length === 0
                ? 'No active prescriptions in your visible records.'
                : dueToday.length === 0
                  ? 'All logged. That is the whole job, done.'
                  : `${dueToday.length} still to log: ${dueToday.map((d) => d.title).join(', ')}`}
            </Txt>
          </View>
        </Row>
        {meds.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => {
              dispatch({ type: 'toggleMed', id: m.id });
              dispatch({ type: 'pushToast', text: m.takenToday ? `${m.title} unmarked` : `${m.title} logged`, tone: m.takenToday ? 'warn' : 'ok' });
            }}
            style={({ pressed }) => [
              styles.medRow,
              { borderColor: t.outlineSoft, backgroundColor: m.takenToday ? t.tone.positive.bg : t.surface },
              pressed && { opacity: 0.7 },
            ]}>
            <View
              style={[
                styles.check,
                { backgroundColor: m.takenToday ? t.tone.positive.fg : 'transparent', borderColor: m.takenToday ? t.tone.positive.fg : t.outline },
              ]}>
              {m.takenToday ? <Icon name="check" size={13} color={t.isDark ? '#14151F' : '#ffffff'} /> : null}
            </View>
            <View style={{ flex: 1 }}>
              <Txt variant="label" numberOfLines={1} style={m.takenToday ? { textDecorationLine: 'line-through', color: t.textMuted } : undefined}>
                {member(okf, m.memberId).name.split(' ')[0]} · {m.title}
              </Txt>
              <Txt variant="caption" tone="faint">
                {m.schedule} {m.dosage ? `· ${m.dosage}` : ''}
              </Txt>
            </View>
            <Txt variant="labelXs" tone={m.takenToday ? 'positive' : 'warning'}>
              {m.takenToday ? 'LOGGED' : m.nextDose ?? 'TODAY'}
            </Txt>
          </Pressable>
        ))}
      </Card>

      <Row gap={SPACING.md} wrap={false}>
        <StatTile value={`${visible.length}`} label="Records you can see" icon="shield" tone="primary" />
        <StatTile value={`${hidden}`} label="Hidden from you" icon="eyeOff" tone="butter" />
      </Row>

      <SegmentedControl
        value={scope}
        onChange={setScope}
        options={[{ value: 'all', label: 'Everyone' }, ...okf.members.filter((m) => okf.health.some((h) => h.memberId === m.memberId)).map((m) => ({ value: m.memberId, label: m.name.split(' ')[0] }))]}
      />
      <SegmentedControl
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'resolved', label: 'Resolved' },
        ]}
      />

      {visible.length === 0 ? (
        <EmptyState
          icon="lock"
          title="Nothing here for you"
          body={
            hidden > 0
              ? `${hidden} health records exist for this family but they are set to private. That is working as intended.`
              : 'No health records match this filter.'
          }
        />
      ) : (
        <Card padded>
          <SectionTitle title="Health timeline" icon="activity" />
          <View style={{ marginTop: SPACING.xs, gap: SPACING.md }}>
            {visible.map((h) => {
              const owner = member(okf, h.memberId);
              const tone = SEVERITY_TONE[h.severity];
              return (
                <View key={h.id} style={{ gap: 6 }}>
                  <Row gap={SPACING.md} align="flex-start">
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: RADIUS.pill,
                        backgroundColor: t.tone[tone].bg,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon name={TYPE_ICON[h.type]} size={16} color={t.tone[tone].fg} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Row gap={6}>
                        <Avatar name={owner.name} accent={owner.accent} size={16} />
                        <Txt variant="caption" tone="faint">
                          {owner.name.split(' ')[0]} · {formatMonthDay(h.recordedAt)}
                        </Txt>
                      </Row>
                      <Txt variant="label" style={{ marginTop: 2 }}>
                        {h.title}
                      </Txt>
                      <Txt variant="bodySm" tone="muted" style={{ marginTop: 3 }}>
                        {h.details}
                      </Txt>
                      {h.provider ? (
                        <Txt variant="caption" tone="faint" style={{ marginTop: 4 }}>
                          {h.provider} · {h.status} · updated {relativeTime(new Date(h.recordedAt).getTime())}
                        </Txt>
                      ) : null}
                      {h.sharedWith.length ? (
                        <Row gap={6} style={{ marginTop: 6 }}>
                          <Icon name="eye" size={11} color={t.textFaint} />
                          <Txt variant="caption" tone="faint">
                            shared with {h.sharedWith.map((p) => member(okf, p).name.split(' ')[0]).join(', ')}
                          </Txt>
                        </Row>
                      ) : null}
                    </View>
                  </Row>
                </View>
              );
            })}
          </View>
        </Card>
      )}

      <Card padded>
        <SectionTitle title="Latest readings" icon="heart" />
        {grouped.map(({ member: m, vitals }) => (
          <View key={m.memberId} style={{ marginTop: SPACING.sm }}>
            <Row gap={SPACING.sm}>
              <Avatar name={m.name} accent={m.accent} size={24} />
              <Txt variant="labelSm" tone="muted">
                {m.name}
              </Txt>
            </Row>
            <Row gap={SPACING.sm} wrap style={{ marginTop: 8 }}>
              {vitals.map((v) => (
                <View
                  key={v.id}
                  style={{
                    flexGrow: 1,
                    flexBasis: 96,
                    backgroundColor: v.status === 'good' ? t.tone.positive.bg : v.status === 'watch' ? t.tone.warning.bg : t.tone.danger.bg,
                    borderRadius: RADIUS.md,
                    padding: 10,
                    gap: 2,
                  }}>
                  <Txt variant="labelXs" style={{ color: v.status === 'good' ? t.tone.positive.fg : v.status === 'watch' ? t.tone.warning.fg : t.tone.danger.fg }}>
                    {v.label.toUpperCase()}
                  </Txt>
                  <Txt variant="title" style={{ color: v.status === 'good' ? t.tone.positive.fg : v.status === 'watch' ? t.tone.warning.fg : t.tone.danger.fg }}>
                    {v.value}
                    <Txt variant="caption"> {v.unit}</Txt>
                  </Txt>
                </View>
              ))}
            </Row>
          </View>
        ))}
      </Card>

      <Button label="Ask about a health record" icon="sparkle" variant="tonal" onPress={() => router.push('/chat')} full />

      <Notice icon="lock" tone="positive" text="The assistant can read health records only if your privacy settings allow it. It asks the Privacy Guardian before every answer." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    marginTop: SPACING.sm,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
