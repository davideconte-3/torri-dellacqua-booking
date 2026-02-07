'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEvening, setIsEvening] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Detect time of day
      const hour = new Date().getHours();
      setIsEvening(hour >= 18 || hour < 6);

      // Show banner after a short delay
      setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setIsAnimating(true), 50);
      }, 500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  const theme = isEvening
    ? {
        bg: 'bg-gradient-to-r from-[#2c3e50]/95 to-[#34495e]/95',
        text: 'text-white',
        textSecondary: 'text-white/80',
        acceptBtn: 'bg-white text-[#2c3e50] hover:bg-white/95 shadow-lg hover:shadow-white/30',
        rejectBtn: 'border-white/50 text-white hover:bg-white/10 hover:border-white/80',
      }
    : {
        bg: 'bg-gradient-to-r from-[#63B1D2]/95 to-[#5aabcc]/95',
        text: 'text-white',
        textSecondary: 'text-white/85',
        acceptBtn: 'bg-white text-[#63B1D2] hover:bg-white/95 shadow-lg hover:shadow-white/30',
        rejectBtn: 'border-white/60 text-white hover:bg-white/15 hover:border-white/80',
      };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[39] transition-opacity duration-300 pointer-events-none ${
          isAnimating ? 'opacity-40 bg-black pointer-events-auto' : 'opacity-0'
        }`}
        onClick={handleAccept}
      />

      {/* Banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className={`${theme.bg} backdrop-blur-md px-6 py-6 md:px-8 md:py-7 border-t border-white/20`}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`${theme.text} text-lg font-light tracking-wide mb-2`} style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                Preferenze Cookie
              </h3>
              <p className={`${theme.textSecondary} text-sm leading-relaxed font-light`} style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito. Accettando, aiuti noi a fornire un servizio migliore e più personalizzato. Puoi sempre modificare le tue preferenze nel tempo.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 md:gap-4 flex-shrink-0">
              {/* Reject Button */}
              <button
                onClick={handleReject}
                className={`${theme.rejectBtn} px-5 md:px-6 py-3 rounded-full border font-light text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-inset whitespace-nowrap`}
              >
                Rifiuta
              </button>

              {/* Accept Button - Primary */}
              <button
                onClick={handleAccept}
                className={`${theme.acceptBtn} px-6 md:px-8 py-3 rounded-full font-light text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-inset whitespace-nowrap`}
              >
                Accetta
              </button>
            </div>
          </div>

          {/* Privacy Link */}
          <div className="mt-4 flex justify-center md:justify-start">
            <a
              href="/privacy-policy"
              className={`${theme.textSecondary} text-xs hover:${theme.text} transition-colors duration-300 font-light underline opacity-70 hover:opacity-100`}
            >
              Leggi la nostra informativa sulla privacy
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .gap-3 {
            gap: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
