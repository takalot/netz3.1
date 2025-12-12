import { ZmanimData, ZmanItem } from '../types';

// We use Hebcal API because it is free, public, and supports geolocation.
// The code provided in the prompt was a snippet requiring specific API credentials.
// This service mimics that logic but ensures the user has a working app immediately.

export const fetchZmanim = async (lat: number, lng: number): Promise<ZmanimData> => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // URL construction for Hebcal
  const url = `https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lng}&date=${date}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Map Hebcal response to our clean ZmanItem structure
    // We prioritize the most common Zmanim
    const times = data.times;
    const zmanimList: ZmanItem[] = [
      { label: 'Alot Hashachar', time: new Date(times.alotHaShachar) },
      { label: 'Talit & Tefillin', time: new Date(times.misheyakir) },
      { label: 'Sunrise (Netz)', time: new Date(times.sunrise) },
      { label: 'Sof Zman Shema (MGA)', time: new Date(times.sofZmanShemaMGA) },
      { label: 'Sof Zman Shema (Gra)', time: new Date(times.sofZmanShema) },
      { label: 'Sof Zman Tefila (Gra)', time: new Date(times.sofZmanTfila) },
      { label: 'Chatzot', time: new Date(times.chatzot) },
      { label: 'Mincha Gedola', time: new Date(times.minchaGedola) },
      { label: 'Mincha Ketana', time: new Date(times.minchaKetana) },
      { label: 'Plag HaMincha', time: new Date(times.plagHaMincha) },
      { label: 'Sunset (Shkia)', time: new Date(times.sunset) },
      { label: 'Tzeit HaKochavim', time: new Date(times.tzeit7083deg) }, // Standard Tzeit
    ];

    // Sort by time
    zmanimList.sort((a, b) => a.time.getTime() - b.time.getTime());

    return {
      location: data.location?.title || `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`,
      date: date,
      zmanim: zmanimList,
    };
  } catch (error) {
    console.error("Failed to fetch Zmanim:", error);
    throw error;
  }
};