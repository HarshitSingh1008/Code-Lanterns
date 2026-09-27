import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { RADIUS } from '@/theme/tokens';
import { accentSlot, type Accent } from './Surface';
import { Txt } from './Txt';

export function Avatar({
  name,
  accent = 'primary',
  size = 44,
  ring = true,
  online,
  label,
  style,
}: {
  name: string;
  accent?: Accent;
  size?: number;
  ring?: boolean;
  online?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { t } = useTheme();
  const { fg, bg } = accentSlot(t, accent);
  const initials = initialsOf(name);

  return (
    <View style={[{ width: size }, style]}>
      <View style={{ alignSelf: 'center' }}>
        <View
          style={{
            width: size,
            height: size,
            borderRadius: RADIUS.pill,
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: ring ? 3 : 0,
            borderColor: fg,
          }}>
          <Txt
            variant={size >= 56 ? 'headline' : 'label'}
            style={{ color: fg }}>
            {initials}
          </Txt>
        </View>
        {online !== undefined ? (
          <View
            style={{
              position: 'absolute',
              right: -1,
              bottom: 1,
              width: Math.max(10, size * 0.24),
              height: Math.max(10, size * 0.24),
              borderRadius: RADIUS.pill,
              backgroundColor: online ? t.tone.positive.fg : t.textFaint,
              borderWidth: 2.5,
              borderColor: t.canvas,
            }}
          />
        ) : null}
      </View>
      {label ? (
        <Txt variant="labelSm" tone="muted" center style={{ marginTop: 6 }} numberOfLines={1}>
          {label}
        </Txt>
      ) : null}
    </View>
  );
}

export function AvatarStack({
  people,
  max = 5,
  size = 36,
}: {
  people: { name: string; accent: Accent }[];
  max?: number;
  size?: number;
}) {
  const { t } = useTheme();
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {shown.map((p, i) => (
        <View key={`${p.name}-${i}`} style={{ marginLeft: i === 0 ? 0 : -size * 0.3 }}>
          <View
            style={{
              borderRadius: RADIUS.pill,
              borderWidth: 2.5,
              borderColor: t.surface,
            }}>
            <Avatar name={p.name} accent={p.accent} size={size} ring={false} />
          </View>
        </View>
      ))}
      {extra > 0 ? (
        <View
          style={{
            marginLeft: -size * 0.3,
            width: size,
            height: size,
            borderRadius: RADIUS.pill,
            backgroundColor: t.surfaceAlt,
            borderWidth: 2.5,
            borderColor: t.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Txt variant="labelSm" tone="muted">
            +{extra}
          </Txt>
        </View>
      ) : null}
    </View>
  );
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
