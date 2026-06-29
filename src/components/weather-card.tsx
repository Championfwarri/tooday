import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { WeatherData } from '@/utils/weather';

interface WeatherCardProps {
  cityName: string;
  weather: WeatherData | null;
}

export function WeatherCard({ cityName, weather }: WeatherCardProps) {
  if (!weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.city}>{cityName}</Text>
        <Text style={styles.loading}>...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{weather.icon}</Text>
      <View style={styles.info}>
        <Text style={styles.city}>{cityName}</Text>
        <Text style={styles.temp}>{weather.temperature}°C</Text>
      </View>
      <Text style={styles.desc}>{weather.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    alignItems: 'center',
  },
  city: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  temp: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  desc: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  loading: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
});
