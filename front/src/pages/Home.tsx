import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home({ t }: { t: (key: string) => string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex items-center justify-center bg-gray-50 px-8 py-20 relative overflow-hidden"
    >
      {/* Decorative background shape */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-theme-accent/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-serif font-light text-theme-main leading-tight mb-8">
          {t('home_title')}
        </h1>
        <p className="text-lg md:text-xl text-theme-muted max-w-2xl mx-auto mb-12 leading-relaxed">
          {t('home_desc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/get-started" className="bg-theme-accent text-white px-8 py-4 rounded-full text-[14px] tracking-[2px] uppercase font-bold hover:bg-black transition-all transform hover:-translate-y-1 shadow-lg w-full sm:w-auto">
            {t('btn_get_started')}
          </Link>
          <Link to="/live" className="box-border border border-theme-border text-theme-main px-8 py-4 rounded-full text-[14px] tracking-[2px] uppercase font-bold hover:bg-white hover:border-theme-accent transition-all transform hover:-translate-y-1 w-full sm:w-auto">
            Demo Live
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
