import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login({ t }: { t: (key: string) => string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center p-8 bg-theme-bg"
    >
      <div className="bg-white p-10 w-full max-w-md rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-theme-border">
        <h2 className="text-2xl font-serif text-center mb-8">{t('login_title')}</h2>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-theme-muted mb-2">{t('login_email')}</label>
            <input type="email" className="w-full border-b border-theme-border py-2 focus:outline-none focus:border-theme-accent transition-colors" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-theme-muted">{t('login_pass')}</label>
              <Link to="#" className="text-xs text-theme-accent">{t('login_forgot')}</Link>
            </div>
            <input type="password" className="w-full border-b border-theme-border py-2 focus:outline-none focus:border-theme-accent transition-colors" />
          </div>
          
          <button type="submit" className="w-full bg-theme-accent text-white py-4 rounded-full text-[12px] tracking-[2px] uppercase font-bold hover:bg-black transition-colors mt-8">
            {t('btn_login')}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
