import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { useNexusHydration } from '@/data/useNexus';

function Root() {
  const { t } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.canvas }}>
      <StatusBar style={t.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.canvas },
          animation: 'fade',
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="tasks" />
        <Stack.Screen name="health" />
        <Stack.Screen name="finance" />
        <Stack.Screen name="home" />
        <Stack.Screen name="inventory" />
        <Stack.Screen name="memories" />
        <Stack.Screen name="graph" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="members" />
        <Stack.Screen name="settings" />
      </Stack>
    </View>
  );
}

export default function Layout() {
  useNexusHydration();
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
