import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIAL_START_KEY = '@tooday_trial_start';
const SUBSCRIPTION_KEY = '@tooday_subscription';

export type SubscriptionStatus = 'trial' | 'premium' | 'free';

const TRIAL_DAYS = 7;

export interface SubscriptionState {
  status: SubscriptionStatus;
  trialStartDate: string | null;
  trialDaysLeft: number;
}

export async function getSubscriptionState(): Promise<SubscriptionState> {
  const subStatus = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
  if (subStatus === 'premium') {
    return { status: 'premium', trialStartDate: null, trialDaysLeft: 0 };
  }

  const trialStart = await AsyncStorage.getItem(TRIAL_START_KEY);
  if (!trialStart) {
    return { status: 'free', trialStartDate: null, trialDaysLeft: 0 };
  }

  const startDate = new Date(trialStart);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, TRIAL_DAYS - diffDays);

  if (daysLeft > 0) {
    return { status: 'trial', trialStartDate: trialStart, trialDaysLeft: daysLeft };
  }

  return { status: 'free', trialStartDate: trialStart, trialDaysLeft: 0 };
}

export async function startTrial(): Promise<void> {
  const existing = await AsyncStorage.getItem(TRIAL_START_KEY);
  if (!existing) {
    await AsyncStorage.setItem(TRIAL_START_KEY, new Date().toISOString());
  }
}

export async function activatePremium(): Promise<void> {
  await AsyncStorage.setItem(SUBSCRIPTION_KEY, 'premium');
}

export async function deactivatePremium(): Promise<void> {
  await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
}

export function isPremiumFeature(feature: string): boolean {
  const premiumFeatures = [
    'seePartnerAnswer',
    'questionArchive',
    'unlimitedTimeline',
    'photoDiaporama',
    'capsule',
    'ourList',
    'ourMoment',
    'multipleCountdowns',
    'advancedThemes',
  ];
  return premiumFeatures.includes(feature);
}

export function canAccess(feature: string, status: SubscriptionStatus): boolean {
  if (status === 'premium' || status === 'trial') return true;
  return !isPremiumFeature(feature);
}
