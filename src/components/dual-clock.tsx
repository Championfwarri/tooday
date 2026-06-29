import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { isDaytime, formatTime } from '@/utils/time';

interface ClockData {
  name: string;
  hour: number;
}

interface DualClockProps {
  user: ClockData;
  partner: ClockData;
}

function ClockCard({ name, hour }: ClockData) {
  const daytime = isDaytime(hour);
  const bgColor = daytime ? '#1E3A5F' : '#0A1628';
  const skyIcon = daytime ? '☀️' : '🌙';
  const timeStr = formatTime(hour);

  return (
    <View style={[styles.clock, { backgroundColor: bgColor }]}>
      <Text style={styles.skyIcon}>{skyIcon}</Text>
      <Text style={styles.time}>{timeStr}</Text>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

export function DualClock({ user, partner }: DualClockProps) {
  const diff = Math.round(partner.hour - user.hour);
  const diffLabel = diff >= 0 ? `+${diff}h` : `${diff}h`;

  return (
    <View style={styles.container}>
      <View style={styles.clocks}>
        <ClockCard {...user} />
        <ClockCard {...partner} />
      </View>
      {diff !== 0 && (
        <Text style={styles.diff}>{diffLabel}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  clocks: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  clock: {
    flex: 1,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  skyIcon: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  time: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  name: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.xs,
  },
  diff: {
    fontSize: 13,
    color: Colors.dark.accent,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
});
