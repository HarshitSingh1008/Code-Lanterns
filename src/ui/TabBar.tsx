import { usePathname, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { LAYOUT, RADIUS, SPACING } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

const TABS: { route: string; label: string; icon: IconName }[] = [
  { route: '/home', label: 'Home', icon: 'house' },
  { route: '/tasks', label: 'Tasks', icon: 'checkCircle' },
  { route: '/chat', label: 'Ask', icon: 'sparkle' },
  { route: '/memories', label: 'Memories', icon: 'photo' },
  { route: '/graph', label: 'Family', icon: 'graph' },
];

export function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingBottom: Math.max(insets.bottom, 10),
          backgroundColor: t.surfaceRaised,
          borderColor: t.outlineSoft,
        },
      ]}>
      <View style={styles.row}>
        {TABS.map((tab) => {
          const active = pathname === tab.route;
          const isAsk = tab.route === '/chat';
          return (
            <Pressable
              key={tab.route}
              onPress={() => router.push(tab.route as never)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
              style={styles.item}>
              <View
                style={[
                  styles.iconWrap,
                  active && { backgroundColor: isAsk ? t.primary : t.primarySoft },
                  isAsk && styles.ask,
                ]}>
                <Icon
                  name={tab.icon}
                  size={isAsk ? 21 : 19}
                  color={active ? (isAsk ? t.onPrimary : t.primary) : t.textFaint}
                />
                {tab.route === '/tasks' ? <View style={[styles.dot, { backgroundColor: t.tertiary }]} /> : null}
              </View>
              <Txt
                variant="labelXs"
                numberOfLines={1}
                style={{ color: active ? t.primary : t.textFaint, letterSpacing: 0 }}>
                {tab.label}
              </Txt>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    paddingTop: SPACING.xs,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: LAYOUT.maxContentWidth,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  iconWrap: {
    width: 42,
    height: 30,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as never } : null),
  },
  ask: {
    marginTop: -14,
    width: 52,
    height: 52,
  },
  dot: {
    position: 'absolute',
    top: 4,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: RADIUS.pill,
  },
});
