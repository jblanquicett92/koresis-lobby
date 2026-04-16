import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Check, ShieldCheck, ExternalLink } from 'lucide-react';

// Clave pública cargada desde las variables de entorno
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

export default function Checkout({ t }: { t: (key: string) => string }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState('');
  const [interval, setInterval] = useState<1 | 6 | 12>(1);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const isSuccess = searchParams.get('success');
    if (isSuccess === 'true') {
      setStep(2);
      return;
    }

    const planParam = searchParams.get('plan');
    const intervalParam = searchParams.get('interval');
    
    if (planParam) {
      setPlan(planParam);
      if (intervalParam) setInterval(Number(intervalParam) as 1 | 6 | 12);
    } else {
      navigate('/pricing');
    }
  }, [searchParams, navigate]);

  const getPrice = (base: number) => {
    if (interval === 1) return base;
    if (interval === 6) return base * 5;
    return base * 10;
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));

  const handleStripeCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsRedirecting(true);
    
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe.js no cargó.");
        setIsRedirecting(false);
        return;
      }

      // 1. Fetch al backend de FastAPI para crear la sesión de pago oficial
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan || 'price_basic_name', interval })
      });
      
      const data = await response.json();

      if (!data.url) {
        throw new Error("El backend no pudo generar el enlance seguro de Stripe. Verifica los logs de FastAPI.");
      }

      // 2. Stripe removió stripe.redirectToCheckout en sus versiones modernas.
      // Ahora, la forma oficial es realizar una redirección pura de navegador hacia la URL
      // segura generada por la API de Stripe en el backend.
      window.location.href = data.url;

    } catch (err: any) {
      console.error("Error capturado en handleStripeCheckout:", err);
      alert(`Error conectando al backend: ${err.message}`);
      setIsRedirecting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col pt-10 bg-theme-bg"
    >
      <div className="max-w-4xl mx-auto w-full px-8 pb-20">
        
        {/* Stepper Header */}
        <div className="flex justify-around items-center mb-16 relative">
          <div className="absolute top-1/2 left-10 right-10 h-px bg-theme-border -z-10"></div>
          {[1, 2].map(i => (
            <div key={i} className={`flex flex-col items-center gap-2 bg-theme-bg px-4 ${step >= i ? 'text-theme-main' : 'text-theme-muted'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i ? 'bg-theme-accent text-white' : 'bg-white border border-theme-border'}`}>
                {step > i ? <Check className="w-5 h-5" /> : i}
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold">
                {i === 1 ? t('checkout_step2') : t('checkout_step3')}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white p-10 md:p-14 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-theme-border min-h-[400px] flex flex-col relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
              <div className="text-center mb-10">
                <h3 className="text-3xl md:text-4xl font-serif text-theme-main mb-3 leading-tight">
                  {t('checkout_details_h')}
                </h3>
                <div className="w-16 h-px bg-theme-accent mx-auto mb-4"></div>
                <p className="text-theme-muted text-sm uppercase tracking-widest font-medium">
                  Plan: {plan ? t(plan) : ''} ({interval} {interval === 1 ? 'Mes' : 'Meses'})
                </p>
              </div>

              <form className="space-y-8 max-w-md mx-auto" onSubmit={handleStripeCheckout}>
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-[2px] text-theme-muted mb-2 group-focus-within:text-theme-accent transition-colors">
                    {t('checkout_hotel_name')}
                  </label>
                  <input 
                    required 
                    type="text" 
                    className="w-full border-b-2 border-theme-border py-3 focus:outline-none focus:border-theme-accent transition-all text-lg font-light placeholder:text-theme-border" 
                    placeholder="Grand Horizon Hotel"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-[2px] text-theme-muted mb-2 group-focus-within:text-theme-accent transition-colors">
                    {t('checkout_admin_name')}
                  </label>
                  <input 
                    required 
                    type="text" 
                    className="w-full border-b-2 border-theme-border py-3 focus:outline-none focus:border-theme-accent transition-all text-lg font-light placeholder:text-theme-border" 
                    placeholder="John Doe"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-[2px] text-theme-muted mb-2 group-focus-within:text-theme-accent transition-colors">
                    {t('login_email')}
                  </label>
                  <input 
                    required 
                    type="email" 
                    className="w-full border-b-2 border-theme-border py-3 focus:outline-none focus:border-theme-accent transition-all text-lg font-light placeholder:text-theme-border" 
                    placeholder="admin@hotel.com"
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isRedirecting}
                    className="w-full bg-theme-accent text-white py-5 rounded-full text-[13px] tracking-[3px] uppercase font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex justify-center items-center gap-3">
                    {isRedirecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Redirigiendo a Stripe...
                      </>
                    ) : (
                      t('checkout_step3')
                    )}
                  </button>
                </div>
              </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="text-center py-10 flex-1 flex flex-col justify-center"
              >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-serif mb-4">{t('checkout_success')}</h3>
              <p className="text-theme-muted">Tu suscripción ha sido activada correctamente. Ya puedes acceder al panel de control.</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </motion.div>
  );
}
