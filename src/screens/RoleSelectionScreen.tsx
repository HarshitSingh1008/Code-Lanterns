import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store';
import { roleThemes, Role } from '../theme/roleVariants';
import { RoleButton } from '../components/RoleButton';
import { Icon } from '../components/Icon';

const { width } = Dimensions.get('window');

const roles: { role: Role; icon: string; label: string; desc: string }[] = [
  { role: 'parent', icon: 'family', label: 'Parent', desc: 'Organize & manage' },
  { role: 'child', icon: 'baby', label: 'Child', desc: 'Fun & rewards' },
  { role: 'elder', icon: 'elder', label: 'Elder', desc: 'Simple & clear' },
  { role: 'guardian', icon: 'shield', label: 'Guardian', desc: 'Oversight' },
  { role: 'guest', icon: 'guest', label: 'Guest', desc: 'Welcome!' },
];

export function RoleSelectionScreen() {
  const setRole = useAppStore((s) => s.setRole);
  const familyMembers = useAppStore((s) => s.familyMembers);
  const isDark = useAppStore((s) => s.isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleRoleSelect = (role: Role) => {
    const member = familyMembers.find((m) => m.role === role);
    if (member) setRole(role, member.id);
  };

  const theme = roleThemes.parent;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={[styles.logoContainer, { backgroundColor: theme.primaryContainer, borderRadius: 28 }]}>
          <Icon name="home" size={36} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.onSurface }]}>Family Hub</Text>
        <Text style={[styles.subtitle, { color: theme.onSurfaceVariant }]}>Choose your role to get started</Text>
      </Animated.View>

      <Animated.View style={[styles.rolesContainer, { opacity: fadeAnim }]}>
        {roles.map((item, index) => {
          const roleTheme = roleThemes[item.role];
          return (
            <Animated.View
              key={item.role}
              style={{
                opacity: fadeAnim,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 30 + index * 10],
                  }),
                }],
              }}
            >
              <RoleButton
                label={item.label}
                theme={roleTheme}
                icon={item.icon}
                onPress={() => handleRoleSelect(item.role)}
                style={styles.roleButton}
              />
              <Text style={[styles.roleDesc, { color: roleTheme.onSurfaceVariant }]}>{item.desc}</Text>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  hero: { alignItems: 'center', paddingTop: 70, paddingBottom: 32 },
  logoContainer: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, marginTop: 6 },
  rolesContainer: { flex: 1, paddingBottom: 32 },
  roleButton: { width: '100%', marginBottom: 4 },
  roleDesc: { fontSize: 12, textAlign: 'center', marginBottom: 20 },
});
