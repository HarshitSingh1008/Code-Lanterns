import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { member } from '@/data/store';
import type { InventoryItem } from '@/data/types';
import { useNexus } from '@/data/useNexus';
import { relativeTime } from '@/lib/date';
import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Avatar } from '@/ui/Avatar';
import { Button } from '@/ui/Button';
import { BubbleInput, Field, Sheet, Toggle } from '@/ui/Controls';
import { Icon, type IconName } from '@/ui/Icon';
import { AppBar, EmptyState, Notice, Screen, SectionTitle } from '@/ui/Screen';
import { Card, ProgressRing, Row, StatTile } from '@/ui/Surface';
import { TabBar } from '@/ui/TabBar';
import { Txt } from '@/ui/Txt';

const CATEGORY_META: Record<InventoryItem['category'], { label: string; icon: IconName }> = {
  pantry: { label: 'Pantry', icon: 'box' },
  dairy: { label: 'Dairy', icon: 'house' },
  produce: { label: 'Produce', icon: 'leaf' },
  frozen: { label: 'Frozen', icon: 'zap' },
  household: { label: 'Household', icon: 'sparkle' },
  medicine: { label: 'Medicine', icon: 'pill' },
};

export default function HomeInventory() {
  const [state, dispatch] = useNexus();
  const { t } = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'low' | 'expiring'>('all');
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [smart, setSmart] = useState(true);

  const { okf } = state;

  const low = useMemo(() => okf.inventory.filter((i) => i.quantity <= i.lowAt), [okf.inventory]);
  const expiring = useMemo(
    () => okf.inventory.filter((i) => (i.expiresInDays ?? 99) <= 3),
    [okf.inventory]
  );
  const list = useMemo(() => {
    if (filter === 'low') return low;
    if (filter === 'expiring') return expiring;
    return okf.inventory;
  }, [filter, low, expiring, okf.inventory]);

  const toBuy = okf.shopping.filter((s) => !s.done);
  const stocked = okf.inventory.filter((i) => i.quantity > i.lowAt).length;
  const health = Math.round((stocked / Math.max(1, okf.inventory.length)) * 100);

  return (
    <Screen footer={<TabBar />} contentStyle={{ paddingBottom: 96 }}>
      <AppBar title="Home" eyebrow="Barcode scans and voice adds are simulated" />

      <Card tone="tertiary" padded>
        <Row gap={SPACING.md}>
          <ProgressRing value={health / 100} color={t.tertiary} track={t.a.text(0.14)} size={62} width={8}>
            <Txt variant="labelSm" style={{ color: t.tertiary }}>
              {health}%
            </Txt>
          </ProgressRing>
          <View style={{ flex: 1 }}>
            <Txt variant="title">Pantry health</Txt>
            <Txt variant="bodySm" tone="muted" style={{ marginTop: 2 }}>
              {low.length === 0
                ? 'Everything is above its low-stock line.'
                : `${low.length} items below the line, ${expiring.length} to use within three days.`}
            </Txt>
          </View>
        </Row>
      </Card>

      <Row gap={SPACING.md} wrap={false}>
        <StatTile value={`${okf.inventory.length}`} label="Tracked items" icon="box" tone="primary" />
        <StatTile
          value={`${toBuy.length}`}
          label="On the shopping list"
          icon="cart"
          tone="butter"
          onPress={() => dispatch({ type: 'pushToast', text: `${toBuy.length} things to buy`, tone: 'info' })}
        />
      </Row>

      <Card padded>
        <SectionTitle
          title="Shopping list"
          icon="cart"
          action={okf.shopping.some((s) => s.done) ? 'Clear ticked' : undefined}
          onAction={() => dispatch({ type: 'clearShopping' })}
        />
        {toBuy.length === 0 ? (
          <EmptyState icon="checkCircle" title="List is empty" body="Everything ticked off. The house is stocked." />
        ) : (
          <View style={{ marginTop: SPACING.xs, gap: SPACING.sm }}>
            {okf.shopping.map((s) => {
              const by = s.addedBy === 'nexus' ? null : member(okf, s.addedBy);
              return (
                <Pressable
                  key={s.id}
                  onPress={() => dispatch({ type: 'toggleShopping', id: s.id })}
                  style={({ pressed }) => [
                    styles.row,
                    {
                      borderColor: t.outlineSoft,
                      backgroundColor: s.done ? t.tone.positive.bg : t.surface,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}>
                  <View
                    style={[
                      styles.check,
                      {
                        backgroundColor: s.done ? t.tone.positive.fg : 'transparent',
                        borderColor: s.done ? t.tone.positive.fg : t.outline,
                      },
                    ]}>
                    {s.done ? <Icon name="check" size={12} color={t.isDark ? '#14151F' : '#ffffff'} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt
                      variant="bodySmMedium"
                      numberOfLines={1}
                      style={s.done ? { textDecorationLine: 'line-through', color: t.textMuted } : undefined}>
                      {s.name}
                    </Txt>
                    <Row gap={6} style={{ marginTop: 3 }}>
                      {by ? (
                        <Avatar name={by.name} accent={by.accent} size={15} />
                      ) : (
                        <Icon name="sparkle" size={11} color={t.primary} />
                      )}
                      <Txt variant="caption" tone="faint">
                        {s.quantity} {s.unit} · added by {by ? by.name.split(' ')[0] : 'Nexus'}
                        {s.source === 'low-stock' ? ' · auto' : ''}
                      </Txt>
                    </Row>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
        <Button
          label="Add something"
          icon="plus"
          variant="tonal"
          full
          style={{ marginTop: SPACING.md }}
          onPress={() => setAdding(true)}
        />
      </Card>

      <Row gap={SPACING.sm} wrap>
        {(['all', 'low', 'expiring'] as const).map((f) => {
          const active = filter === f;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={{
                paddingHorizontal: SPACING.md,
                paddingVertical: 9,
                borderRadius: RADIUS.pill,
                backgroundColor: active ? t.primary : t.surfaceAlt,
              }}>
              <Txt
                variant="labelSm"
                style={{
                  color: active ? (t.isDark ? '#14151F' : '#ffffff') : t.textMuted,
                  textTransform: 'capitalize',
                }}>
                {f === 'all' ? 'Everything' : f === 'low' ? `Low (${low.length})` : `Use soon (${expiring.length})`}
              </Txt>
            </Pressable>
          );
        })}
      </Row>

      {list.length === 0 ? (
        <EmptyState icon="checkCircle" title="Nothing in this filter" body="Try another filter, or scan a barcode." />
      ) : (
        <Card padded>
          <SectionTitle title="Inventory" icon="box" />
          <View style={{ marginTop: SPACING.xs, gap: SPACING.sm }}>
            {list.map((i) => {
              const isLow = i.quantity <= i.lowAt;
              const soon = (i.expiresInDays ?? 99) <= 3;
              const tone = isLow ? t.tone.danger.fg : soon ? t.tone.warning.fg : t.textMuted;
              return (
                <Row key={i.id} gap={SPACING.md} style={{ paddingVertical: 8 }}>
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: RADIUS.pill,
                      backgroundColor: isLow ? t.tone.danger.bg : soon ? t.tone.warning.bg : t.surfaceAlt,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon name={CATEGORY_META[i.category].icon} size={16} color={tone} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt variant="bodySmMedium" numberOfLines={1}>
                      {i.name}
                    </Txt>
                    <Txt variant="caption" tone="faint">
                      {i.quantity} {i.unit} · {CATEGORY_META[i.category].label} · {relativeTime(new Date(i.updatedAt).getTime())}
                    </Txt>
                  </View>
                  {soon ? (
                    <View
                      style={{
                        backgroundColor: t.tone.warning.bg,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: RADIUS.pill,
                      }}>
                      <Txt variant="labelXs" style={{ color: t.tone.warning.fg }}>
                        {i.expiresInDays === 0 ? 'TODAY' : `${i.expiresInDays}D`}
                      </Txt>
                    </View>
                  ) : isLow ? (
                    <View
                      style={{
                        backgroundColor: t.tone.danger.bg,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: RADIUS.pill,
                      }}>
                      <Txt variant="labelXs" style={{ color: t.tone.danger.fg }}>
                        LOW
                      </Txt>
                    </View>
                  ) : null}
                </Row>
              );
            })}
          </View>
        </Card>
      )}

      <Button label="Ask the home steward" icon="sparkle" variant="tonal" onPress={() => router.push('/chat')} full />

      <Notice
        icon="bell"
        tone="info"
        text="The steward watches stock levels and quietly adds things to the list. It never orders anything on its own."
      />

      <Sheet
        visible={adding}
        onClose={() => setAdding(false)}
        title="Add to the house"
        footer={
          <Button
            label="Add it"
            icon="check"
            full
            disabled={!name.trim()}
            onPress={() => {
              dispatch({ type: 'addShopping', name: name.trim(), quantity: 1, unit: 'unit' });
              setName('');
              setAdding(false);
              dispatch({ type: 'pushToast', text: 'Added to the shopping list', tone: 'ok' });
            }}
          />
        }>
        <Field label="What do you need">
          <BubbleInput value={name} onChangeText={setName} placeholder="Dishwasher tablets" autoFocus />
        </Field>
        <Toggle
          value={smart}
          onChange={setSmart}
          label="Let the steward restock it"
          hint="Adds a low-stock rule for this item"
          icon="sparkle"
        />
        <Toggle value={false} onChange={() => undefined} label="Also add it to inventory" icon="box" />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
