export interface WeatherData {
  temperature: number;
  weatherCode: number;
  description: string;
  icon: string;
}

const weatherDescriptions: Record<number, { fr: string; en: string; icon: string }> = {
  0: { fr: 'Ciel dégagé', en: 'Clear sky', icon: '☀️' },
  1: { fr: 'Peu nuageux', en: 'Mainly clear', icon: '🌤️' },
  2: { fr: 'Partiellement nuageux', en: 'Partly cloudy', icon: '⛅' },
  3: { fr: 'Couvert', en: 'Overcast', icon: '☁️' },
  45: { fr: 'Brouillard', en: 'Fog', icon: '🌫️' },
  48: { fr: 'Brouillard givrant', en: 'Rime fog', icon: '🌫️' },
  51: { fr: 'Bruine légère', en: 'Light drizzle', icon: '🌦️' },
  53: { fr: 'Bruine', en: 'Drizzle', icon: '🌦️' },
  55: { fr: 'Bruine dense', en: 'Dense drizzle', icon: '🌧️' },
  61: { fr: 'Pluie légère', en: 'Light rain', icon: '🌧️' },
  63: { fr: 'Pluie', en: 'Rain', icon: '🌧️' },
  65: { fr: 'Forte pluie', en: 'Heavy rain', icon: '🌧️' },
  71: { fr: 'Neige légère', en: 'Light snow', icon: '🌨️' },
  73: { fr: 'Neige', en: 'Snow', icon: '❄️' },
  75: { fr: 'Forte neige', en: 'Heavy snow', icon: '❄️' },
  80: { fr: 'Averses', en: 'Showers', icon: '🌦️' },
  81: { fr: 'Fortes averses', en: 'Heavy showers', icon: '🌧️' },
  95: { fr: 'Orage', en: 'Thunderstorm', icon: '⛈️' },
  99: { fr: 'Orage avec grêle', en: 'Thunderstorm with hail', icon: '⛈️' },
};

function getWeatherInfo(code: number, lang: string): { description: string; icon: string } {
  const match = weatherDescriptions[code];
  if (match) {
    return { description: lang === 'fr' ? match.fr : match.en, icon: match.icon };
  }
  return { description: lang === 'fr' ? 'Inconnu' : 'Unknown', icon: '❓' };
}

export async function fetchWeather(lat: number, lon: number, lang: string): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const current = data.current_weather;
    const info = getWeatherInfo(current.weathercode, lang);
    return {
      temperature: Math.round(current.temperature),
      weatherCode: current.weathercode,
      description: info.description,
      icon: info.icon,
    };
  } catch {
    return null;
  }
}
