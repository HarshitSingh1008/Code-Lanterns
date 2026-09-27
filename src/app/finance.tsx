import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';

import { member } from '@/data/store';
import type { Transaction } from '@/data/types';
import { useNexus } from '@/data/useNexus';
import { formatMonthDay, money, monthKey, monthLabelFromKey, shortMonth } from '@/lib/date';
import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { SegmentedControl } from '@/ui/Controls';
import { Icon, type IconName } from '@/ui/Icon';
import { AppBar, EmptyState, Notice, Screen, SectionTitle } from '@/ui/Screen';
import { Card, ProgressRing, Row, StatTile } from '@/ui/Surface';
import { TabBar } from '@/ui/TabBar';
import { Txt } from '@/ui/Txt';

const CATEGORY_ICON: Record<Transaction['category'], IconName> = {
  groceries: 'cart',
  transport: 'footprints',
  health: 'heart',
  school: 'book',
  utilities: 'zap',
  fun: 'star',
  savings: 'shield',
};


export default function Finance() {
  const [state, dispatch] = useNexus();
  const { t } = useTheme();
  const router = useRouter();
  const [window, setWindow] = useState<'month' | 'quarter' | 'all'>('month');
  const [category, setCategory] = useState<Transaction['category'] | 'all'>('all');

  const { okf } = state;
  const [today] = useState(() => new Date());
  const currentKey = monthKey(today.toISOString());

  const rangeStart = useMemo(() => {
    if (window === 'month') return new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    if (window === 'quarter') return new Date(today.getFullYear(), today.getMonth() - 2, 1).getTime();
    return 0;
  }, [window, today]);

  const inRange = useMemo(
    () => okf.transactions.filter((x) => new Date(x.date).getTime() >= rangeStart),
    [okf.transactions, rangeStart]
  );

  const spend = inRange.filter((x) => x.category !== 'savings').reduce((s, x) => s + x.amount, 0);
  const saved = inRange.filter((x) => x.category === 'savings').reduce((s, x) => s + x.amount, 0);
  const budgetTotal = okf.budgets.reduce((s, b) => s + b.limit, 0);
  const used = Math.min(1, budgetTotal ? spend / budgetTotal : 0);

  const byCategory = useMemo(() => {
    const map = new Map<Transaction['category'], number>();
    inRange.forEach((x) => map.set(x.category, (map.get(x.category) ?? 0) + x.amount));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [inRange]);

  const byMonth = useMemo(() => {
    const map = new Map<string, number>();
    inRange.forEach((x) => {
      if (x.category === 'savings') return;
      map.set(monthKey(x.date), (map.get(monthKey(x.date)) ?? 0) + x.amount);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  }, [inRange]);

  const peak = Math.max(...byMonth.map(([, v]) => v), 1);
  const list = category === 'all' ? inRange : inRange.filter((x) => x.category === category);

  return (
    <Screen
      footer={<TabBar />}
      contentStyle={{ paddingBottom: 96 }}>
      <AppBar title="Finance" eyebrow="Bank sync is simulated for this demo" />

      <Card tone="primary" padded>
        <Row gap={SPACING.md} align="flex-start">
          <View style={{ flex: 1 }}>
            <Txt variant="caption" tone="muted">
              {window === 'month' ? 'Spent this month' : window === 'quarter' ? 'Spent this quarter' : 'Spent all time'}
            </Txt>
            <Txt variant="displaySm" style={{ color: t.primary, marginTop: 2 }}>
              {money(spend)}
            </Txt>
            <Txt variant="caption" tone="muted" style={{ marginTop: 4 }}>
              of {money(budgetTotal)} planned · {Math.round(used * 100)}% used
            </Txt>
          </View>
          <ProgressRing value={used} color={t.primary} track={t.a.text(0.14)} size={62} width={8}>
            <Icon name="wallet" size={20} color={t.primary} />
          </ProgressRing>
        </Row>
      </Card>

      <Row gap={SPACING.md} wrap={false}>
        <StatTile value={money(saved)} label="Put into savings" icon="shield" tone="tertiary" />
        <StatTile
          value={String(inRange.length)}
          label="Transactions tracked"
          icon="list"
          tone="butter"
          onPress={() => dispatch({ type: 'pushToast', text: `${inRange.length} rows on the family server`, tone: 'info' })}
        />
      </Row>

      <SegmentedControl
        value={window}
        onChange={setWindow}
        options={[
          { value: 'month', label: 'This month' },
          { value: 'quarter', label: 'Quarter' },
          { value: 'all', label: 'All time' },
        ]}
      />

      {byMonth.length > 1 ? (
        <Card padded>
          <SectionTitle title="Spending trend" icon="activity" />
          <Row gap={SPACING.xs} align="flex-end" style={{ height: 118, marginTop: SPACING.md }}>
            {byMonth.map(([key, value]) => {
              const h = Math.max(10, (value / peak) * 96);
              const isNow = key === currentKey;
              return (
                <View key={key} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                  <Txt variant="labelXs" tone="faint">
                    {money(value)}
                  </Txt>
                  <View
                    style={{
                      width: '100%',
                      height: h,
                      borderRadius: RADIUS.sm,
                      backgroundColor: isNow ? t.primary : t.primarySoft,
                    }}
                  />
                  <Txt variant="labelXs" style={{ color: isNow ? t.primary : t.textFaint }}>
                    {shortMonth(Number(key.split('-')[1]))}
                  </Txt>
                </View>
              );
            })}
          </Row>
        </Card>
      ) : null}

      <Card padded>
        <SectionTitle title="Budgets" icon="wallet" />
        <View style={{ marginTop: SPACING.xs, gap: SPACING.md }}>
          {okf.budgets.map((b) => {
            const spent = inRange.filter((x) => x.category === b.category).reduce((s, x) => s + x.amount, 0);
            const pct = Math.min(1.4, b.limit ? spent / b.limit : 0);
            const tone = pct > 1 ? 'danger' : pct > 0.85 ? 'warning' : 'positive';
            return (
              <View key={b.id} style={{ gap: 6 }}>
                <Row gap={SPACING.sm}>
                  <Icon name={CATEGORY_ICON[b.category]} size={15} color={t.textMuted} />
                  <Txt variant="labelSm" tone="muted" style={{ flex: 1, textTransform: 'capitalize' }}>
                    {b.category}
                  </Txt>
                  <Txt variant="caption" tone={tone}>
                    {money(spent)} / {money(b.limit)}
                  </Txt>
                </Row>
                <View style={{ height: 8, borderRadius: RADIUS.pill, backgroundColor: t.a.text(0.1), overflow: 'hidden' }}>
                  <View
                    style={{
                      width: `${Math.min(100, pct * 100)}%`,
                      height: '100%',
                      borderRadius: RADIUS.pill,
                      backgroundColor: t.tone[tone].fg,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </Card>

      <Card padded>
        <SectionTitle title="Goals" icon="star" />
        <View style={{ marginTop: SPACING.xs, gap: SPACING.md }}>
          {okf.goals.map((g) => {
            const pct = Math.min(1, g.saved / g.target);
            return (
              <View key={g.id} style={{ gap: 6 }}>
                <Row gap={SPACING.sm}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: RADIUS.pill,
                      backgroundColor: t.butterSoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon name={g.icon === 'book' ? 'book' : g.icon === 'heart' ? 'heart' : g.icon === 'leaf' ? 'leaf' : 'zap'} size={14} color={t.mode === 'dark' ? t.butter : '#8A6100'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt variant="labelSm" numberOfLines={1}>
                      {g.title}
                    </Txt>
                    <Txt variant="caption" tone="faint">
                      by {formatMonthDay(g.targetDate)}
                    </Txt>
                  </View>
                  <Txt variant="labelSm" tone="primary">
                    {Math.round(pct * 100)}%
                  </Txt>
                </Row>
                <View style={{ height: 8, borderRadius: RADIUS.pill, backgroundColor: t.a.text(0.1), overflow: 'hidden' }}>
                  <View style={{ width: `${pct * 100}%`, height: '100%', borderRadius: RADIUS.pill, backgroundColor: t.primary }} />
                </View>
                <Txt variant="caption" tone="faint">
                  {money(g.saved)} of {money(g.target)} saved
                </Txt>
              </View>
            );
          })}
        </View>
      </Card>

      <Card padded>
        <SectionTitle title="Transactions" icon="list" action={category === 'all' ? undefined : 'Clear filter'} onAction={() => setCategory('all')} />
        <Row gap={SPACING.xs} wrap style={{ marginVertical: SPACING.sm }}>
          {(['all', ...byCategory.map(([c]) => c)] as (Transaction['category'] | 'all')[]).map((c) => {
            const active = category === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: RADIUS.pill,
                  backgroundColor: active ? t.primary : t.surfaceAlt,
                }}>
                <Txt variant="labelXs" style={{ color: active ? (t.isDark ? '#14151F' : '#ffffff') : t.textMuted, textTransform: 'capitalize' }}>
                  {c}
                </Txt>
              </Pressable>
            );
          })}
        </Row>
        {list.length === 0 ? (
          <EmptyState icon="wallet" title="No transactions" body="Nothing recorded in this range." />
        ) : (
          list.slice(0, 20).map((x) => (
            <Row key={x.id} gap={SPACING.md} style={{ paddingVertical: 9 }}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: RADIUS.pill,
                  backgroundColor: t.a.text(0.07),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name={CATEGORY_ICON[x.category]} size={15} color={t.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="bodySmMedium" numberOfLines={1}>
                  {x.label}
                </Txt>
                <Txt variant="caption" tone="faint">
                  {formatMonthDay(x.date)} · {x.category} · {x.memberId === 'family' ? 'Family' : member(okf, x.memberId).name.split(' ')[0]}
                </Txt>
              </View>
              <Txt variant="labelSm" style={{ color: x.category === 'savings' ? t.tone.positive.fg : t.text }}>
                {x.category === 'savings' ? '+' : '−'}
                {money(x.amount)}
              </Txt>
            </Row>
          ))
        )}
      </Card>

      <Button label="Ask the analyst" icon="sparkle" variant="tonal" onPress={() => router.push('/chat')} full />

      <Notice
        icon="lock"
        tone="positive"
        text={`This is a demo ledger stored in the browser. No bank was contacted, and ${monthLabelFromKey(currentKey)} is entirely fictional.`}
      />
    </Screen>
  );
}

