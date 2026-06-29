export interface CityCoords {
  lat: number;
  lon: number;
  timezone: string;
  utcOffsetHours: number;
}

export async function geocodeCity(city: string): Promise<CityCoords | null> {
  if (!city.trim()) return null;
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    const result = data.results[0];
    const tzUrl = `https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current_weather=true&timezone=auto`;
    const tzRes = await fetch(tzUrl);
    const tzData = await tzRes.json();
    return {
      lat: result.latitude,
      lon: result.longitude,
      timezone: tzData.timezone ?? 'UTC',
      utcOffsetHours: (tzData.utc_offset_seconds ?? 0) / 3600,
    };
  } catch {
    return null;
  }
}
