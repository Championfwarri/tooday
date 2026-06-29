import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface CountdownProps {
  daysLeft: number | null;
}

export function Countdown({ daysLeft }: CountdownProps) {
  const { t } = useTranslation();

  if (daysLeft === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDate}>{t('today.noDate')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.number}>{daysLeft}</Text>
      <Text style={styles.label}>
        {t('today.daysLeft', { count: daysLeft })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    marginVertical: Spacing.md,
  },
  number: {
    fontSize: 64,
    fontWeight: '700',
    color: Colors.dark.accent,
  },
  label: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.xs,
  },
  noDate: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    fontStyle: 'italic',
  },
});
