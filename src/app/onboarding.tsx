import { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Profile, defaultProfile, saveProfile, markOnboardingDone } from '@/store/profile';
import { startTrial } from '@/store/subscription';

const { width, height } = Dimensions.get('window');

type Step = 'intro' | 'names' | 'since' | 'frequency' | 'priority' | 'cities' | 'reunion' | 'pairing' | 'notifications' | 'trial';
const STEPS: Step[] = ['intro', 'names', 'since', 'frequency', 'priority', 'cities', 'reunion', 'pairing', 'notifications', 'trial'];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const step = STEPS[stepIdx];

  const updateProfile = (partial: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const animateNext = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1)), 150);
  };

  const finish = async (withTrial: boolean) => {
    await saveProfile(profile);
    if (withTrial) await startTrial();
    await markOnboardingDone();
    router.replace('/(tabs)' as never);
  };

  return (
    <LinearGradient colors={['#0A0E1A', '#1A1040', '#0F172A']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Progress dots */}
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === stepIdx && styles.dotActive, i < stepIdx && styles.dotDone]} />
          ))}
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {step === 'intro' && (
            <View style={styles.introContainer}>
              <Text style={styles.appName}>TooDay</Text>
              <Text style={styles.introText}>{t('onboarding.intro')}</Text>
              <View style={styles.introGlow} />
            </View>
          )}

          {step === 'names' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('onboarding.yourName')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={t('onboarding.yourName')}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={profile.userName}
                  onChangeText={(v) => updateProfile({ userName: v })}
                  autoFocus
                />
              </View>
              <Text style={[styles.stepTitle, { marginTop: 24 }]}>{t('onboarding.partnerName')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={t('onboarding.partnerName')}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={profile.partnerName}
                  onChangeText={(v) => updateProfile({ partnerName: v })}
                />
              </View>
            </View>
          )}

          {step === 'since' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('onboarding.togetherSince')}</Text>
              <Text style={styles.stepHint}>YYYY-MM-DD</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="2024-01-15"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={profile.togetherSince}
                  onChangeText={(v) => updateProfile({ togetherSince: v })}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>
          )}

          {step === 'frequency' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('onboarding.visitFrequency')}</Text>
              <View style={styles.optionsGrid}>
                {(['weekly', 'biweekly', 'monthly', 'rarely'] as const).map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[styles.pill, profile.visitFrequency === freq && styles.pillActive]}
                    onPress={() => updateProfile({ visitFrequency: freq })}>
                    <Text style={[styles.pillText, profile.visitFrequency === freq && styles.pillTextActive]}>
                      {t(`onboarding.frequencyOptions.${freq}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 'priority' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('onboarding.priority')}</Text>
              <View style={styles.optionsGrid}>
                {(['stayClose', 'communicate', 'countDays'] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.pill, profile.priority === p && styles.pillActive]}
                    onPress={() => updateProfile({ priority: p })}>
                    <Text style={[styles.pillText, profile.priority === p && styles.pillTextActive]}>
                      {t(`onboarding.priorityOptions.${p}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 'cities' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('onboarding.yourCity')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Paris"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={profile.userCity}
                  onChangeText={(v) => updateProfile({ userCity: v })}
                />
              </View>
              <Text style={[styles.stepTitle, { marginTop: 24 }]}>{t('onboarding.partnerCity')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Montreal"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={profile.partnerCity}
                  onChangeText={(v) => updateProfile({ partnerCity: v })}
                />
              </View>
            </View>
          )}

          {step === 'reunion' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('onboarding.reunionDate')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="2026-08-15"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={profile.reunionDate ?? ''}
                  onChangeText={(v) => updateProfile({ reunionDate: v || null })}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <TouchableOpacity style={styles.linkBtn} onPress={() => { updateProfile({ reunionDate: null }); animateNext(); }}>
                <Text style={styles.linkText}>{t('onboarding.noDateYet')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'pairing' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('onboarding.pairDevices')}</Text>
              <Text style={styles.stepSubtitle}>{t('us.capsule')} · {t('us.ourList')} · {t('us.ourMoment')}</Text>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => { updateProfile({ pairedCode: null }); animateNext(); }}>
                <Text style={styles.secondaryBtnText}>{t('onboarding.setupSolo')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'notifications' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('onboarding.notifications', { name: profile.partnerName || '...' })}</Text>
              <Text style={styles.stepSubtitle}>{t('onboarding.notifSubtitle', { name: profile.partnerName || '...' })}</Text>
            </View>
          )}

          {step === 'trial' && (
            <View style={styles.stepContent}>
              <View style={styles.trialBadge}>
                <Text style={styles.trialBadgeText}>7</Text>
                <Text style={styles.trialBadgeDays}>days</Text>
              </View>
              <Text style={styles.trialTitle}>{t('onboarding.trialTitle')}</Text>
              <Text style={styles.stepSubtitle}>{t('onboarding.trialSubtitle')}</Text>
            </View>
          )}
        </Animated.View>

        {/* Bottom actions */}
        <View style={styles.bottomActions}>
          {step === 'trial' ? (
            <>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => finish(true)}>
                <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.btnGradient}>
                  <Text style={styles.primaryBtnText}>{t('onboarding.startTrial')}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.skipBtn} onPress={() => finish(false)}>
                <Text style={styles.skipText}>{t('onboarding.skipTrial')}</Text>
              </TouchableOpacity>
            </>
          ) : step === 'notifications' ? (
            <>
              <TouchableOpacity style={styles.primaryBtn} onPress={animateNext}>
                <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.btnGradient}>
                  <Text style={styles.primaryBtnText}>{t('onboarding.allowNotif')}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.skipBtn} onPress={animateNext}>
                <Text style={styles.skipText}>{t('onboarding.skipNotif')}</Text>
              </TouchableOpacity>
            </>
          ) : step !== 'reunion' && step !== 'pairing' ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={animateNext}>
              <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.btnGradient}>
                <Text style={styles.primaryBtnText}>
                  {step === 'intro' ? t('onboarding.done') : t('onboarding.next')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : step === 'reunion' ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={animateNext}>
              <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.btnGradient}>
                <Text style={styles.primaryBtnText}>{t('onboarding.next')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#F59E0B',
  },
  dotDone: {
    backgroundColor: 'rgba(245,158,11,0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  introContainer: {
    alignItems: 'center',
    gap: 20,
  },
  appName: {
    fontSize: 52,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: -1,
  },
  introText: {
    fontSize: 22,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 32,
    maxWidth: 280,
  },
  introGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(245,158,11,0.08)',
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
  },
  stepContent: {
    gap: 16,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 34,
  },
  stepHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginTop: -8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
  },
  inputWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 17,
    color: '#FFFFFF',
  },
  optionsGrid: {
    gap: 10,
    marginTop: 8,
  },
  pill: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pillActive: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderColor: '#F59E0B',
  },
  pillText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  pillTextActive: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  bottomActions: {
    gap: 12,
    paddingTop: 16,
  },
  primaryBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0A0E1A',
  },
  secondaryBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  secondaryBtnText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  skipBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.4)',
  },
  linkBtn: {
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 15,
    color: 'rgba(245,158,11,0.8)',
  },
  trialBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  trialBadgeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F59E0B',
  },
  trialBadgeDays: {
    fontSize: 11,
    color: '#F59E0B',
    marginTop: -4,
  },
  trialTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
