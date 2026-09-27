import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { member } from '@/data/store';
import type { AuditEntry, DataCategory, PrivacyLevel } from '@/data/types';
import { useNexus } from '@/data/useNexus';
import { relativeTime } from '@/lib/date';
import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Avatar } from '@/ui/Avatar';
import { Button } from '@/ui/Button';
import { ListRow, SegmentedControl, Toggle } from '@/ui/Controls';
import { Icon, type IconName } from '@/ui/Icon';
import { AppBar, EmptyState, Notice, Screen, SectionTitle } from '@/ui/Screen';
import { Card, Row, StatTile } from '@/ui/Surface';
import { TabBar } from '@/ui/TabBar';
import { Txt } from '@/ui/Txt';

const LEVELS: PrivacyLevel[] = ['private', 'guardians', 'family', 'extended'];
const LEVEL_HELP: Record<PrivacyLevel, string> = {
  private: 'Only this person',
  guardians: 'Parents and guardians',
  family: 'The whole family',
  extended: 'Family plus invited guests',
  professionals: 'Doctors and advisors, with consent',
  anonymous: 'Stripped of names, used for insights only',
};

const CATEGORIES: { key: DataCategory; label: string; icon: IconName }[] = [
  { key: 'health', label: 'Health records', icon: 'heart' },
  { key: 'finance', label: 'Money and budgets', icon: 'wallet' },
  { key: 'location', label: 'Location', icon: 'footprints' },
  { key: 'communications', label: 'Messages and voice notes', icon: 'mic' },
  { key: 'biometrics', label: 'Wearables and sensors', icon: 'activity' },
  { key: 'memories', label: 'Memories and photos', icon: 'photo' },
];

const AUDIT_ICON: Record<AuditEntry['category'], IconName> = {
  ai: 'sparkle',
  access: 'eye',
  edit: 'edit',
  consent: 'shield',
  sync: 'refresh',
  security: 'lock',
};

