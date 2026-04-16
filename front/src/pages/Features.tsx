import React from 'react';
import { Clock, Globe, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features({ t }: { t: (key: string) => string }) {
  const features = [
    {
      icon: <Clock className="w-8 h-8 text-theme-accent" />,
      title: 'feat_1_title',
      desc: 'feat_1_desc',
    },
    {
      icon: <Globe className="w-8 h-8 text-theme-accent" />,
      title: 'feat_2_title',
      desc: 'feat_2_desc',
    },
    {
      icon: <LayoutGrid className="w-8 h-8 text-theme-accent" />,
      title: 'feat_3_title',
      desc: 'feat_3_desc',
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex-1 px-8 py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-serif font-light text-theme-main mb-6">{t('feat_title')}</h2>
          <div className="w-24 h-px bg-theme-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-theme-bg rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-2xl font-serif mb-4 text-theme-main">{t(f.title)}</h3>
              <p className="text-theme-muted leading-relaxed">{t(f.desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
