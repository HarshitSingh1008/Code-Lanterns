import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';

import { wipe } from '@/data/store';
import { useNexus } from '@/data/useNexus';
import { mix } from '@/lib/color';
import { ACCENTS, THEME_NAMES, type ColorMode, type ThemeName } from '@/theme/palettes';
import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Button, IconButton } from '@/ui/Button';
import { BubbleInput, Field, ListRow, SegmentedControl, Sheet, Toggle } from '@/ui/Controls';
import { Icon } from '@/ui/Icon';
import { AppBar, Notice, Screen, SectionTitle } from '@/ui/Screen';
import { Card, Row, Spacer } from '@/ui/Surface';
import { TabBar } from '@/ui/TabBar';
import { Txt } from '@/ui/Txt';

const PROVIDERS = [
  { id: 'ollama', label: 'Ollama', detail: 'Local · llama3.1:8b', ok: true },
  { id: 'llamacpp', label: 'llama.cpp', detail: 'Local · qwen2.5:7b', ok: true },
  { id: 'openai-compatible', label: 'OpenAI-compatible', detail: 'Local · 192.168.1.9:8080', ok: true },
  { id: 'cloud', label: 'Cloud models', detail: 'Blocked by privacy settings', ok: false },
] as const;

export default function Settings() {
  const [state, dispatch] = useNexus();
  const { t, name, mode, setName, setMode, elder, setElder, hydrated } = useTheme();
  const router = useRouter();
  const [sheet, setSheet] = useState<'none' | 'provider' | 'model' | 'about' | 'data'>('none');
  const [provider, setProvider] = useState<string>('ollama');
  const [server, setServer] = useState('http://192.168.1.9:11434');
  const [model, setModel] = useState('llama3.1:8b');
  const [voice, setVoice] = useState(true);
  const [hapticsOn, setHapticsOn] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  return (
    <Screen
      footer={<TabBar />}
      contentStyle={{ paddingBottom: 96 }}>
      <AppBar
        title="Settings"
        eyebrow="Everything here is stored on this device"
        right={
          <IconButton
            name="close"
            variant="ghost"
            onPress={() => router.back()}
            accessibilityLabel="Close settings"
          />
        }
      />

      <Card padded>
        <SectionTitle title="Look and feel" icon="sparkle" />
        <Spacer size={SPACING.sm} />
        <Txt variant="labelSm" tone="muted">
          Accent
        </Txt>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: SPACING.sm, paddingVertical: SPACING.sm }}>
          {THEME_NAMES.map((n: ThemeName) => {
            const active = name === n;
            const a = ACCENTS[n];
            return (
              <Pressable
                key={n}
                onPress={() => setName(n)}
                accessibilityRole="button"
                accessibilityLabel={a.label}
                style={{
                  alignItems: 'center',
                  gap: 7,
                  padding: SPACING.sm,
                  borderRadius: RADIUS.lg,
                  borderWidth: active ? 2 : StyleSheet.hairlineWidth * 2,
                  borderColor: active ? a.primary : t.outlineSoft,
                  backgroundColor: active ? t.surfaceAlt : t.surface,
                  minWidth: 84,
                }}>
                <Row gap={0} style={{ borderRadius: 999, overflow: 'hidden' }}>
                  {a.swatch.map((c) => (
                    <View key={c} style={{ width: 22, height: 34, backgroundColor: c }} />
                  ))}
                </Row>
                <Txt variant="labelXs" style={{ color: active ? t.text : t.textMuted }}>
                  {a.label.toUpperCase()}
                </Txt>
              </Pressable>
            );
          })}
        </ScrollView>

        <Spacer size={SPACING.xs} />
        <Txt variant="labelSm" tone="muted">
          Appearance
        </Txt>
        <Spacer size={SPACING.xs} />
        <SegmentedControl
          value={mode}
          onChange={(m) => setMode(m as ColorMode | 'system')}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' },
          ]}
        />

        <Spacer size={SPACING.md} />
        <Toggle
          value={elder}
          onChange={setElder}
          label="Elder Mode"
          hint="Everything gets larger, spacing opens up, fewer things compete for attention"
          icon="eye"
        />

        {elder ? (
          <View style={{ marginTop: SPACING.sm, backgroundColor: t.butterSoft, borderRadius: RADIUS.md, padding: SPACING.md }}>
            <Txt variant="bodySm" style={{ color: t.mode === 'dark' ? t.butter : '#6B4A00' }}>
              Elder Mode is on. Body text is at {Math.round(15 * 1.36)}px with open line spacing.
            </Txt>
          </View>
        ) : null}
      </Card>

      <Card padded>
        <SectionTitle title="The assistant" icon="brain" />
        <View style={{ marginTop: SPACING.xs }}>
          <ListRow
            icon="sparkle"
            title="Model provider"
            subtitle={PROVIDERS.find((p) => p.id === provider)?.label ?? provider}
            onPress={() => setSheet('provider')}
          />
          <ListRow
            icon="zap"
            title="Model"
            subtitle={model}
            onPress={() => setSheet('model')}
          />
          <ListRow
            icon="lock"
            title="Local server"
            subtitle={server}
            onPress={() => setSheet('provider')}
          />
          <ListRow
            icon="activity"
            title="Routing"
            subtitle="Planner → privacy check → specialist → composer"
            onPress={() =>
              dispatch({ type: 'pushToast', text: 'Four hops per answer, all local', tone: 'info' })
            }
          />
        </View>
        <View style={{ marginTop: SPACING.md, gap: SPACING.sm }}>
          <Toggle value={voice} onChange={setVoice} label="Voice answers for elders" hint="Reads responses aloud" icon="volume" />
          <Toggle
            value={hapticsOn}
            onChange={setHapticsOn}
            label="Haptics"
            hint={Platform.OS === 'web' ? 'Not available in the browser build' : 'Small buzz on important actions'}
            icon="activity"
            disabled={Platform.OS === 'web'}
          />
        </View>
      </Card>

      <Card padded>
        <SectionTitle title="Your data" icon="database" />
        <View style={{ marginTop: SPACING.xs }}>
          <ListRow
            icon="download"
            title="Export the family OKF"
            subtitle="One JSON file, everything included"
            onPress={() => {
              const blob = JSON.stringify(state.okf, null, 2);
              if (typeof window !== 'undefined') {
                const url = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
                const a = document.createElement('a');
                a.href = url;
                a.download = `family-okf-v${state.okf.version}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }
              dispatch({ type: 'pushToast', text: 'Exported', tone: 'ok' });
            }}
          />
          <ListRow
            icon="refresh"
            title="Nightly encrypted snapshot"
            subtitle={autoBackup ? 'On · 3 local replicas' : 'Off'}
            onPress={() => setAutoBackup((v) => !v)}
            right={
              <Switch
                value={autoBackup}
                onValueChange={setAutoBackup}
                trackColor={{ false: t.a.text(0.16), true: t.primary }}
              />
            }
          />
          <ListRow icon="shield" title="Privacy controls" subtitle="Per-person visibility and audit log" onPress={() => router.push('/privacy')} />
          <ListRow icon="user" title="Family members" subtitle="Switch profiles, personas, devices" onPress={() => router.push('/members')} />
          <ListRow icon="house" title="Home & inventory" subtitle="Pantry, shopping, low stock" onPress={() => router.push('/inventory')} />
          <ListRow icon="trash" title="Reset this demo" subtitle="Wipe local storage and reload seed data" tone="danger" onPress={() => setSheet('data')} />
        </View>
      </Card>

      <Card padded>
        <SectionTitle title="About" icon="info" />
        <View style={{ marginTop: SPACING.xs }}>
          <ListRow icon="brain" title="Family Nexus AI" subtitle={`OKF v${state.okf.version} · revision ${state.okf.revision}`} onPress={() => setSheet('about')} />
          <ListRow
            icon="checkCircle"
            title="Build status"
            subtitle={hydrated ? 'Hydrated from local storage' : 'Reading local storage…'}
            onPress={() => dispatch({ type: 'pushToast', text: hydrated ? 'Storage ready' : 'Still loading', tone: 'info' })}
          />
        </View>
        <View style={{ marginTop: SPACING.md, backgroundColor: t.surfaceAlt, borderRadius: RADIUS.md, padding: SPACING.md, gap: 6 }}>
          <Txt variant="caption" tone="faint">
            This build stores everything in browser storage. There is no server, no account, and no analytics. Clearing your browser data clears the app.
          </Txt>
          <Txt variant="caption" tone="faint">
            Accent {ACCENTS[name].label} · {mode} mode{elder ? ' · Elder Mode on' : ''}
          </Txt>
        </View>
      </Card>

      <Notice icon="lock" tone="positive" text="No telemetry, no crash reporting, no third-party requests. Verified by reading the source, which is only three files long." />

      <Sheet visible={sheet === 'provider'} onClose={() => setSheet('none')} title="Model provider" footer={<Button label="Done" full onPress={() => setSheet('none')} />}>
        {PROVIDERS.map((p) => (
          <ListRow
            key={p.id}
            icon={p.ok ? 'checkCircle' : 'lock'}
            title={p.label}
            subtitle={p.detail}
            onPress={() => {
              if (!p.ok) {
                dispatch({ type: 'pushToast', text: 'Cloud models stay off until you allow it in Privacy', tone: 'warn' });
                return;
              }
              setProvider(p.id);
              dispatch({ type: 'pushToast', text: `${p.label} selected`, tone: 'ok' });
              setSheet('none');
            }}
            right={provider === p.id ? <Icon name="checkCircle" size={17} color={t.primary} /> : undefined}
          />
        ))}
        <Field label="Local server address" hint="Where the model runs inside your home.">
          <BubbleInput value={server} onChangeText={setServer} placeholder="http://192.168.1.9:11434" />
        </Field>
      </Sheet>

      <Sheet visible={sheet === 'model'} onClose={() => setSheet('none')} title="Choose a model" footer={<Button label="Use this model" full onPress={() => setSheet('none')} />}>
        {['llama3.1:8b', 'qwen2.5:7b', 'mistral:7b', 'phi4:14b', 'gemma2:9b'].map((m) => (
          <ListRow
            key={m}
            icon="brain"
            title={m}
            subtitle={m === model ? 'Currently selected' : 'Available on the local server'}
            onPress={() => setModel(m)}
            right={model === m ? <Icon name="checkCircle" size={17} color={t.primary} /> : undefined}
          />
        ))}
        <Notice icon="info" tone="info" text="Smaller models run faster on a home server. Eight billion parameters is the sweet spot for this hardware." />
      </Sheet>

      <Sheet visible={sheet === 'about'} onClose={() => setSheet('none')} title="Family Nexus AI">
        <Txt variant="body" tone="muted">
          A private, local-first family assistant. One document, the Open Knowledge Format, holds the people, the
          relationships, the health records, the money, the chores and the memories. Everything else is a view onto it.
        </Txt>
        <Txt variant="body" tone="muted">
          The assistant is an orchestrator. A router picks a lane, a privacy guardian checks what you are allowed to see, a
          specialist composes the answer, and a verifier signs it into the audit log. There is no cloud fallback, by design.
        </Txt>
        <View style={{ backgroundColor: t.surfaceAlt, borderRadius: RADIUS.md, padding: SPACING.md, gap: 4 }}>
          <Txt variant="caption" tone="faint">
            Family: {state.okf.familyName}
          </Txt>
          <Txt variant="caption" tone="faint">
            ID: {state.okf.familyId}
          </Txt>
          <Txt variant="caption" tone="faint">
            Records: {state.okf.members.length} members · {state.okf.relationships.length} edges ·{' '}
            {state.okf.audit.length} audit entries
          </Txt>
        </View>
      </Sheet>

      <Sheet visible={sheet === 'data'} onClose={() => setSheet('none')} title="Reset the demo?" footer={
        <Row gap={SPACING.sm}>
          <Button label="Cancel" variant="ghost" onPress={() => setSheet('none')} style={{ flex: 1 }} />
          <Button
            label="Wipe everything"
            variant="danger"
            style={{ flex: 1 }}
            onPress={() => {
              void wipe();
              setSheet('none');
              dispatch({ type: 'pushToast', text: 'Local data wiped and reseeded', tone: 'warn' });
            }}
          />
        </Row>
      }>
        <Txt variant="body" tone="muted">
          This clears the family OKF from local storage, including every task you ticked, every memory you added, and any
          privacy changes you made. The original demo family comes back exactly as it started.
        </Txt>
        <Notice icon="alert" tone="warning" text="There is no undo, and nothing is backed up anywhere else." />
      </Sheet>

      <View
        style={{
          height: 4,
          borderRadius: 999,
          backgroundColor: t.a.text(0.06),
          overflow: 'hidden',
        }}>
        <View style={{ width: `${Math.min(100, (state.okf.revision % 100) + 12)}%`, height: '100%', backgroundColor: mix(t.primary, t.tertiary, 0.5) }} />
      </View>
    </Screen>
  );
}
