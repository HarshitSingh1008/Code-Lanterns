import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/store';
import { RoleSelectionScreen } from './src/screens/RoleSelectionScreen';
import { ParentDashboard } from './src/screens/parent/ParentDashboard';
import { ChildDashboard } from './src/screens/child/ChildDashboard';
import { ElderDashboard } from './src/screens/elder/ElderDashboard';
import { GuardianDashboard } from './src/screens/guardian/GuardianDashboard';
import { GuestView } from './src/screens/guest/GuestView';

export default function App() {
  const currentRole = useAppStore((s) => s.currentRole);
  const isDark = useAppStore((s) => s.isDark);

  if (!currentRole) {
    return (
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <RoleSelectionScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {currentRole === 'parent' && <ParentDashboard />}
      {currentRole === 'child' && <ChildDashboard />}
      {currentRole === 'elder' && <ElderDashboard />}
      {currentRole === 'guardian' && <GuardianDashboard />}
      {currentRole === 'guest' && <GuestView />}
    </SafeAreaProvider>
  );
}
