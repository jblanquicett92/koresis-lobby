import React, { useEffect, useState } from 'react';
import { Info, Languages } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import translations from '../i18n.json';

interface Flight {
  id: string;
  type: 'arrival' | 'departure';
  airline: string;
  flightNumber: string;
  city: string;
  scheduledTime: string;
  estimatedTime: string;
  status: string;
  gate: string;
}

type Language = 'en' | 'es' | 'fr' | 'zh';

export default function App() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lang, setLang] = useState<Language>('es');

  // Simple translation helper
  const t = (key: string) => {
    const section = translations[lang] as Record<string, string>;
    return section[key] || key;
  };

  const getStatusLabel = (status: string) => {
    const key = `status_` + status.toLowerCase().replace(/\s+/g, '_');
    return t(key);
  };

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // API Call
  const fetchFlights = async () => {
    try {
      const res = await fetch('/api/flights');
      const data = await res.json();
      if (data.flights) {
        setFlights(data.flights);
      }
    } catch (err) {
      console.error("Error fetching flights:", err);
    }
  };

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const arrivals = flights.filter(f => f.type === 'arrival');
  const departures = flights.filter(f => f.type === 'departure');

  return (
    <div className="h-screen flex flex-col bg-theme-bg text-theme-main overflow-hidden">
      {/* Header */}
      <header className="px-10 py-10 md:px-16 flex justify-between items-end border-b border-theme-border shrink-0">
        <div className="flex flex-col">
          <h1 className="font-serif font-light text-[32px] tracking-[2px] uppercase text-theme-accent">Orbit by Koresis</h1>
          <span className="text-[12px] tracking-[4px] uppercase mt-1.5 text-theme-muted">{t('subtitle')}</span>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex gap-2">
            {(['es', 'en', 'fr', 'zh'] as Language[]).map(l => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm transition-colors ${lang === l ? 'bg-theme-accent text-white' : 'text-theme-muted hover:bg-theme-border'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="text-right">
            <div className="text-[48px] font-extralight leading-none">
              {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[14px] uppercase tracking-[1px] text-theme-muted mt-2">
              {currentTime.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 px-10 md:px-16 pt-8 overflow-hidden">
        <FlightBoard title={t('panel_arrivals')} flights={arrivals} getStatusLabel={getStatusLabel} />
        <FlightBoard title={t('panel_departures')} flights={departures} getStatusLabel={getStatusLabel} />
      </main>

      {/* Notifications Footer */}
      <footer className="px-10 md:px-16 py-5 pb-10 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] w-full overflow-hidden relative">
          <Info className="w-5 h-5 text-theme-muted shrink-0" />
          <div className="w-full overflow-hidden">
            <div className="animate-marquee flex gap-16">
              <span className="text-[12px] text-theme-muted">{t('welcome_msg')}</span>
              <span className="text-[12px] text-theme-muted">{t('welcome_msg')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FlightBoard({ title, flights, getStatusLabel }: { title: string, flights: Flight[], getStatusLabel: (s: string) => string }) {
  return (
    <section className="flex flex-col h-full overflow-hidden">
      <div className="text-[12px] uppercase tracking-[2px] text-theme-accent mb-6 flex items-center after:content-[''] after:flex-1 after:h-px after:bg-theme-border after:ml-4 shrink-0">
        {title}
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="w-full flex flex-col">
          <AnimatePresence mode="popLayout">
            {flights.map((flight) => (
              <FlightRow key={flight.id} flight={flight} getStatusLabel={getStatusLabel} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FlightRow({ flight, getStatusLabel }: { flight: Flight; getStatusLabel: (s: string) => string }) {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Boarding':
      case 'Final Call':
        return 'bg-status-on-time/10 text-status-on-time animate-pulse';
      case 'Delayed':
      case 'Cancelled':
        return 'bg-status-delayed/10 text-status-delayed';
      case 'Landed':
      case 'Departed':
      case 'In Air':
        return 'bg-status-landed/10 text-status-landed';
      default:
        return 'bg-status-on-time/10 text-status-on-time';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex items-center border-b border-theme-border py-5"
    >
      <div className="text-[20px] font-medium w-20 shrink-0">
        {flight.scheduledTime}
      </div>
      <div className="flex-1">
        <div className="text-[18px] font-normal">{flight.city}</div>
        <div className="text-[11px] text-theme-muted uppercase mt-1 block">
          {flight.airline} <span className="font-mono text-[13px] text-theme-muted bg-[#EEEBE3] px-1.5 py-0.5 rounded-[3px] ml-1">{flight.flightNumber}</span>
        </div>
      </div>
      <div className="w-[120px] text-right shrink-0">
        <span className={`inline-block px-3 py-1.5 rounded-[20px] text-[10px] font-bold uppercase tracking-[1px] ${getStatusClasses(flight.status)}`}>
          {getStatusLabel(flight.status)}
        </span>
      </div>
    </motion.div>
  );
}
