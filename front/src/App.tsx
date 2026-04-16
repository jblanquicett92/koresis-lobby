import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import translations from '../i18n.json';
import LiveBoard from './pages/LiveBoard';
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Help from './pages/Help';
import Login from './pages/Login';
import Checkout from './pages/Checkout';

type Language = 'en' | 'es' | 'fr' | 'zh';

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const location = useLocation();

  const t = (key: string) => {
    const section = translations[lang] as Record<string, string>;
    return section[key] || key;
  };

  const isLiveBoard = location.pathname === '/live';

  if (isLiveBoard) {
    return <LiveBoard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg text-theme-main font-sans">
      {/* Navigation Bar */}
      <nav className="px-8 py-5 flex justify-between items-center border-b border-theme-border bg-white sticky top-0 z-50">
        <Link to="/" className="flex flex-col">
          <span className="font-serif font-light text-[22px] tracking-[1px] uppercase text-theme-accent">Orbit by Koresis</span>
        </Link>
        
        <div className="hidden md:flex gap-8 items-center text-[13px] tracking-widest uppercase">
          <Link to="/features" className="hover:text-theme-accent transition-colors">{t('nav_features')}</Link>
          <Link to="/pricing" className="hover:text-theme-accent transition-colors">{t('nav_pricing')}</Link>
          <Link to="/about" className="hover:text-theme-accent transition-colors">{t('nav_about')}</Link>
          <Link to="/help" className="hover:text-theme-accent transition-colors">{t('nav_help')}</Link>
        </div>

        <div className="flex items-center gap-6">
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
          <Link to="/login" className="text-[13px] tracking-widest uppercase font-bold text-theme-muted hover:text-theme-accent transition-colors">
            {t('btn_login')}
          </Link>
          <Link to="/get-started" className="bg-theme-accent text-white px-5 py-2.5 rounded-full text-[12px] tracking-[2px] uppercase font-bold hover:bg-black transition-colors">
            {t('btn_get_started')}
          </Link>
        </div>
      </nav>

      {/* Main Content Area Area */}
      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home t={t} />} />
            <Route path="/features" element={<Features t={t} />} />
            <Route path="/pricing" element={<Pricing t={t} />} />
            <Route path="/about" element={<About t={t} />} />
            <Route path="/help" element={<Help t={t} />} />
            <Route path="/login" element={<Login t={t} />} />
            <Route path="/get-started" element={<Checkout t={t} />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Simple Footer */}
      <footer className="px-8 py-10 border-t border-theme-border bg-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-theme-muted text-[12px]">
          <div>&copy; 2026 Orbit by Koresis. All rights reserved.</div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/help" className="hover:text-theme-accent">Privacy Policy</Link>
            <Link to="/help" className="hover:text-theme-accent">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
