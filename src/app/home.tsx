import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useNexus } from '@/data/useNexus';
import { member } from '@/data/store';
import { clockLabel, greeting } from '@/lib/date';
import { useTheme } from '@/theme/ThemeProvider';
import { SPACING } from '@/theme/tokens';
import { AvatarStack } from '@/ui/Avatar';
import { Button, IconButton } from '@/ui/Button';
import { Icon } from '@/ui/Icon';
import { AppBar, Notice, Screen, SectionTitle } from '@/ui/Screen';
import { Card, FadeIn, IconOrb, ProgressRing, Row, StatTile } from '@/ui/Surface';
import { TabBar } from '@/ui/TabBar';
import { Txt } from '@/ui/Txt';

export default function Dashboard() {
  const [state, dispatch] = useNexus();
  const { t } = useTheme();
  const router = useRouter();
  const { okf, memberId } = state;
  const me = member(okf, memberId);

  const openTasks = okf.tasks.filter((x) => !x.done);
  const doneToday = okf.tasks.filter((x) => x.done).length;
  const upcoming = okf.events.filter((e) => !e.done).slice(0, 3);
  const lowStock = okf.inventory.filter((i) => i.quantity <= i.lowAt);
  const todaySpend = okf.transactions
    .filter((x) => x.date.slice(0, 10) === new Date().toISOString().slice(0, 10))
    .reduce((s, x) => s + x.amount, 0);
  const medsDue = okf.health.filter((h) => h.type === 'medication' && h.status === 'active');
  const pinned = state.pinned
    .map((id) => okf.memories.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const completion = okf.tasks.length ? doneToday / Math.max(1, okf.tasks.filter((x) => x.due.slice(0, 10) === new Date().toISOString().slice(0, 10)).length + doneToday) : 0;

  useEffect(() => {
    dispatch({ type: 'setTab', tab: 'home' });
  }, [dispatch]);

  const isParent = me.role === 'parent' || me.role === 'guardian';

  return (
    <Screen
      footer={<TabBar />}
      contentStyle={{ paddingBottom: LAYOUT_PAD }}>
      <AppBar
        title={greeting()}
        eyebrow={clockLabel()}
        right={
          <>
            <IconButton
              name="sparkle"
              onPress={() => router.push('/chat')}
              accessibilityLabel="Ask the assistant"
            />
            <AvatarStack
              people={okf.members.map((m) => ({ name: m.name, accent: m.accent }))}
              max={3}
              size={30}
            />
          </>
        }
      />

      <FadeIn>
        <Card tone="primary" padded>
          <Row align="flex-start" gap={SPACING.md}>
            <View style={{ flex: 1 }}>
              <Txt variant="headline">{me.name.split(' ')[0]}’s house today</Txt>
              <Txt variant="bodySm" tone="muted" style={{ marginTop: 4 }}>
                {openTasks.length} things still open, {doneToday} already done, and {lowStock.length} running low in the pantry.
              </Txt>
            </View>
            <ProgressRing value={completion} color={t.primary} track={t.a.text(0.14)} size={56} width={7}>
              <Txt variant="labelSm" style={{ color: t.primary }}>
                {Math.round(completion * 100)}%
              </Txt>
            </ProgressRing>
          </Row>
          <Row gap={SPACING.sm} wrap style={{ marginTop: SPACING.md }}>
            <Button
              label="Ask anything"
              icon="sparkle"
              onPress={() => {
                dispatch({ type: 'setTab', tab: 'chat' });
                router.push('/chat');
              }}
            />
            <Button label="Add a task" icon="plus" variant="ghost" onPress={() => router.push('/tasks')} />
          </Row>
        </Card>
      </FadeIn>

      <Row gap={SPACING.md} wrap={false}>
        <StatTile
          value={`${openTasks.length}`}
          label="Open tasks"
          icon="checkCircle"
          tone="primary"
          onPress={() => router.push('/tasks')}
        />
        <StatTile
          value={`$${Math.round(todaySpend)}`}
          label="Spent today"
          icon="wallet"
          tone="tertiary"
          onPress={() => router.push('/finance')}
        />
      </Row>

      <FadeIn delay={60}>
        <Card padded>
          <SectionTitle title="Coming up" icon="calendar" action="Calendar" onAction={() => router.push('/tasks')} />
          {upcoming.length === 0 ? (
            <Txt variant="bodySm" tone="muted">
              Nothing on the calendar. Rare and wonderful.
            </Txt>
          ) : (
            upcoming.map((e, i) => {
              const who = e.participants.map((p) => member(okf, p).name.split(' ')[0]);
              return (
                <Pressable
                  key={e.id}
                  onPress={() => dispatch({ type: 'toggleEvent', id: e.id })}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, paddingVertical: 10 }]}>
                  <Row gap={SPACING.md} align="flex-start">
                    <View style={{ alignItems: 'center', width: 42 }}>
                      <Txt variant="labelXs" tone="primary">
                        {e.date.slice(5, 7) === new Date().toISOString().slice(5, 7) ? 'NOW' : e.date.slice(8, 10)}
                      </Txt>
                      <View style={{ width: 1, flex: 1, backgroundColor: t.outlineSoft, marginTop: 4 }} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt variant="label" numberOfLines={1}>
                        {e.title}
                      </Txt>
                      <Txt variant="caption" tone="muted" style={{ marginTop: 2 }} numberOfLines={1}>
                        {e.time ? `${e.time} · ` : ''}
                        {who.join(', ')}
                      </Txt>
                    </View>
                    {i === 0 ? <IconOrb name="bell" tone="butter" size={30} /> : null}
                  </Row>
                </Pressable>
              );
            })
          )}
        </Card>
      </FadeIn>

      <FadeIn delay={110}>
        <Card padded>
          <SectionTitle title="Needs you" icon="bell" />
          <Row gap={SPACING.sm} wrap style={{ marginTop: SPACING.xs }}>
            {medsDue.map((m) => (
              <Pressable
                key={m.id}
                onPress={() => {
                  dispatch({ type: 'toggleMed', id: m.id });
                  dispatch({
                    type: 'pushToast',
                    text: m.takenToday ? `${m.title} unmarked` : `${m.title} logged`,
                    tone: m.takenToday ? 'warn' : 'ok',
                  });
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, flexGrow: 1, flexBasis: 160 }]}>
                <View
                  style={{
                    backgroundColor: m.takenToday ? t.tone.positive.bg : t.tone.warning.bg,
                    borderRadius: 18,
                    padding: 12,
                    gap: 6,
                  }}>
                  <Row gap={SPACING.xs}>
                    <Icon name="pill" size={15} color={m.takenToday ? t.tone.positive.fg : t.tone.warning.fg} />
                    <Txt variant="labelSm" style={{ color: m.takenToday ? t.tone.positive.fg : t.tone.warning.fg, flex: 1 }} numberOfLines={1}>
                      {member(okf, m.memberId).name.split(' ')[0]}’s {m.title}
                    </Txt>
                  </Row>
                  <Txt variant="caption" tone="muted">
                    {m.takenToday ? 'Logged today ✓' : `Due ${m.nextDose ?? 'today'}`}
                  </Txt>
                </View>
              </Pressable>
            ))}
            {lowStock.map((i) => (
              <Pressable
                key={i.id}
                onPress={() => router.push('/inventory')}
                accessibilityRole="button"
                accessibilityLabel={`${i.name} running low, open the pantry`}
                style={({ pressed }) => [{ flexGrow: 1, flexBasis: 160, opacity: pressed ? 0.7 : 1 }]}>
                <View style={{ backgroundColor: t.surfaceAlt, borderRadius: 18, padding: 12, gap: 6 }}>
                  <Row gap={SPACING.xs}>
                    <Icon name="cart" size={15} color={t.textMuted} />
                    <Txt variant="labelSm" tone="muted" style={{ flex: 1 }} numberOfLines={1}>
                      {i.name} running low
                    </Txt>
                  </Row>
                  <Txt variant="caption" tone="faint">
                    {i.quantity} {i.unit} left
                  </Txt>
                </View>
              </Pressable>
            ))}
          </Row>
        </Card>
      </FadeIn>

      {pinned.length > 0 ? (
        <FadeIn delay={160}>
          <Card padded>
            <SectionTitle title="A memory worth keeping" icon="photo" action="All" onAction={() => router.push('/memories')} />
            <Pressable onPress={() => router.push('/memories')}>
              <View style={{ marginTop: SPACING.xs, gap: 6 }}>
                <Txt variant="title">{pinned[0].title}</Txt>
                <Txt variant="bodySm" tone="muted" numberOfLines={3}>
                  {pinned[0].story}
                </Txt>
                <Row gap={SPACING.xs} wrap style={{ marginTop: 4 }}>
                  {pinned[0].tags.map((tag) => (
                    <Txt key={tag} variant="caption" tone="primary">
                      #{tag}
                    </Txt>
                  ))}
                </Row>
              </View>
            </Pressable>
          </Card>
        </FadeIn>
      ) : null}

      {isParent ? (
        <Notice
          icon="shield"
          tone="positive"
          text="Everything you just saw is stored on the family server in the hallway. Nothing was sent anywhere."
        />
      ) : (
        <Notice icon="eye" tone="info" text={`You are seeing the ${me.privacyLevel} view. Ask a grown-up to change it.`} />
      )}

      <View style={{ height: 8 }} />
    </Screen>
  );
}

const LAYOUT_PAD = 96;
