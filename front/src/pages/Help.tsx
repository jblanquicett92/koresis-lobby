import React from 'react';
import { motion } from 'framer-motion';

export default function Help({ t }: { t: (key: string) => string }) {
  const faqs = [
    { q: 'help_q1', a: 'help_a1' },
    { q: 'help_q2', a: 'help_a2' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="flex-1 px-8 py-20 bg-white"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-light text-theme-main mb-6">{t('help_title')}</h2>
          <div className="w-16 h-px bg-theme-accent mx-auto"></div>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-theme-border pb-8">
              <h3 className="text-xl font-medium text-theme-main mb-3">{t(faq.q)}</h3>
              <p className="text-theme-muted leading-relaxed">{t(faq.a)}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
