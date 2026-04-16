import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Pricing({ t }: { t: (key: string) => string }) {
  const [interval, setInterval] = React.useState<1 | 6 | 12>(1);

  const getPrice = (base: number) => {
    if (interval === 1) return base;
    if (interval === 6) return base * 5;
    return base * 10;
  };

  const plans = [
    {
      name: 'price_basic_name',
      desc: 'price_basic_desc',
      price: 69,
      features: [
        `1 ${t('price_feat_screens')}`,
        `1 ${t('price_feat_airports')}`,
        `1 ${t('price_feat_languages')}`,
      ],
      popular: false
    },
    {
      name: 'price_pro_name',
      desc: 'price_pro_desc',
      price: 149,
      features: [
        `3 ${t('price_feat_screens')}`,
        `3 ${t('price_feat_airports')}`,
        `2 ${t('price_feat_languages')}`,
        t('price_feat_weather')
      ],
      popular: true
    },
    {
      name: 'price_prem_name',
      desc: 'price_prem_desc',
      price: 199,
      features: [
        `${t('price_feat_unlimited')} ${t('price_feat_screens')}`,
        `${t('price_feat_unlimited')} ${t('price_feat_airports')}`,
        `11+ ${t('price_feat_languages')}`,
        t('price_feat_weather')
      ],
      popular: false
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex-1 px-8 py-20 bg-theme-bg/50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-theme-accent text-white text-[10px] uppercase tracking-widest font-bold px-6 py-2 rounded-full mb-6">
            {t('price_trial_badge')}
          </div>
          <div className="w-24 h-px bg-theme-accent mx-auto mb-12"></div>

          {/* Interval Selector */}
          <div className="flex justify-center mb-16">
            <div className="bg-white p-1 rounded-full border border-theme-border flex items-center shadow-sm">
              {[1, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setInterval(m as 1 | 6 | 12)}
                  className={`px-6 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all ${
                    interval === m ? 'bg-theme-accent text-white shadow-md' : 'text-theme-muted hover:text-theme-main'
                  }`}
                >
                  {t(`price_interval_${m}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-12">
          {plans.map((plan, i) => (
            <div key={i} className={`bg-white p-10 flex flex-col h-full relative transition-transform hover:-translate-y-2 shadow-[0_10px_40px_rgba(0,0,0,0.05)] ${plan.popular ? 'border-t-4 border-theme-accent py-12' : 'border border-theme-border rounded-xl'}`}>
              {plan.popular && (
                <span className="absolute top-0 right-10 -translate-y-1/2 bg-theme-accent text-white text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full">
                  {t('price_popular_tag')}
                </span>
              )}
              
              <h3 className="text-2xl font-serif mb-2">{t(plan.name)}</h3>
              <p className="text-theme-muted text-sm mb-8 min-h-[40px]">{t(plan.desc)}</p>
              
              <div className="mb-10">
                <span className="text-5xl font-light">${getPrice(plan.price)}</span>
                <span className="text-theme-muted">
                  {interval === 1 ? ` ${t('price_per_month')}` : ` / ${interval} ${t('price_per_month').replace('/', '').trim()}`}
                </span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-theme-accent/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-theme-accent" />
                    </div>
                    <span className="text-theme-main text-sm">{feat}</span>
                  </div>
                ))}
              </div>

              <Link 
                to={`/get-started?plan=${plan.name}&interval=${interval}`} 
                className={`block text-center py-4 rounded-full text-[12px] uppercase tracking-[2px] font-bold transition-colors ${plan.popular ? 'bg-theme-accent text-white hover:bg-black' : 'bg-theme-bg text-theme-main hover:bg-theme-border'}`}
              >
                {t('price_btn_choose')}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center text-theme-muted text-[13px] italic">
          {t('price_trial_desc')}
        </div>
      </div>
    </motion.div>
  );
}
