import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@tooday_profile';
const ONBOARDING_KEY = '@tooday_onboarding_done';

export type VisitFrequency = 'weekly' | 'biweekly' | 'monthly' | 'rarely';
export type CouplePriority = 'stayClose' | 'communicate' | 'countDays';

export interface Profile {
  userName: string;
  partnerName: string;
  togetherSince: string;
  visitFrequency: VisitFrequency;
  priority: CouplePriority;
  userCity: string;
  partnerCity: string;
  reunionDate: string | null;
  pairedCode: string | null;
  language: 'fr' | 'en' | 'auto';
}

export const defaultProfile: Profile = {
  userName: '',
  partnerName: '',
  togetherSince: '',
  visitFrequency: 'monthly',
  priority: 'stayClose',
  userCity: '',
  partnerCity: '',
  reunionDate: null,
  pairedCode: null,
  language: 'auto',
};

export async function loadProfile(): Promise<Profile | null> {
  const json = await AsyncStorage.getItem(PROFILE_KEY);
  if (!json) return null;
  return JSON.parse(json) as Profile;
}

export async function saveProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function isOnboardingDone(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === 'true';
}

export async function markOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(ONBOARDING_KEY);
}
