import { type ReactNode } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { LAYOUT, RADIUS, SPACING } from '@/theme/tokens';
import { IconButton, Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Row, softShadow } from './Surface';
import { Txt } from './Txt';

export function Sheet({
  visible,
  onClose,
  title,
  children,
  footer,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.scrimWrap}>
        <Pressable style={[styles.scrim, { backgroundColor: t.onCanvasScrim }]} onPress={onClose} accessibilityLabel="Close" />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: t.surfaceRaised,
              borderColor: t.outline,
              paddingBottom: insets.bottom + SPACING.lg,
              ...softShadow(t, 2),
            },
          ]}>
          <View style={[styles.grabber, { backgroundColor: t.outline }]} />
          <Row style={styles.sheetHead}>
            <Txt variant="headline" style={{ flex: 1 }} numberOfLines={1}>
              {title}
            </Txt>
            <IconButton name="close" variant="ghost" size={38} onPress={onClose} accessibilityLabel="Close" />
          </Row>
          <ScrollView
            style={{ maxHeight: 460 }}
            contentContainerStyle={{ gap: SPACING.md, paddingBottom: SPACING.sm }}
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          {footer ? <View style={{ marginTop: SPACING.md }}>{footer}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

export function Toggle({
  value,
  onChange,
  label,
  hint,
  icon,
  disabled,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
  icon?: IconName;
  disabled?: boolean;
}) {
  const { t } = useTheme();
  return (
    <Row
      align="center"
      gap={SPACING.md}
      style={[styles.toggle, { borderColor: t.outlineSoft, backgroundColor: t.surface }, disabled && { opacity: 0.5 }]}>
      {icon ? (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: RADIUS.pill,
            backgroundColor: value ? t.primarySoft : t.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={icon} size={17} color={value ? t.primary : t.textFaint} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Txt variant="label">{label}</Txt>
        {hint ? (
          <Txt variant="caption" tone="muted" style={{ marginTop: 1 }}>
            {hint}
          </Txt>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: t.a.text(0.16), true: t.primary }}
        thumbColor={Platform.OS === 'android' ? (value ? '#ffffff' : '#f4f4f8') : undefined}
        ios_backgroundColor={t.a.text(0.16)}
      />
    </Row>
  );
}

export function BubbleInput({
  value,
  onChangeText,
  placeholder,
  onSubmit,
  right,
  autoFocus,
  multiline,
}: {
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  right?: ReactNode;
  autoFocus?: boolean;
  multiline?: boolean;
}) {
  const { t, elder } = useTheme();
  return (
    <View
      style={[
        styles.input,
        {
          backgroundColor: t.surface,
          borderColor: t.outline,
          minHeight: elder ? 64 : 54,
        },
      ]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={t.textFaint}
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        multiline={multiline}
        returnKeyType="send"
        blurOnSubmit={!multiline}
        style={{
          flex: 1,
          color: t.text,
          fontFamily: 'NunitoSans_400Regular',
          fontSize: elder ? 19 : 15,
          lineHeight: elder ? 28 : 22,
          paddingVertical: elder ? 16 : 14,
          paddingHorizontal: 0,
          ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null),
        }}
      />
      {right}
    </View>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Txt variant="labelSm" tone="muted">
        {label}
      </Txt>
      {children}
      {hint ? (
        <Txt variant="caption" tone="faint">
          {hint}
        </Txt>
      ) : null}
    </View>
  );
}

/** A full-width tappable settings row. */
export function ListRow({
  icon,
  title,
  subtitle,
  right,
  onPress,
  tone,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onPress?: () => void;
  tone?: 'default' | 'danger';
}) {
  const { t } = useTheme();
  const content = (
    <Row gap={SPACING.md} style={styles.listRow}>
      {icon ? (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: RADIUS.pill,
            backgroundColor: tone === 'danger' ? t.tone.danger.bg : t.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={icon} size={17} color={tone === 'danger' ? t.tone.danger.fg : t.textMuted} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Txt variant="label" style={tone === 'danger' ? { color: t.tone.danger.fg } : undefined}>
          {title}
        </Txt>
        {subtitle ? (
          <Txt variant="caption" tone="muted" style={{ marginTop: 1 }}>
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {right ?? (onPress ? <Icon name="chevronRight" size={16} color={t.textFaint} /> : null)}
    </Row>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      {content}
    </Pressable>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  const { t } = useTheme();
  return (
    <View style={[styles.segment, { backgroundColor: t.surfaceAlt, borderColor: t.outlineSoft }]}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.segmentItem,
              active && { backgroundColor: t.primary },
              pressed && !active && { opacity: 0.6 },
            ]}>
            <Txt variant="labelSm" style={{ color: active ? t.onPrimary : t.textMuted }} numberOfLines={1}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

export function PrimaryAction({ label, icon, onPress }: { label: string; icon?: IconName; onPress: () => void }) {
  return <Button label={label} icon={icon} onPress={onPress} full />;
}

const styles = StyleSheet.create({
  scrimWrap: { flex: 1, justifyContent: 'flex-end' },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    width: '100%',
    maxWidth: LAYOUT.maxContentWidth,
    alignSelf: 'center',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  grabber: {
    width: 42,
    height: 5,
    borderRadius: RADIUS.pill,
    alignSelf: 'center',
    marginBottom: SPACING.sm,
  },
  sheetHead: { marginBottom: SPACING.xs },
  toggle: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  listRow: {
    paddingVertical: SPACING.sm,
    minHeight: 52,
  },
  segment: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: SPACING.xs,
    borderRadius: RADIUS.pill,
  },
});