export default function Privacy() {
  const [state, dispatch] = useNexus();
  const { t } = useTheme();
  const [tab, setTab] = useState<'controls' | 'audit'>('controls');
  const [subject, setSubject] = useState<string>(state.memberId);

  const { okf } = state;
  const config = okf.privacy[subject] ?? okf.privacy[state.memberId];
  const person = member(okf, subject);

  const audit = useMemo(
    () => (tab === 'audit' ? okf.audit.slice(0, 60) : okf.audit.slice(0, 5)),
    [okf.audit, tab]
  );

  const blockedToday = okf.audit.filter((a) => !a.ok).length;
  const consentChanges = okf.audit.filter((a) => a.category === 'consent').length;

  return (
    <Screen
      footer={<TabBar />}
      contentStyle={{ paddingBottom: 96 }}>
      <AppBar title="Privacy" eyebrow="Nothing leaves the house without asking" />

      <Row gap={SPACING.md} wrap={false}>
        <StatTile value={`${okf.audit.length}`} label="Events in the log" icon="list" tone="primary" />
        <StatTile value={`${blockedToday}`} label="Blocked attempts" icon="shield" tone="tertiary" />
      </Row>

      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: 'controls', label: 'Controls' },
          { value: 'audit', label: `Audit log (${consentChanges})` },
        ]}
      />

      {tab === 'controls' ? (
        <>
          <Card padded>
            <SectionTitle title="Whose data?" icon="user" />
            <Row gap={SPACING.sm} wrap style={{ marginTop: SPACING.xs }}>
              {okf.members.map((m) => {
                const active = m.memberId === subject;
                return (
                  <Pressable
                    key={m.memberId}
                    onPress={() => setSubject(m.memberId)}
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
          </Card>

          <Card padded>
            <SectionTitle title={`${person.name.split(' ')[0]}’s visibility`} icon="eye" />
            <View style={{ marginTop: SPACING.xs, gap: SPACING.md }}>
              {CATEGORIES.map((c) => {
                const level = config?.dataCategories[c.key] ?? 'family';
                return (
                  <View key={c.key} style={{ gap: 7 }}>
                    <Row gap={SPACING.sm}>
                      <Icon name={c.icon} size={15} color={t.textMuted} />
                      <Txt variant="labelSm" style={{ flex: 1 }}>
                        {c.label}
                      </Txt>
                      <View
                        style={{
                          backgroundColor: t.privacy[level].bg,
                          paddingHorizontal: 9,
                          paddingVertical: 4,
                          borderRadius: RADIUS.pill,
                        }}>
                        <Txt variant="labelXs" style={{ color: t.privacy[level].fg }}>
                          {level.toUpperCase()}
                        </Txt>
                      </View>
                    </Row>
                    <Row gap={6}>
                      {LEVELS.map((l) => {
                        const on = level === l;
                        return (
                          <Pressable
                            key={l}
                            onPress={() => dispatch({ type: 'setCategory', memberId: subject, category: c.key, level: l })}
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              paddingVertical: 8,
                              borderRadius: RADIUS.pill,
                              backgroundColor: on ? t.privacy[l].fg : t.surfaceAlt,
                            }}>
                            <Txt
                              variant="labelXs"
                              numberOfLines={1}
                              style={{ color: on ? (t.isDark ? '#14151F' : '#ffffff') : t.textMuted }}>
                              {l}
                            </Txt>
                          </Pressable>
                        );
                      })}
                    </Row>
                    <Txt variant="caption" tone="faint">
                      {LEVEL_HELP[level]}
                    </Txt>
                  </View>
                );
              })}
            </View>
          </Card>

          <Card padded>
            <SectionTitle title="Permissions" icon="sliders" />
            <View style={{ marginTop: SPACING.xs, gap: SPACING.sm }}>
              <Toggle
                value={config?.allowLocal ?? true}
                onChange={(v) => dispatch({ type: 'setPrivacy', memberId: subject, patch: { allowLocal: v } })}
                label="Use on the local server"
                hint="Required for anything to work"
                icon="house"
              />
              <Toggle
                value={config?.allowCloud ?? false}
                onChange={(v) => {
                  dispatch({ type: 'setPrivacy', memberId: subject, patch: { allowCloud: v } });
                  dispatch({
                    type: 'pushToast',
                    text: v ? 'Cloud models allowed for this person' : 'Cloud models blocked again',
                    tone: v ? 'warn' : 'ok',
                  });
                }}
                label="Allow cloud models"
                hint="Still off by default. Turning it on is your call."
                icon="cloud"
              />
              <Toggle
                value={config?.anonymizeForCloud ?? true}
                onChange={(v) => dispatch({ type: 'setPrivacy', memberId: subject, patch: { anonymizeForCloud: v } })}
                label="Anonymise before any cloud call"
                icon="eyeOff"
              />
              <Toggle
                value={config?.notifyOnAccess ?? false}
                onChange={(v) => dispatch({ type: 'setPrivacy', memberId: subject, patch: { notifyOnAccess: v } })}
                label="Tell me when someone reads my data"
                icon="bell"
              />
              <Toggle
                value={config?.logAccess ?? true}
                onChange={(v) => dispatch({ type: 'setPrivacy', memberId: subject, patch: { logAccess: v } })}
                label="Write an entry in the audit log"
                icon="list"
              />
              <Toggle
                value={config?.autoDelete ?? false}
                onChange={(v) => dispatch({ type: 'setPrivacy', memberId: subject, patch: { autoDelete: v } })}
                label="Delete old records automatically"
                hint={`Currently keeping ${config?.retentionDays ?? 365} days`}
                icon="trash"
              />
            </View>
            <ListRow
              icon="clock"
              title="Retention period"
              subtitle={`${config?.retentionDays ?? 365} days`}
              onPress={() =>
                dispatch({ type: 'setPrivacy', memberId: subject, patch: { retentionDays: (config?.retentionDays ?? 365) === 365 ? 90 : 365 } })
              }
            />
          </Card>

          <Card padded>
            <SectionTitle title="Data this server holds" icon="database" />
            <View style={{ marginTop: SPACING.xs, gap: SPACING.sm }}>
              {[
                ['Health records', okf.health.length, 'pill'],
                ['Vitals readings', okf.vitals.length, 'activity'],
                ['Transactions', okf.transactions.length, 'wallet'],
                ['Tasks', okf.tasks.length, 'checkCircle'],
                ['Calendar events', okf.events.length, 'calendar'],
                ['Inventory items', okf.inventory.length, 'box'],
                ['Memories', okf.memories.length, 'photo'],
                ['Audit entries', okf.audit.length, 'shield'],
              ].map(([label, count, icon]) => (
                <Row key={String(label)} gap={SPACING.sm}>
                  <Icon name={icon as IconName} size={15} color={t.textMuted} />
                  <Txt variant="bodySm" style={{ flex: 1 }}>
                    {String(label)}
                  </Txt>
                  <Txt variant="labelSm" tone="muted">
                    {String(count)}
                  </Txt>
                </Row>
              ))}
            </View>
            <Button
              label="Export everything as JSON"
              icon="download"
              variant="tonal"
              full
              style={{ marginTop: SPACING.md }}
              onPress={() => {
                const blob = JSON.stringify(okf, null, 2);
                if (typeof window !== 'undefined') {
                  const url = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `family-okf-v${okf.version}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
                dispatch({ type: 'pushToast', text: 'OKF exported to your downloads', tone: 'ok' });
              }}
            />
          </Card>
        </>
      ) : (
        <Card padded>
          <SectionTitle title="Everything that happened" icon="list" />
          {audit.length === 0 ? (
            <EmptyState icon="list" title="Nothing logged" body="Turn on access logging to fill this in." />
          ) : (
            <View style={{ marginTop: SPACING.xs, gap: SPACING.md }}>
              {audit.map((a) => {
                const actor = a.actor === 'system' || a.actor === 'nexus' ? null : member(okf, a.actor);
                return (
                  <Row key={a.id} gap={SPACING.md} align="flex-start">
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: RADIUS.pill,
                        backgroundColor: a.ok ? t.surfaceAlt : t.tone.danger.bg,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon name={AUDIT_ICON[a.category]} size={13} color={a.ok ? t.textMuted : t.tone.danger.fg} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt variant="bodySmMedium">{a.action}</Txt>
                      <Txt variant="caption" tone="muted">
                        {a.target}
                      </Txt>
                      <Row gap={6} style={{ marginTop: 4 }}>
                        {actor ? <Avatar name={actor.name} accent={actor.accent} size={14} /> : <Icon name="brain" size={11} color={t.textFaint} />}
                        <Txt variant="caption" tone="faint">
                          {a.actor} · {relativeTime(a.at)} · #{a.hash}
                        </Txt>
                      </Row>
                    </View>
                    {!a.ok ? (
                      <View style={{ backgroundColor: t.tone.danger.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.pill }}>
                        <Txt variant="labelXs" style={{ color: t.tone.danger.fg }}>
                          BLOCKED
                        </Txt>
                      </View>
                    ) : null}
                  </Row>
                );
              })}
            </View>
          )}
        </Card>
      )}

      <Notice
        icon="shield"
        tone="positive"
        text="The Privacy Guardian agent runs before every assistant answer. It has never been given permission to override these rules."
      />
    </Screen>
  );
}
