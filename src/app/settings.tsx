import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

import { Profile, loadProfile, saveProfile, resetOnboarding } from '@/store/profile';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => { loadProfile().then(setProfile); }, []);

  if (!profile) return <LinearGradient colors={['#0A0E1A', '#0F1B2E']} style={{ flex: 1 }} />;

  const update = (partial: Partial<Profile>) => setProfile((p) => p ? { ...p, ...partial } : p);

  const handleSave = async () => {
    if (!profile) return;
    await saveProfile(profile);
    if (profile.language !== 'auto') {
      i18n.changeLanguage(profile.language);
    }
    router.back();
  };

  return (
    <LinearGradient colors={['#0A0E1A', '#1A1040', '#0F172A']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← {t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <SettingsGroup title={t('settings.profile')}>
          <Field label={t('onboarding.yourName')} value={profile.userName} onChange={(v) => update({ userName: v })} />
          <Field label={t('onboarding.partnerName')} value={profile.partnerName} onChange={(v) => update({ partnerName: v })} />
        </SettingsGroup>

        <SettingsGroup title={t('settings.cities')}>
          <Field label={t('onboarding.yourCity')} value={profile.userCity} onChange={(v) => update({ userCity: v })} />
          <Field label={t('onboarding.partnerCity')} value={profile.partnerCity} onChange={(v) => update({ partnerCity: v })} />
        </SettingsGroup>

        <SettingsGroup title={t('settings.relationship')}>
          <Field label={t('onboarding.togetherSince')} value={profile.togetherSince} onChange={(v) => update({ togetherSince: v })} />
          <Field label={t('onboarding.reunionDate')} value={profile.reunionDate ?? ''} onChange={(v) => update({ reunionDate: v || null })} />
        </SettingsGroup>

        <SettingsGroup title={t('settings.language')}>
          <View style={styles.langRow}>
            {(['auto', 'fr', 'en'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langPill, profile.language === lang && styles.langPillActive]}
                onPress={() => update({ language: lang })}>
                <Text style={[styles.langText, profile.language === lang && styles.langTextActive]}>
                  {lang === 'auto' ? 'Auto' : lang.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SettingsGroup>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.saveBtnGradient}>
            <Text style={styles.saveBtnText}>{t('common.save')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetBtn} onPress={async () => { await resetOnboarding(); router.replace('/onboarding' as never); }}>
          <Text style={styles.resetText}>Reset onboarding (debug)</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupCard}>{children}</View>
    </View>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.fieldInput} value={value} onChangeText={onChange} placeholderTextColor="rgba(255,255,255,0.2)" />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  backText: { color: '#F59E0B', fontSize: 15, fontWeight: '500' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  group: { marginBottom: 24 },
  groupTitle: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  groupCard: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
  field: { paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  fieldLabel: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 },
  fieldInput: { fontSize: 16, color: '#FFFFFF' },
  langRow: { flexDirection: 'row', gap: 8, padding: 14 },
  langPill: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)' },
  langPillActive: { backgroundColor: 'rgba(245,158,11,0.15)', borderWidth: 1, borderColor: '#F59E0B' },
  langText: { fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  langTextActive: { color: '#F59E0B', fontWeight: '600' },
  saveBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  saveBtnGradient: { paddingVertical: 18, alignItems: 'center', borderRadius: 16 },
  saveBtnText: { fontSize: 17, fontWeight: '700', color: '#0A0E1A' },
  resetBtn: { marginTop: 32, alignItems: 'center', paddingVertical: 14 },
  resetText: { fontSize: 13, color: 'rgba(255,255,255,0.25)' },
});
