import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useRouter } from 'expo-router';
import { Profile, loadProfile } from '@/store/profile';
import { getDaysSince, getDaysUntil } from '@/utils/time';

type Tab = 'events' | 'stats';

export default function StoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<Tab>('events');

  useFocusEffect(useCallback(() => { loadProfile().then(setProfile); }, []));

  if (!profile) return <LinearGradient colors={['#0A0E1A', '#0F1B2E']} style={{ flex: 1 }} />;

  const daysTogether = profile.togetherSince ? getDaysSince(profile.togetherSince) : 0;
  const daysUntilReunion = getDaysUntil(profile.reunionDate);

  const events = [];
  if (profile.reunionDate) {
    events.push({ icon: '✈️', label: t('story.nextReunion'), date: profile.reunionDate });
  }
  if (profile.togetherSince) {
    const start = new Date(profile.togetherSince);
    if (!isNaN(start.getTime())) {
      const anniv = new Date(start);
      const now = new Date();
      anniv.setFullYear(now.getFullYear());
      if (anniv < now) anniv.setFullYear(now.getFullYear() + 1);
      events.push({ icon: '💍', label: t('story.anniversary'), date: anniv.toISOString().split('T')[0] });
    }
  }
  events.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <LinearGradient colors={['#0A0E1A', '#0F1B2E', '#0A0E1A']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t('tabs.story')}</Text>
          <TouchableOpacity onPress={() => router.push('/settings' as never)} style={styles.gearBtn}>
            <Text style={styles.gearIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['events', 'stats'] as Tab[]).map((tabId) => (
            <TouchableOpacity
              key={tabId}
              style={[styles.tabPill, tab === tabId && styles.tabPillActive]}
              onPress={() => setTab(tabId)}>
              <Text style={[styles.tabText, tab === tabId && styles.tabTextActive]}>
                {t(`story.${tabId}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'events' && (
          <View style={styles.section}>
            {events.map((evt, i) => (
              <View key={i} style={styles.eventCard}>
                <Text style={styles.eventIcon}>{evt.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventLabel}>{evt.label}</Text>
                  <Text style={styles.eventDate}>{evt.date}</Text>
                </View>
              </View>
            ))}
            {events.length === 0 && (
              <Text style={styles.emptyText}>—</Text>
            )}
          </View>
        )}

        {tab === 'stats' && (
          <View style={styles.section}>
            <View style={styles.statCard}>
              <LinearGradient colors={['rgba(245,158,11,0.1)', 'rgba(245,158,11,0.02)']} style={styles.statGradient}>
                <Text style={styles.statEmoji}>💕</Text>
                <Text style={styles.statValue}>{daysTogether}</Text>
                <Text style={styles.statLabel}>{t('story.togetherFor', { count: daysTogether })}</Text>
              </LinearGradient>
            </View>
            {daysUntilReunion !== null && (
              <View style={styles.statCard}>
                <LinearGradient colors={['rgba(99,102,241,0.1)', 'rgba(99,102,241,0.02)']} style={styles.statGradient}>
                  <Text style={styles.statEmoji}>✈️</Text>
                  <Text style={styles.statValue}>{daysUntilReunion}</Text>
                  <Text style={styles.statLabel}>{t('story.nextReunion')}</Text>
                </LinearGradient>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  gearBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  gearIcon: { fontSize: 20 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  tabPill: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  tabPillActive: { backgroundColor: 'rgba(245,158,11,0.12)', borderColor: '#F59E0B' },
  tabText: { fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  tabTextActive: { color: '#F59E0B', fontWeight: '600' },
  section: { gap: 12 },
  eventCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: 16, gap: 14 },
  eventIcon: { fontSize: 28 },
  eventLabel: { fontSize: 16, color: '#FFFFFF', fontWeight: '500' },
  eventDate: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  emptyText: { fontSize: 14, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },
  statCard: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  statGradient: { alignItems: 'center', padding: 28, gap: 4 },
  statEmoji: { fontSize: 32 },
  statValue: { fontSize: 48, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
});
