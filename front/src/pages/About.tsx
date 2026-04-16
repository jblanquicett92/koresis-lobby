import React from 'react';
import { motion } from 'framer-motion';

export default function About({ t }: { t: (key: string) => string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col md:flex-row bg-white overflow-hidden"
    >
      <div className="flex-1 p-16 md:p-24 flex flex-col justify-center">
        <h2 className="text-4xl font-serif font-light text-theme-main mb-8">{t('about_title')}</h2>
        <div className="w-16 h-px bg-theme-accent mb-10"></div>
        <p className="text-xl text-theme-main leading-relaxed font-light mb-6">
          {t('about_desc')}
        </p>
      </div>
      <div className="flex-1 bg-theme-bg relative min-h-[400px]">
        <img 
          src="/about-lobby.png" 
          alt="Luxury Hotel Lobby" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent md:w-32"></div>
      </div>
    </motion.div>
  );
}
