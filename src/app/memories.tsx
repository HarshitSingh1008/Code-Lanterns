import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { member } from '@/data/store';
import type { Memory } from '@/data/types';
import { useNexus } from '@/data/useNexus';
import { mix } from '@/lib/color';
import { formatMonthDay, relativeTime } from '@/lib/date';
import { ACCENTS, type ThemeName } from '@/theme/palettes';
import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { AvatarStack } from '@/ui/Avatar';
import { Button, IconButton } from '@/ui/Button';
import { BubbleInput, Field, Sheet, Toggle } from '@/ui/Controls';
import { Icon } from '@/ui/Icon';
import { AppBar, EmptyState, Notice, Screen } from '@/ui/Screen';
import { FadeIn, Row, StatTile } from '@/ui/Surface';
import { TabBar } from '@/ui/TabBar';
import { Txt } from '@/ui/Txt';

export default function Memories() {
  const [state, dispatch] = useNexus();
  const { t } = useTheme();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [picked, setPicked] = useState<string[]>([state.memberId]);
  const [autoTag, setAutoTag] = useState(true);
  const [justMe, setJustMe] = useState(false);

  const { okf, memoryFilter, pinned } = state;
  const tags = useMemo(
    () => Array.from(new Set(okf.memories.flatMap((m) => m.tags))).slice(0, 10),
    [okf.memories]
  );

  const list = useMemo(() => {
    const base = [...okf.memories].sort((a, b) => b.emotionalWeight - a.emotionalWeight);
    if (memoryFilter === 'pinned') return base.filter((m) => pinned.includes(m.id));
    if (memoryFilter === 'all') return base;
    if (memoryFilter.startsWith('tag:')) return base.filter((m) => m.tags.includes(memoryFilter.slice(4)));
    if (memoryFilter.startsWith('who:')) {
      return base.filter((m) => m.participants.includes(memoryFilter.slice(4)));
    }
    return base;
  }, [okf.memories, memoryFilter, pinned]);

  const avgWeight = okf.memories.length
    ? okf.memories.reduce((sum, m) => sum + m.emotionalWeight, 0) / okf.memories.length
    : 0;

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pinned', label: `Pinned (${pinned.length})` },
    ...tags.slice(0, 5).map((tag) => ({ value: `tag:${tag}`, label: `#${tag}` })),
  ];

  function submit() {
    if (!title.trim() || !story.trim()) return;
    dispatch({
      type: 'addMemory',
      memory: {
        title: title.trim(),
        story: story.trim(),
        participants: picked.length ? picked : [state.memberId],
        tags: autoTag ? ['new'] : [],
        privacyLevel: justMe ? 'private' : 'family',
      },
    });
    setTitle('');
    setStory('');
    setAdding(false);
    dispatch({ type: 'pushToast', text: 'Saved to the family memory bank', tone: 'ok' });
  }

  return (
    <Screen footer={<TabBar />} contentStyle={{ paddingBottom: 96 }}>
      <AppBar
        title="Memories"
        eyebrow={`${okf.memories.length} kept, all on this device`}
        right={<IconButton name="plus" onPress={() => setAdding(true)} accessibilityLabel="Add a memory" />}
      />

      <Row gap={SPACING.md} wrap={false}>
        <StatTile value={`${okf.memories.length}`} label="Memories stored" icon="photo" tone="primary" />
        <StatTile
          value={`${Math.round(avgWeight * 100)}%`}
          label="Average emotional weight"
          icon="heart"
          tone="secondary"
        />
      </Row>

      <Row gap={SPACING.xs} wrap>
        {filters.map((f) => {
          const active = memoryFilter === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => dispatch({ type: 'setMemoryFilter', value: f.value })}
              style={{
                paddingHorizontal: SPACING.md,
                paddingVertical: 8,
                borderRadius: RADIUS.pill,
                backgroundColor: active ? t.primary : t.surfaceAlt,
              }}>
              <Txt variant="labelSm" style={{ color: active ? (t.isDark ? '#14151F' : '#ffffff') : t.textMuted }}>
                {f.label}
              </Txt>
            </Pressable>
          );
        })}
      </Row>

      {list.length === 0 ? (
        <EmptyState icon="photo" title="No memories here" body="Try another filter, or add the first one from today.">
          <Button label="Add a memory" icon="plus" onPress={() => setAdding(true)} />
        </EmptyState>
      ) : (
        list.map((m, index) => (
          <MemoryCard key={m.id} memory={m} index={index} pinned={pinned.includes(m.id)} />
        ))
      )}

      <Notice
        icon="lock"
        tone="positive"
        text="Memories are encrypted with the family key. The assistant can only read the ones your privacy settings allow."
      />

      <Sheet
        visible={adding}
        onClose={() => setAdding(false)}
        title="Save a memory"
        footer={
          <Button
            label="Save it"
            icon="check"
            full
            disabled={!title.trim() || !story.trim()}
            onPress={submit}
          />
        }>
        <Field label="Title">
          <BubbleInput value={title} onChangeText={setTitle} placeholder="The treehouse weekend" autoFocus />
        </Field>
        <Field label="The story" hint="Write it the way you would say it out loud.">
          <BubbleInput value={story} onChangeText={setStory} placeholder="It came down in November and…" multiline />
        </Field>
        <Field label="Who was there">
          <Row gap={SPACING.sm} wrap>
            {okf.members.map((person) => {
              const on = picked.includes(person.memberId);
              return (
                <Pressable
                  key={person.memberId}
                  onPress={() =>
                    setPicked((prev) =>
                      on ? prev.filter((x) => x !== person.memberId) : [...prev, person.memberId]
                    )
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: RADIUS.pill,
                    backgroundColor: on ? t.primarySoft : t.surfaceAlt,
                  }}>
                  <AvatarStack people={[{ name: person.name, accent: person.accent }]} max={1} size={20} />
                  <Txt variant="labelSm" tone={on ? 'primary' : 'muted'}>
                    {person.name.split(' ')[0]}
                  </Txt>
                </Pressable>
              );
            })}
          </Row>
        </Field>
        <Toggle
          value={autoTag}
          onChange={setAutoTag}
          label="Let the assistant add tags"
          hint="Suggested from the text, never shared"
          icon="sparkle"
        />
        <Toggle value={justMe} onChange={setJustMe} label="Keep this one just for me" icon="lock" />
      </Sheet>
    </Screen>
  );
}

