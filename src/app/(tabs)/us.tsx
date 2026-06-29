import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';
import { Profile, loadProfile } from '@/store/profile';

type Section = 'home' | 'question' | 'missYou' | 'ourList' | 'capsule';

export default function UsScreen() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [section, setSection] = useState<Section>('home');

  useFocusEffect(useCallback(() => { loadProfile().then(setProfile); }, []));

  if (!profile) return <LinearGradient colors={['#0A0E1A', '#0F1B2E']} style={{ flex: 1 }} />;

  const features = [
    { id: 'question' as Section, icon: '💬', label: t('us.dailyQuestion'), gradient: ['#6366F1', '#8B5CF6'] },
    { id: 'missYou' as Section, icon: '💜', label: t('us.missYou'), gradient: ['#EC4899', '#F43F5E'] },
    { id: 'ourList' as Section, icon: '✨', label: t('us.ourList'), gradient: ['#F59E0B', '#F97316'] },
    { id: 'capsule' as Section, icon: '🔮', label: t('us.capsule'), gradient: ['#06B6D4', '#3B82F6'] },
    { id: 'home' as Section, icon: '⏰', label: t('us.ourMoment'), gradient: ['#10B981', '#059669'] },
    { id: 'home' as Section, icon: '📷', label: t('us.photoOfDay'), gradient: ['#8B5CF6', '#6366F1'] },
  ];

  if (section !== 'home') {
    return (
      <LinearGradient colors={['#0A0E1A', '#1A1040', '#0F172A']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.sectionContent}>
          <TouchableOpacity onPress={() => setSection('home')} style={styles.backRow}>
            <Text style={styles.backText}>← {t('common.back')}</Text>
          </TouchableOpacity>

          {section === 'question' && <QuestionSection profile={profile} lang={i18n.language} t={t} />}
          {section === 'missYou' && <MissYouSection profile={profile} t={t} />}
          {section === 'ourList' && <OurListSection t={t} />}
          {section === 'capsule' && <CapsuleSection profile={profile} t={t} />}
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0A0E1A', '#0F1B2E', '#0A0E1A']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.gridContent}>
        <Text style={styles.headerTitle}>{t('tabs.us')}</Text>
        <View style={styles.grid}>
          {features.map((f, i) => (
            <TouchableOpacity key={i} style={styles.featureCard} onPress={() => f.id !== 'home' ? setSection(f.id) : null}>
              <LinearGradient colors={f.gradient as [string, string]} style={styles.featureIconBg}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
              </LinearGradient>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function QuestionSection({ profile, lang, t }: { profile: Profile; lang: string; t: (k: string, o?: object) => string }) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const questions = [
    { fr: "Quel est ton souvenir préféré de nous ?", en: "What's your favourite memory of us?" },
    { fr: "Qu'est-ce qui te manque le plus ?", en: "What do you miss most when we're apart?" },
    { fr: "Si on pouvait se téléporter là maintenant ?", en: "If we could teleport somewhere right now?" },
  ];
  const idx = Math.abs(hashDate()) % questions.length;
  const q = lang === 'fr' ? questions[idx].fr : questions[idx].en;

  return (
    <View style={styles.sectionInner}>
      <Text style={styles.sectionTitle}>{t('us.dailyQuestion')}</Text>
      <View style={styles.questionBubble}>
        <Text style={styles.questionText}>{q}</Text>
      </View>
      {!submitted ? (
        <>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="..."
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={answer}
              onChangeText={setAnswer}
            />
          </View>
          <TouchableOpacity style={styles.actionBtn} onPress={() => { if (answer.trim()) setSubmitted(true); }}>
            <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.actionBtnGradient}>
              <Text style={styles.actionBtnText}>{t('common.save')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={[styles.questionBubble, { backgroundColor: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.3)' }]}>
            <Text style={styles.answerText}>{answer}</Text>
          </View>
          <Text style={styles.premiumTeaser}>🔒 {t('us.seePartnerAnswer', { name: profile.partnerName })}</Text>
        </>
      )}
    </View>
  );
}

function MissYouSection({ profile, t }: { profile: Profile; t: (k: string) => string }) {
  const [sent, setSent] = useState(false);
  const gestures = [
    { emoji: '💜', label: t('us.missYou') },
    { emoji: '💋', label: 'Kiss' },
    { emoji: '🤗', label: 'Hug' },
    { emoji: '❤️‍🔥', label: 'Love' },
  ];

  return (
    <View style={styles.sectionInner}>
      <Text style={styles.sectionTitle}>{t('us.missYou')}</Text>
      {!sent ? (
        <View style={styles.gesturesRow}>
          {gestures.map((g, i) => (
            <TouchableOpacity key={i} style={styles.gestureCircle} onPress={() => setSent(true)}>
              <Text style={styles.gestureEmoji}>{g.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.sentCard}>
          <Text style={styles.sentEmoji}>💜</Text>
          <Text style={styles.sentText}>{t('us.missYou')} → {profile.partnerName}</Text>
        </View>
      )}
    </View>
  );
}

function OurListSection({ t }: { t: (k: string) => string }) {
  const [items, setItems] = useState<{ text: string; done: boolean }[]>([]);
  const [newItem, setNewItem] = useState('');

  return (
    <View style={styles.sectionInner}>
      <Text style={styles.sectionTitle}>{t('us.ourList')}</Text>
      <View style={styles.addRow}>
        <View style={[styles.inputBox, { flex: 1 }]}>
          <TextInput
            style={styles.textInput}
            value={newItem}
            onChangeText={setNewItem}
            placeholder="..."
            placeholderTextColor="rgba(255,255,255,0.25)"
          />
        </View>
        <TouchableOpacity style={styles.addCircle} onPress={() => { if (newItem.trim()) { setItems([...items, { text: newItem, done: false }]); setNewItem(''); } }}>
          <Text style={styles.addPlus}>+</Text>
        </TouchableOpacity>
      </View>
      {items.map((item, i) => (
        <TouchableOpacity key={i} style={styles.listRow} onPress={() => { const c = [...items]; c[i].done = !c[i].done; setItems(c); }}>
          <View style={[styles.checkbox, item.done && styles.checkboxDone]} />
          <Text style={[styles.listText, item.done && styles.listTextDone]}>{item.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function CapsuleSection({ profile, t }: { profile: Profile; t: (k: string) => string }) {
  const [msg, setMsg] = useState('');
  const [date, setDate] = useState(profile.reunionDate ?? '');
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.sectionInner}>
      <Text style={styles.sectionTitle}>{t('us.capsule')}</Text>
      {!saved ? (
        <>
          <View style={styles.inputBox}>
            <TextInput style={[styles.textInput, { minHeight: 80 }]} multiline value={msg} onChangeText={setMsg} placeholder="..." placeholderTextColor="rgba(255,255,255,0.25)" />
          </View>
          <View style={styles.inputBox}>
            <TextInput style={styles.textInput} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor="rgba(255,255,255,0.25)" />
          </View>
          <TouchableOpacity style={styles.actionBtn} onPress={() => { if (msg.trim()) setSaved(true); }}>
            <LinearGradient colors={['#06B6D4', '#3B82F6']} style={styles.actionBtnGradient}>
              <Text style={styles.actionBtnText}>🔒 {t('common.save')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.sentCard}>
          <Text style={styles.sentEmoji}>🔮</Text>
          <Text style={styles.sentText}>{t('us.capsule')} → {date}</Text>
        </View>
      )}
    </View>
  );
}

function hashDate(): number {
  const d = new Date().toISOString().split('T')[0];
  let h = 0;
  for (let i = 0; i < d.length; i++) { h = ((h << 5) - h) + d.charCodeAt(i); h |= 0; }
  return h;
}

const styles = StyleSheet.create({
  gridContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 100 },
  sectionContent: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 100 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: 20, alignItems: 'center', gap: 12 },
  featureIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  featureIcon: { fontSize: 22 },
  featureLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontWeight: '500' },
  backRow: { marginBottom: 16 },
  backText: { color: '#F59E0B', fontSize: 15, fontWeight: '500' },
  sectionInner: { gap: 16 },
  sectionTitle: { fontSize: 26, fontWeight: '700', color: '#FFFFFF' },
  questionBubble: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 20 },
  questionText: { fontSize: 18, color: 'rgba(255,255,255,0.9)', lineHeight: 26, fontStyle: 'italic' },
  answerText: { fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 24 },
  inputBox: { borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  textInput: { paddingHorizontal: 18, paddingVertical: 14, fontSize: 16, color: '#FFFFFF' },
  actionBtn: { borderRadius: 14, overflow: 'hidden' },
  actionBtnGradient: { paddingVertical: 16, alignItems: 'center', borderRadius: 14 },
  actionBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  premiumTeaser: { fontSize: 14, color: 'rgba(245,158,11,0.7)', textAlign: 'center', fontStyle: 'italic' },
  gesturesRow: { flexDirection: 'row', gap: 16, justifyContent: 'center', marginTop: 16 },
  gestureCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  gestureEmoji: { fontSize: 32 },
  sentCard: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: 32, gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  sentEmoji: { fontSize: 48 },
  sentText: { fontSize: 16, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  addRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  addCircle: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center' },
  addPlus: { fontSize: 24, fontWeight: '700', color: '#0A0E1A' },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  checkboxDone: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  listText: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  listTextDone: { textDecorationLine: 'line-through', color: 'rgba(255,255,255,0.3)' },
});
