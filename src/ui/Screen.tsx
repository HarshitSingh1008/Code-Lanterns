import { type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { LAYOUT, RADIUS, SPACING } from '@/theme/tokens';
import { Backdrop } from './Backdrop';
import { IconButton } from './Button';
import { Icon, type IconName } from './Icon';
import { Row } from './Surface';
import { Txt } from './Txt';

export function Screen({
  children,
  scroll = true,
  contentStyle,
  bottomInset = 0,
  backdrop = 'default',
  footer,
}: {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  bottomInset?: number;
  backdrop?: 'default' | 'calm' | 'none';
  footer?: ReactNode;
}) {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();

  const body = (
    <View style={[styles.body, { paddingBottom: bottomInset + insets.bottom + SPACING.lg }, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: t.canvas }]}>
      <StatusBar barStyle={t.isDark ? 'light-content' : 'dark-content'} />
      {backdrop !== 'none' ? <Backdrop variant={backdrop === 'calm' ? 'calm' : 'default'} /> : null}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {body}
        </ScrollView>
      ) : (
        body
      )}
      {footer}
    </View>
  );
}

export function AppBar({
  title,
  eyebrow,
  onBack,
  right,
  center,
}: {
  title: string;
  eyebrow?: string;
  onBack?: () => void;
  right?: ReactNode;
  center?: ReactNode;
}) {
  return (
    <View style={styles.appBar}>
      <Row gap={SPACING.sm} style={{ flex: 1 }}>
        {onBack ? <IconButton name="chevronLeft" variant="ghost" onPress={onBack} accessibilityLabel="Go back" /> : null}
        <View style={{ flex: 1 }}>
          {eyebrow ? (
            <Txt variant="caption" tone="muted" numberOfLines={1}>
              {eyebrow}
            </Txt>
          ) : null}
          <Txt variant="headline" numberOfLines={1}>
            {title}
          </Txt>
        </View>
      </Row>
      {center}
      {right ? <Row gap={SPACING.xs}>{right}</Row> : null}
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
  icon,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  icon?: IconName;
}) {
  const { t } = useTheme();
  return (
    <Row style={styles.section} gap={SPACING.xs}>
      {icon ? <Icon name={icon} size={17} color={t.textFaint} /> : null}
      <Txt variant="title" style={{ flex: 1 }}>
        {title}
      </Txt>
      {action ? (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={10}>
          {({ pressed }) => (
            <Txt variant="labelSm" style={{ color: t.primary, opacity: pressed ? 0.6 : 1 }}>
              {action}
            </Txt>
          )}
        </Pressable>
      ) : null}
    </Row>
  );
}

export function EmptyState({
  icon = 'sparkle',
  title,
  body,
  children,
}: {
  icon?: IconName;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  const { t } = useTheme();
  return (
    <View
      style={[
        styles.empty,
        { backgroundColor: t.surfaceAlt, borderColor: t.outlineSoft },
      ]}>
      <View
        style={{
          width: 58,
          height: 58,
          borderRadius: RADIUS.pill,
          backgroundColor: t.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={icon} size={26} color={t.primary} />
      </View>
      <Txt variant="title" center style={{ marginTop: SPACING.md }}>
        {title}
      </Txt>
      {body ? (
        <Txt variant="bodySm" tone="muted" center style={{ marginTop: 6, maxWidth: 300 }}>
          {body}
        </Txt>
      ) : null}
      {children ? <View style={{ marginTop: SPACING.md }}>{children}</View> : null}
    </View>
  );
}

/** Pill-shaped info strip used for privacy notices, sync state, tips. */
export function Notice({
  icon = 'lock',
  text,
  tone = 'info',
}: {
  icon?: IconName;
  text: string;
  tone?: 'info' | 'positive' | 'warning' | 'danger' | 'primary';
}) {
  const { t } = useTheme();
  const c = tone === 'primary' ? { fg: t.primary, bg: t.primarySoft } : t.tone[tone];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        backgroundColor: c.bg,
        borderRadius: RADIUS.pill,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
      }}>
      <Icon name={icon} size={15} color={c.fg} />
      <Txt variant="caption" style={{ color: c.fg, flex: 1 }}>
        {text}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, ...(Platform.OS === 'web' ? { overflow: 'hidden' as const } : null) },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: LAYOUT.maxContentWidth,
    alignSelf: 'center',
  },
  body: {
    paddingHorizontal: SPACING.gutter,
    paddingTop: SPACING.sm,
    gap: SPACING.md,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    minHeight: LAYOUT.appBarHeight,
    paddingVertical: SPACING.xs,
  },
  section: {
    marginTop: SPACING.sm,
    marginBottom: -SPACING.xxs,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
});
