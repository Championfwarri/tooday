import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
        tabBarStyle: {
          backgroundColor: '#0A0E1A',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 0.5,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: t('tabs.today') }}
      />
      <Tabs.Screen
        name="us"
        options={{ title: t('tabs.us') }}
      />
      <Tabs.Screen
        name="story"
        options={{ title: t('tabs.story') }}
      />
    </Tabs>
  );
}
