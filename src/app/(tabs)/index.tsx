import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';
import { Profile, loadProfile } from '@/store/profile';
import { getDaysUntil } from '@/utils/time';
import { WeatherData, fetchWeather } from '@/utils/weather';
import { CityCoords, geocodeCity } from '@/utils/geocoding';

export default function TodayScreen() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userCoords, setUserCoords] = useState<CityCoords | null>(null);
  const [partnerCoords, setPartnerCoords] = useState<CityCoords | null>(null);
  const [userWeather, setUserWeather] = useState<WeatherData | null>(null);
  const [partnerWeather, setPartnerWeather] = useState<WeatherData | null>(null);
  const [now, setNow] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => { loadProfile().then(setProfile); }, []));

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!profile) return;
    if (profile.userCity) geocodeCity(profile.userCity).then(setUserCoords);
    if (profile.partnerCity) geocodeCity(profile.partnerCity).then(setPartnerCoords);
  }, [profile?.userCity, profile?.partnerCity]);

  useEffect(() => {
    const lang = i18n.language;
    if (userCoords) fetchWeather(userCoords.lat, userCoords.lon, lang).then(setUserWeather);
    if (partnerCoords) fetchWeather(partnerCoords.lat, partnerCoords.lon, lang).then(setPartnerWeather);
  }, [userCoords, partnerCoords, i18n.language]);

  const onRefresh = async () => {
    setRefreshing(true);
    const p = await loadProfile();
    setProfile(p);
    setRefreshing(false);
  };

  const daysLeft = profile ? getDaysUntil(profile.reunionDate) : null;

  const getHour = (coords: CityCoords | null) => {
    if (!coords) return now.getHours() + now.getMinutes() / 60;
    const utcH = now.getUTCHours() + now.getUTCMinutes() / 60;
    return (utcH + coords.utcOffsetHours + 24) % 24;
  };

  const userHour = getHour(userCoords);
  const partnerHour = getHour(partnerCoords);
  const isDayPartner = partnerHour >= 6 && partnerHour < 20;
  const timeDiff = Math.round(partnerHour - userHour);

  const formatH = (h: number) => `${Math.floor(h).toString().padStart(2, '0')}:${Math.round((h % 1) * 60).toString().padStart(2, '0')}`;

  const distance = userCoords && partnerCoords ? haversine(userCoords, partnerCoords) : null;

  return (
    <LinearGradient colors={['#0A0E1A', '#0F1B2E', '#0A0E1A']} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F59E0B" />}>

        {/* Countdown */}
        <View style={styles.countdownSection}>
          {daysLeft !== null ? (
            <>
              <Text style={styles.countdownNumber}>{daysLeft}</Text>
              <Text style={styles.countdownLabel}>{t('today.daysLeft', { count: daysLeft })}</Text>
            </>
          ) : (
            <Text style={styles.countdownLabel}>{t('today.noDate')}</Text>
          )}
        </View>

        {/* Dual Clocks */}
        {profile && (
          <View style={styles.clocksRow}>
            <ClockCard name={profile.userName || '...'} hour={userHour} />
            <ClockCard name={profile.partnerName || '...'} hour={partnerHour} />
          </View>
        )}

        {timeDiff !== 0 && profile?.partnerName && (
          <Text style={styles.timeDiff}>
            {timeDiff > 0 ? '+' : ''}{timeDiff}h
          </Text>
        )}

        {/* Suggestion */}
        {profile?.partnerName && (() => {
          const h = Math.floor(partnerHour);
          if (h >= 6 && h < 8) return <Text style={styles.suggestion}>{t('today.goodMorning')}</Text>;
          if (h >= 22 || h < 1) return <Text style={styles.suggestion}>{t('today.goodNight')}</Text>;
          return null;
        })()}

        {/* Weather */}
        {(profile?.userCity || profile?.partnerCity) && (
          <View style={styles.weatherRow}>
            {profile?.userCity && <WeatherBlock city={profile.userCity} data={userWeather} />}
            {profile?.partnerCity && <WeatherBlock city={profile.partnerCity} data={partnerWeather} />}
          </View>
        )}

        {/* Distance */}
        {distance !== null && (
          <View style={styles.distanceCard}>
            <Text style={styles.distanceValue}>{distance.toLocaleString()} km</Text>
            <Text style={styles.distanceLabel}>{t('today.ourDistance')}</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

function ClockCard({ name, hour }: { name: string; hour: number }) {
  const isDay = hour >= 6 && hour < 20;
  const timeStr = `${Math.floor(hour).toString().padStart(2, '0')}:${Math.round((hour % 1) * 60).toString().padStart(2, '0')}`;

  return (
    <LinearGradient
      colors={isDay ? ['#1E3A5F', '#2563EB'] : ['#1A1040', '#0F0A2A']}
      style={styles.clockCard}>
      <Text style={styles.clockIcon}>{isDay ? '☀️' : '🌙'}</Text>
      <Text style={styles.clockTime}>{timeStr}</Text>
      <Text style={styles.clockName}>{name}</Text>
    </LinearGradient>
  );
}

function WeatherBlock({ city, data }: { city: string; data: WeatherData | null }) {
  return (
    <View style={styles.weatherCard}>
      <Text style={styles.weatherIcon}>{data?.icon ?? '...'}</Text>
      <Text style={styles.weatherTemp}>{data ? `${data.temperature}°` : '—'}</Text>
      <Text style={styles.weatherCity}>{city}</Text>
    </View>
  );
}

function haversine(a: CityCoords, b: CityCoords): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  countdownSection: {
    alignItems: 'center',
    marginVertical: 32,
  },
  countdownNumber: {
    fontSize: 80,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: -2,
  },
  countdownLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  clocksRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  clockCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 20,
    gap: 6,
  },
  clockIcon: {
    fontSize: 28,
  },
  clockTime: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clockName: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  timeDiff: {
    fontSize: 13,
    color: '#F59E0B',
    marginTop: 8,
    fontWeight: '500',
  },
  suggestion: {
    fontSize: 15,
    color: '#FBBF24',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  weatherRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 24,
  },
  weatherCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  weatherIcon: {
    fontSize: 24,
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weatherCity: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  distanceCard: {
    marginTop: 24,
    backgroundColor: 'rgba(245,158,11,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.15)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  distanceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F59E0B',
  },
  distanceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
});
