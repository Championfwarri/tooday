import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';

import { isOnboardingDone, resetOnboarding } from '@/store/profile';

export default function IndexRedirect() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    // DEV: force onboarding for testing
    resetOnboarding().then(() => {
      setOnboarded(false);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: '#0A0E1A' }} />;
  }

  if (!onboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
