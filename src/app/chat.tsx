import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ask, greetingFor, runIntent, suggestionsFor, AGENT_LABEL } from '@/ai/orchestrator';
import { member } from '@/data/store';
import type { ChatIntent, ChatMessage, FamilyMember } from '@/data/types';
import { useNexus } from '@/data/useNexus';
import { formatTime } from '@/lib/date';
import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Avatar } from '@/ui/Avatar';
import { BubbleInput } from '@/ui/Controls';
import { Icon, type IconName } from '@/ui/Icon';
import { IconButton } from '@/ui/Button';
import { AppBar, Notice, Screen } from '@/ui/Screen';
import { accentSlot, Card, Row, type Accent } from '@/ui/Surface';
import { TabBar } from '@/ui/TabBar';
import { RichText } from '@/ui/RichText';
import { Txt } from '@/ui/Txt';

const TIER_LABEL: Record<number, string> = { 1: 'Fast · local', 2: 'Local · full context', 3: 'Local · full graph' };

const PERSONA_LABEL: Record<FamilyMember['persona'], string> = {
  organizer: 'The Organizer',
  'playful-tutor': 'The Playful Tutor',
  'patient-companion': 'The Patient Companion',
  professional: 'The Professional',
  analyst: 'The Analyst',
};

export default function Chat() {
  const [state, dispatch] = useNexus();
  const { t } = useTheme();
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<ScrollView>(null);

  const me = member(state.okf, state.memberId);
  const messages = state.sessions[state.sessionId] ?? [];
  const suggestions = useMemo(() => suggestionsFor(me.memberId), [me.memberId]);

  useEffect(() => {
    dispatch({ type: 'setTab', tab: 'chat' });
  }, [dispatch]);

  useEffect(() => {
    const id = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(id);
  }, [messages.length, busy]);

  async function send(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    setDraft('');
    setBusy(true);
    try {
      await ask(value);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen
      scroll={false}
      footer={<TabBar />}
      contentStyle={{ paddingBottom: 8, gap: SPACING.sm }}>
      <AppBar
        title="Ask Nexus"
        eyebrow="Runs on your own hardware"
        right={
          <IconButton
            name="plus"
            variant="ghost"
            onPress={() => dispatch({ type: 'newSession' })}
            accessibilityLabel="Start a new conversation"
          />
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ gap: SPACING.md, paddingBottom: SPACING.md }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {messages.length === 0 ? (
            <View style={{ gap: SPACING.md, paddingTop: SPACING.xs }}>
              <Card tone="primary" padded>
                <Row gap={SPACING.sm}>
                  <Avatar name={me.name} accent={me.accent} size={38} />
                  <View style={{ flex: 1 }}>
                    <Txt variant="title">Hello {me.name.split(' ')[0]}</Txt>
                    <Txt variant="caption" tone="muted">
                      {PERSONA_LABEL[me.persona]}
                    </Txt>
                  </View>
                </Row>
                <Txt variant="body" style={{ marginTop: SPACING.md }}>
                  {greetingFor(me.memberId)}
                </Txt>
              </Card>
              <Txt variant="labelSm" tone="muted">
                TRY ASKING
              </Txt>
              <View style={{ gap: SPACING.sm }}>
                {suggestions.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => send(s)}
                    style={({ pressed }) => [
                      styles.suggestion,
                      { backgroundColor: t.surface, borderColor: t.outlineSoft, opacity: pressed ? 0.7 : 1 },
                    ]}>
                    <Row gap={SPACING.sm}>
                      <Icon name="sparkle" size={15} color={t.primary} />
                      <Txt variant="bodySm" style={{ flex: 1 }}>
                        {s}
                      </Txt>
                      <Icon name="chevronRight" size={14} color={t.textFaint} />
                    </Row>
                  </Pressable>
                ))}
              </View>
              <Notice
                icon="shield"
                tone="positive"
                text="Every answer is composed locally after the Privacy Guardian checks what you are allowed to see."
              />
            </View>
          ) : (
            messages.map((m) => (
              <Bubble
                key={m.id}
                message={m}
                meAccent={me.accent}
                onIntent={runIntent}
                onDone={(label) => dispatch({ type: 'pushToast', text: label, tone: 'ok' })}
                openSteps={openSteps}
                setOpenSteps={setOpenSteps}
              />
            ))
          )}

          {busy ? (
            <Row gap={SPACING.sm} style={{ paddingLeft: 4 }}>
              <View style={[styles.dot, { backgroundColor: t.primary }]} />
              <Txt variant="caption" tone="muted">
                Reading the family OKF…
              </Txt>
            </Row>
          ) : null}
        </ScrollView>

        <BubbleInput
          value={draft}
          onChangeText={setDraft}
          onSubmit={() => send(draft)}
          placeholder={me.role === 'elder' ? 'Ask in your own words…' : 'Ask about the house, the calendar, health or money…'}
          right={
            <Pressable
              onPress={() => send(draft)}
              accessibilityRole="button"
              accessibilityLabel="Send"
              style={({ pressed }) => [
                styles.send,
                { backgroundColor: t.primary, opacity: pressed || !draft.trim() ? 0.6 : 1 },
              ]}>
              <Icon name="send" size={18} color={t.isDark ? '#14151F' : '#ffffff'} />
            </Pressable>
          }
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Bubble({
  message,
  meAccent,
  onIntent,
  onDone,
  openSteps,
  setOpenSteps,
}: {
  message: ChatMessage;
  meAccent: Accent;
  onIntent: (i: ChatIntent) => void;
  onDone: (label: string) => void;
  openSteps: Record<string, boolean>;
  setOpenSteps: Dispatch<SetStateAction<Record<string, boolean>>>;
}) {
  const { t } = useTheme();
  const isUser = message.role === 'user';
  const stepsOpen = openSteps[message.id] ?? false;

  return (
    <View style={{ gap: 6, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
      {message.agent ? (
        <Row gap={6} style={{ paddingLeft: 4 }}>
          <Icon name={agentIcon(message.agent)} size={12} color={t.textFaint} />
          <Txt variant="labelXs" tone="faint">
            {(message.agentLabel ?? AGENT_LABEL[message.agent]).toUpperCase()} · {TIER_LABEL[message.tier ?? 1]}
          </Txt>
        </Row>
      ) : null}

      <View
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: accentSlot(t, meAccent).fg, borderBottomRightRadius: 6 }
            : { backgroundColor: t.surface, borderColor: t.outlineSoft, borderBottomLeftRadius: 6 },
        ]}>
        {isUser ? (
          <Txt variant="bodySmMedium" style={{ color: t.isDark ? '#14151F' : '#ffffff' }}>
            {message.text}
          </Txt>
        ) : (
          <RichText text={message.text} variant="body" />
        )}
      </View>

      {message.citations?.length ? (
        <Row gap={6} wrap style={{ paddingLeft: 4, paddingRight: 4 }}>
          {message.citations.map((c) => (
            <View
              key={`${c.refId}-${c.label}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: t.surfaceAlt,
                paddingHorizontal: 9,
                paddingVertical: 5,
                borderRadius: RADIUS.pill,
              }}>
              <Icon name={kindIcon(c.kind)} size={11} color={t.textMuted} />
              <Txt variant="caption" tone="muted">
                {c.label}
              </Txt>
            </View>
          ))}
        </Row>
      ) : null}

      {message.actions?.length ? (
        <Row gap={SPACING.sm} wrap style={{ paddingLeft: 4 }}>
          {message.actions.map((a) => (
            <Pressable
              key={a.id}
              onPress={() => {
                if (a.intent) onIntent(a.intent);
                onDone(a.label);
              }}
              style={({ pressed }) => [
                styles.action,
                {
                  backgroundColor: a.kind === 'primary' ? t.primary : 'transparent',
                  borderColor: a.kind === 'primary' ? 'transparent' : t.outline,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}>
              <Txt
                variant="labelSm"
                style={{ color: a.kind === 'primary' ? (t.isDark ? '#14151F' : '#ffffff') : t.primary }}>
                {a.label}
              </Txt>
            </Pressable>
          ))}
        </Row>
      ) : null}

      {message.steps?.length ? (
        <View style={{ paddingLeft: 4, width: '100%' }}>
          <Pressable
            onPress={() => setOpenSteps((p) => ({ ...p, [message.id]: !p[message.id] }))}
            hitSlop={8}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Icon name={stepsOpen ? 'chevronDown' : 'chevronRight'} size={11} color={t.textFaint} />
            <Txt variant="caption" tone="faint">
              {message.steps.length} agents · {message.steps.reduce((s, x) => s + x.ms, 0)}ms
            </Txt>
          </Pressable>
          {stepsOpen ? (
            <View style={{ marginTop: 6, gap: 4 }}>
              {message.steps.map((s, i) => (
                <Row key={`${s.label}-${i}`} gap={SPACING.sm}>
                  <View style={[styles.stepDot, { backgroundColor: t.primary }]} />
                  <Txt variant="caption" tone="muted" style={{ flex: 1 }}>
                    {s.label} · {s.detail}
                  </Txt>
                  <Txt variant="caption" tone="faint">
                    {s.ms}ms
                  </Txt>
                </Row>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      <Txt variant="labelXs" tone="faint" style={{ paddingHorizontal: 4 }}>
        {formatTime(new Date(message.at))}
      </Txt>
    </View>
  );
}

function agentIcon(agent?: string): IconName {
  switch (agent) {
    case 'health':
    case 'medical':
      return 'pill';
    case 'finance':
      return 'wallet';
    case 'home':
      return 'house';
    case 'memory':
      return 'photo';
    case 'tasks':
      return 'checkCircle';
    case 'privacy':
    case 'privacy-guardian':
      return 'shield';
    default:
      return 'brain';
  }
}

function kindIcon(kind: string): IconName {
  switch (kind) {
    case 'memory':
      return 'photo';
    case 'event':
      return 'calendar';
    case 'task':
      return 'checkCircle';
    case 'transaction':
      return 'wallet';
    case 'graph':
      return 'graph';
    default:
      return 'link';
  }
}

const styles = StyleSheet.create({
  suggestion: {
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  bubble: {
    maxWidth: '88%',
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'transparent',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: RADIUS.pill },
  stepDot: { width: 5, height: 5, borderRadius: RADIUS.pill, marginTop: 6 },
  action: {
    borderRadius: RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
  },
});