const PALETTE_ALIASES: Record<string, ThemeName> = {
  secondary: 'bubblegum',
  tertiary: 'mint',
  primary: 'periwinkle',
  butter: 'lemon',
};

function accentOf(name: string) {
  return ACCENTS[(PALETTE_ALIASES[name] ?? name) as ThemeName] ?? ACCENTS.periwinkle;
}

function MemoryCard({ memory, index, pinned }: { memory: Memory; index: number; pinned: boolean }) {
  const [state, dispatch] = useNexus();
  const { t } = useTheme();
  const a = accentOf(memory.palette[0]);
  const b = accentOf(memory.palette[1]);
  const from = t.isDark ? mix(a.primary, '#12131F', 0.7) : mix(a.primary, '#ffffff', 0.82);
  const to = t.isDark ? mix(b.primary, '#12131F', 0.74) : mix(b.primary, '#ffffff', 0.86);
  const people = memory.participants.map((p) => member(state.okf, p));

  return (
    <FadeIn delay={Math.min(index, 6) * 50}>
      <Pressable onPress={() => dispatch({ type: 'pinMemory', id: memory.id })}>
        <View style={[styles.memory, { backgroundColor: from, borderColor: t.a.primary(0.07) }]}>
          <View style={[styles.memoryGlow, { backgroundColor: to }]} />
          <Row gap={SPACING.sm} style={{ marginBottom: SPACING.xs }}>
            <Txt variant="labelXs" style={{ color: a.primary }}>
              {formatMonthDay(memory.date).toUpperCase()}
            </Txt>
            <View style={{ flex: 1 }} />
            {pinned ? <Icon name="star" size={14} color={a.primary} filled /> : null}
            <Txt variant="labelXs" style={{ color: a.primary }}>
              {Math.round(memory.emotionalWeight * 100)}%
            </Txt>
          </Row>
          <Txt variant="title" style={{ color: t.text }}>
            {memory.title}
          </Txt>
          <Txt variant="bodySm" tone="muted" style={{ marginTop: 5 }}>
            {memory.story}
          </Txt>
          <Row gap={SPACING.sm} wrap style={{ marginTop: SPACING.md }}>
            <AvatarStack people={people.map((p) => ({ name: p.name, accent: p.accent }))} max={4} size={24} />
            <View style={{ flex: 1 }} />
            {memory.tags.map((tag) => (
              <Txt key={tag} variant="caption" style={{ color: a.primary }}>
                #{tag}
              </Txt>
            ))}
          </Row>
          <Txt variant="caption" tone="faint" style={{ marginTop: SPACING.sm }}>
            {memory.source === 'ai_extracted'
              ? 'Pulled from your notes'
              : `Saved ${relativeTime(new Date(memory.date).getTime())}`}
            {pinned ? ' · tap to unpin' : ' · tap to pin'}
          </Txt>
        </View>
      </Pressable>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  memory: {
    borderRadius: RADIUS.xl,
    borderWidth: StyleSheet.hairlineWidth * 2,
    padding: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  memoryGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    top: -70,
    right: -50,
    opacity: 0.55,
  },
});
