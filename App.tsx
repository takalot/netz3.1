import React, { useEffect, useState, useRef } from 'react';
import { fetchZmanim } from './services/zmanimService';
import { ZmanimData, ZmanItem } from './types';
import { formatCountdown } from './utils/timeUtils';
import { CountdownDisplay } from './components/CountdownDisplay';
import { ZmanimList } from './components/ZmanimList';

const App: React.FC = () => {
  const [data, setData] = useState<ZmanimData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Countdown State
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [nextZman, setNextZman] = useState<ZmanItem | null>(null);

  // Initialize Data on Mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await fetchZmanim(position.coords.latitude, position.coords.longitude);
          setData(result);
          setLoading(false);
        } catch (err) {
          setError("Impossible de charger les Zmanim. Vérifiez votre connexion.");
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        // Fallback to Jerusalem if blocked
        fetchZmanim(31.7683, 35.2137).then(result => {
           setData({...result, location: "Jérusalem (Fallback)"});
           setLoading(false);
        });
      }
    );
  }, []);

  // Timer Logic
  useEffect(() => {
    if (!data) return;

    const timer = setInterval(() => {
      const now = new Date();
      
      // Find the next upcoming Zman
      const upcoming = data.zmanim.find(z => z.time.getTime() > now.getTime());
      
      setNextZman(upcoming || null);

      if (upcoming) {
        const diff = upcoming.time.getTime() - now.getTime();
        setTimeRemaining(formatCountdown(diff));
      } else {
        setTimeRemaining("00:00:00");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="text-2xl font-tahoma font-bold animate-bounce">
          Chargement des Zmanim...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-red-400">
        <div className="text-xl font-tahoma font-bold">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-50 z-0 pointer-events-none"></div>

      {/* Header / Location */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-center text-gray-400">
        <div className="font-tahoma text-sm">{data?.date}</div>
        <div className="font-tahoma font-bold text-lg text-white">{data?.location}</div>
      </div>

      {/* Main Content: Center Countdown */}
      <main className="flex-grow z-10 flex flex-col justify-center">
        <CountdownDisplay nextZman={nextZman} timeRemaining={timeRemaining} />
      </main>

      {/* Footer: Vertical List (Horizontal scroll due to width, technically 'vertical' position on screen) */}
      <footer className="z-20 w-full">
         <ZmanimList zmanim={data?.zmanim || []} nextZman={nextZman} />
      </footer>
    </div>
  );
};

export default App;