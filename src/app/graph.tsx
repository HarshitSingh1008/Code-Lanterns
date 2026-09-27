import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';

import { member } from '@/data/store';
import type { FamilyMember } from '@/data/types';
import { useNexus } from '@/data/useNexus';
import { mix } from '@/lib/color';
import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Avatar } from '@/ui/Avatar';
import { Button, IconButton } from '@/ui/Button';
import { Icon } from '@/ui/Icon';
import { AppBar, Notice, Screen, SectionTitle } from '@/ui/Screen';
import { accentSlot, Card, Row } from '@/ui/Surface';
import { TabBar } from '@/ui/TabBar';
import { Txt } from '@/ui/Txt';

const SIZE = 300;

type Node = { member: FamilyMember; x: number; y: number; r: number };

function layout(members: FamilyMember[]): Node[] {
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  return members.map((m, i) => {
    const angle = (i / members.length) * Math.PI * 2 - Math.PI / 2;
    const r = i === 0 ? 0 : 112;
    return { member: m, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, r: i === 0 ? 34 : 26 };
  });
}

export default function Graph() {
  const [state, dispatch] = useNexus();
  const { t } = useTheme();
  const router = useRouter();
  const { okf, graphFocus } = state;
  const me = member(okf, state.memberId);

  const members = okf.members;
  const relationships = okf.relationships;
  const nodes = useMemo(() => layout(members), [members]);
  const focus = graphFocus ? members.find((m) => m.memberId === graphFocus) : null;

  const edges = useMemo(
    () =>
      relationships
        .map((r) => {
          const a = nodes.find((n) => n.member.memberId === r.from);
          const b = nodes.find((n) => n.member.memberId === r.to);
          if (!a || !b) return null;
          return { rel: r, a, b };
        })
        .filter(Boolean) as { rel: (typeof relationships)[number]; a: Node; b: Node }[],
    [relationships, nodes]
  );

  const counts = useMemo(() => {
    const records = (id: string) =>
      okf.health.filter((h) => h.memberId === id).length +
      okf.tasks.filter((x) => x.assigneeId === id).length +
      okf.events.filter((e) => e.participants.includes(id)).length +
      okf.memories.filter((m) => m.participants.includes(id)).length +
      okf.transactions.filter((x) => x.memberId === id).length;
    return okf.members.map((m) => ({ m, n: records(m.memberId) }));
  }, [okf]);

  const maxRecords = Math.max(...counts.map((c) => c.n), 1);

  return (
    <Screen
      footer={<TabBar />}
      contentStyle={{ paddingBottom: 96 }}>
      <AppBar
        title="Family graph"
        eyebrow={`OKF v${okf.version} · rev ${okf.revision}`}
        right={
          graphFocus ? (
            <IconButton name="close" variant="ghost" onPress={() => dispatch({ type: 'setGraphFocus', memberId: null })} accessibilityLabel="Clear focus" />
          ) : null
        }
      />

      <Card padded>
        <SectionTitle title={focus ? `Focused on ${focus.name.split(' ')[0]}` : 'The household, as data'} icon="graph" />
        <View style={{ alignItems: 'center', marginTop: SPACING.sm }}>
          <View style={{ width: SIZE, height: SIZE }}>
            <Svg width={SIZE} height={SIZE}>
              <G>
                <Circle cx={SIZE / 2} cy={SIZE / 2} r={112} stroke={t.outlineSoft} strokeWidth={1} strokeDasharray="4 7" fill="none" />
                {edges.map(({ rel, a, b }) => {
                  const highlight =
                    graphFocus && (rel.from === graphFocus || rel.to === graphFocus);
                  const dim = Boolean(graphFocus) && !highlight;
                  return (
                    <Line
                      key={rel.id}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={highlight ? t.primary : t.outline}
                      strokeWidth={highlight ? 2.4 : 1.2}
                      opacity={dim ? 0.22 : 0.8}
                    />
                  );
                })}
                {nodes.map((n) => {
                  const { fg, bg } = accentSlot(t, n.member.accent);
                  const active = graphFocus === n.member.memberId;
                  const dim = Boolean(graphFocus) && !active;
                  return (
                    <G key={n.member.memberId} opacity={dim ? 0.28 : 1}>
                      <Circle
                        cx={n.x}
                        cy={n.y}
                        r={active ? n.r + 6 : n.r}
                        fill={bg}
                        stroke={active ? fg : mix(fg, t.canvas, 0.4)}
                        strokeWidth={active ? 3 : 1.5}
                      />
                      <SvgText
                        x={n.x}
                        y={n.y + 4}
                        fontSize={13}
                        fontWeight="700"
                        fill={fg}
                        textAnchor="middle">
                        {n.member.name.charAt(0)}
                      </SvgText>
                      <SvgText
                        x={n.x}
                        y={n.r + 18}
                        fontSize={9.5}
                        fontWeight="600"
                        fill={t.textMuted}
                        textAnchor="middle">
                        {n.member.name.split(' ')[0]}
                      </SvgText>
                    </G>
                  );
                })}
              </G>
            </Svg>
          </View>
        </View>
        <Txt variant="caption" tone="faint" center style={{ marginTop: SPACING.sm }}>
          {okf.relationships.length} relationships · {counts.reduce((s, c) => s + c.n, 0)} records attached
        </Txt>
      </Card>

      <Card padded>
        <SectionTitle title="Who holds what" icon="shield" />
        <View style={{ marginTop: SPACING.xs, gap: SPACING.md }}>
          {counts.map(({ m, n }) => {
            const p = okf.privacy[m.memberId];
            const isMe = m.memberId === me.memberId;
            return (
              <Pressable
                key={m.memberId}
                onPress={() => dispatch({ type: 'setGraphFocus', memberId: graphFocus === m.memberId ? null : m.memberId })}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, gap: 6 }]}>
                <Row gap={SPACING.sm}>
                  <Avatar name={m.name} accent={m.accent} size={30} />
                  <View style={{ flex: 1 }}>
                    <Row gap={6}>
                      <Txt variant="labelSm">{m.name}</Txt>
                      {isMe ? (
                        <View style={{ backgroundColor: t.primarySoft, paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.pill }}>
                          <Txt variant="labelXs" tone="primary">
                            YOU
                          </Txt>
                        </View>
                      ) : null}
                    </Row>
                    <Txt variant="caption" tone="faint">
                      {p?.allowCloud ? 'cloud allowed' : 'local only'} · {p?.retentionDays ?? 0} day retention ·{' '}
                      {Object.entries(p?.dataCategories ?? {}).filter(([, l]) => l === 'private').length} private categories
                    </Txt>
                  </View>
                  <Txt variant="labelSm" tone="muted">
                    {n}
                  </Txt>
                </Row>
                <View style={{ height: 7, borderRadius: RADIUS.pill, backgroundColor: t.a.text(0.09), overflow: 'hidden' }}>
                  <View
                    style={{
                      width: `${(n / maxRecords) * 100}%`,
                      height: '100%',
                      borderRadius: RADIUS.pill,
                      backgroundColor: accentSlot(t, m.accent).fg,
                    }}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {focus ? (
        <Card tone="primary" padded>
          <SectionTitle title={`${focus.name.split(' ')[0]}’s edges`} icon="link" />
          <View style={{ marginTop: SPACING.xs, gap: SPACING.sm }}>
            {okf.relationships
              .filter((r) => r.from === focus.memberId || r.to === focus.memberId)
              .map((r) => {
                const other = member(okf, r.from === focus.memberId ? r.to : r.from);
                return (
                  <Row key={r.id} gap={SPACING.sm}>
                    <Avatar name={other.name} accent={other.accent} size={24} />
                    <View style={{ flex: 1 }}>
                      <Txt variant="bodySmMedium">
                        {other.name} · {r.label}
                      </Txt>
                      <Txt variant="caption" tone="faint">
                        {r.kind.replace(/-/g, ' ')}
                      </Txt>
                    </View>
                    <Icon name="chevronRight" size={13} color={t.textFaint} />
                  </Row>
                );
              })}
          </View>
        </Card>
      ) : null}

      <Card padded>
        <SectionTitle title="How the graph is built" icon="brain" />
        <Txt variant="bodySm" tone="muted" style={{ marginTop: SPACING.xs }}>
          The OKF is a single document on your server that everything else reads from. Nodes are people, edges are
          relationships, and every fact — a medication, a chore, a memory — hangs off a node with its own privacy level.
        </Txt>
        <Row gap={SPACING.sm} wrap style={{ marginTop: SPACING.md }}>
          {okf.members.map((m) => (
            <Pressable
              key={m.memberId}
              onPress={() => dispatch({ type: 'setMember', memberId: m.memberId })}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 10,
                paddingVertical: 7,
                borderRadius: RADIUS.pill,
                backgroundColor: m.memberId === state.memberId ? t.primary : t.surfaceAlt,
              }}>
              <Avatar name={m.name} accent={m.accent} size={18} />
              <Txt variant="labelSm" style={{ color: m.memberId === state.memberId ? (t.isDark ? '#14151F' : '#ffffff') : t.textMuted }}>
                {m.name.split(' ')[0]}
              </Txt>
            </Pressable>
          ))}
        </Row>
        <Button
          label="View privacy controls"
          icon="shield"
          variant="tonal"
          full
          style={{ marginTop: SPACING.md }}
          onPress={() => {
            dispatch({ type: 'setTab', tab: 'privacy' });
            router.push('/privacy');
          }}
        />
      </Card>

      <Notice icon="lock" tone="positive" text="The graph never leaves the device. Rendering it here is the only place it is drawn." />
    </Screen>
  );
}

