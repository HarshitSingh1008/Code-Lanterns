import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { member } from '@/data/store';
import type { FamilyMember } from '@/data/types';
import { useNexus } from '@/data/useNexus';
import { greeting } from '@/lib/date';
import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Avatar } from '@/ui/Avatar';
import { Button, IconButton } from '@/ui/Button';
import { Icon, type IconName } from '@/ui/Icon';
import { Notice, Screen, SectionTitle } from '@/ui/Screen';
import { accentSlot, Card, FadeIn, Row, StatTile } from '@/ui/Surface';
import { Txt } from '@/ui/Txt';

const ROLE_HINT: Record<FamilyMember['role'], { label: string; blurb: string; icon: IconName }> = {
  parent: { label: 'Parent view', blurb: 'Everything, with privacy controls', icon: 'shield' },
  child: { label: 'Kid view', blurb: 'Chores, points and simple answers', icon: 'star' },
  elder: { label: 'Nana view', blurb: 'Big text, voice and fewer choices', icon: 'heart' },
  guardian: { label: 'Guardian view', blurb: 'Health and school, nothing private', icon: 'lock' },
  guest: { label: 'Guest view', blurb: 'A single shared chore list', icon: 'eye' },
};

export default function RoleSelect() {
  const [state, dispatch] = useNexus();
  const { t, elder, setElder } = useTheme();
  const router = useRouter();
  const { okf, memberId } = state;

  useEffect(() => {
    dispatch({ type: 'setTab', tab: 'index' });
  }, [dispatch]);

  const active = member(okf, memberId);
  const openTasks = okf.tasks.filter((x) => !x.done).length;

  return (
    <Screen contentStyle={{ paddingBottom: SPACING.xl }}>
      <Row style={{ justifyContent: 'flex-end' }}>
        <IconButton name="sliders" variant="ghost" onPress={() => router.push('/settings')} accessibilityLabel="Settings" />
      </Row>

      <FadeIn>
        <Row gap={SPACING.sm}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: RADIUS.pill,
              backgroundColor: t.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="sparkle" size={26} color={t.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt variant="displaySm">Family Nexus</Txt>
            <Txt variant="bodySm" tone="muted">
              {greeting()}, {active.name.split(' ')[0]}. {okf.familyName}, running on your own hardware.
            </Txt>
          </View>
        </Row>
      </FadeIn>

      <Row gap={SPACING.md} wrap={false}>
        <StatTile value={`${okf.members.length}`} label="People" icon="user" tone="primary" />
        <StatTile value={`${openTasks}`} label="Open tasks" icon="checkCircle" tone="tertiary" />
        <StatTile value={`${okf.memories.length}`} label="Memories" icon="photo" tone="butter" />
      </Row>

      <FadeIn delay={60}>
        <Card padded>
          <SectionTitle title="Who is using the app?" icon="user" />
          <Txt variant="bodySm" tone="muted" style={{ marginTop: 2 }}>
            Pick a profile. The whole interface, the assistant’s tone and what it is allowed to tell you all change.
          </Txt>
          <View style={{ marginTop: SPACING.md, gap: SPACING.sm }}>
            {okf.members.map((m) => {
              const isActive = m.memberId === memberId;
              const { fg } = accentSlot(t, m.accent);
              const hint = ROLE_HINT[m.role];
              return (
                <Pressable
                  key={m.memberId}
                  onPress={() => {
                    dispatch({ type: 'setMember', memberId: m.memberId });
                    if (m.role === 'elder' && !elder) setElder(true);
                    if (m.role !== 'elder' && elder && m.role !== 'guardian') setElder(false);
                    router.push('/home');
                  }}
                  style={({ pressed }) => [
                    styles.person,
                    {
                      borderColor: isActive ? fg : t.outlineSoft,
                      backgroundColor: isActive ? t.surfaceAlt : t.surface,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}>
                  <Avatar name={m.name} accent={m.accent} size={46} online={m.online} />
                  <View style={{ flex: 1 }}>
                    <Row gap={6}>
                      <Txt variant="label">{m.name}</Txt>
                      {m.online ? <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: fg }} /> : null}
                    </Row>
                    <Row gap={5} style={{ marginTop: 3 }}>
                      <Icon name={hint.icon} size={11} color={t.textFaint} />
                      <Txt variant="caption" tone="faint" numberOfLines={1}>
                        {hint.label} · {hint.blurb}
                      </Txt>
                    </Row>
                  </View>
                  {isActive ? <Icon name="checkCircle" size={19} color={fg} /> : <Icon name="chevronRight" size={16} color={t.textFaint} />}
                </Pressable>
              );
            })}
          </View>
        </Card>
      </FadeIn>

      <FadeIn delay={120}>
        <Card padded>
          <SectionTitle title="Jump straight in" icon="zap" />
          <View style={{ marginTop: SPACING.sm, gap: SPACING.sm }}>
            {[
              { label: 'Ask the assistant', icon: 'sparkle' as IconName, route: '/chat' },
              { label: 'Tasks & calendar', icon: 'checkCircle' as IconName, route: '/tasks' },
              { label: 'Memories', icon: 'photo' as IconName, route: '/memories' },
              { label: 'Family graph', icon: 'graph' as IconName, route: '/graph' },
              { label: 'Privacy & audit', icon: 'shield' as IconName, route: '/privacy' },
            ].map((q) => (
              <Button
                key={q.route}
                label={q.label}
                icon={q.icon}
                variant="tonal"
                full
                onPress={() => router.push(q.route as never)}
              />
            ))}
          </View>
        </Card>
      </FadeIn>

      <FadeIn delay={180}>
        <Notice
          icon="lock"
          tone="positive"
          text={`OKF v${okf.version} · revision ${okf.revision} · ${okf.audit.length} audited actions. Nothing has left this device.`}
        />
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
});
