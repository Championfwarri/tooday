import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface PremiumGateProps {
  children: React.ReactNode;
  isLocked: boolean;
  onUpgrade?: () => void;
}

export function PremiumGate({ children, isLocked, onUpgrade }: PremiumGateProps) {
  const { t } = useTranslation();

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔒</Text>
      <Text style={styles.title}>TooDay+</Text>
      <Text style={styles.description}>{t('us.premiumRequired')}</Text>
      {onUpgrade && (
        <TouchableOpacity style={styles.button} onPress={onUpgrade}>
          <Text style={styles.buttonText}>{t('onboarding.startTrial')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.accent,
  },
  description: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.dark.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
});
