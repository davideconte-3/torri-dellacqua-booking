'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const RESTAURANT = {
  instagram: process.env.NEXT_PUBLIC_RESTAURANT_INSTAGRAM || "https://www.instagram.com/torridellacqua_restaurant/",
  instagramHandle: process.env.NEXT_PUBLIC_RESTAURANT_INSTAGRAM_HANDLE || "@torridellacqua_restaurant",
};

const BOOKING_BASE = process.env.NEXT_PUBLIC_BOOKING_URL || '/';
const BOOKING_URL = BOOKING_BASE + (BOOKING_BASE.includes('?') ? '&' : '?') + 'skipSplash=1';

export default function MenuSplash({ onEnter, isExiting = false }: { onEnter: () => void; isExiting?: boolean }) {
  const [isEvening, setIsEvening] = useState(() => {
    if (typeof window === 'undefined') return true;
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsEvening(hour >= 18 || hour < 6);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const theme = isEvening
    ? {
        // Sera: toni caldi e accoglienti, non troppo scuri
        overlay: 'bg-gradient-to-b from-[#2c3e50]/85 via-[#34495e]/80 to-[#2c3e50]/90',
        text: 'text-white',
        button: 'bg-white/95 text-[#2c3e50] hover:bg-white shadow-2xl hover:shadow-white/20',
        buttonRing: 'focus:ring-white/30',
        instagramBorder: 'border-white/50 text-white hover:bg-white/20 hover:border-white/80',
        photo: '/restaurant-night.jpg',
      }
    : {
        overlay: 'bg-white/40',
        text: 'text-[#1e293b]',
        button: 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-2xl hover:shadow-[#2563eb]/25',
        buttonRing: 'focus:ring-[#2563eb]/30',
        instagramBorder: 'border-gray-600 text-gray-800 hover:bg-white/60 hover:border-gray-700',
        photo: '/restaurant-day.png',
      };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all ease-in-out ${
        isExiting ? 'opacity-0 duration-1000' : isVisible ? 'opacity-100 duration-700' : 'opacity-0 duration-0'
      }`}
      style={{ pointerEvents: isExiting ? 'none' : 'auto' }}
    >
      {/* Background Image - unoptimized per evitare problemi con PNG in public */}
      <div className={`absolute inset-0 transition-all duration-1000 ${isExiting ? 'opacity-0 scale-110' : ''}`}>
        <Image
          src={theme.photo}
          alt="Ristorante Torri dell'Acqua"
          fill
          className={`object-cover object-center transition-transform duration-1000 ${
            isExiting ? 'scale-110' : 'scale-105 animate-subtle-zoom'
          }`}
          priority
          unoptimized
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes('restaurant-day')) {
              target.src = '/restaurant-night.jpg';
            }
          }}
        />
      </div>

      {/* Elegant Overlay */}
      <div className={`absolute inset-0 ${theme.overlay} backdrop-blur-[2px] transition-all duration-1000 ${
        isExiting ? 'opacity-0 backdrop-blur-none' : ''
      }`} />

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center px-8 max-w-lg w-full transition-all ease-out ${
        isExiting ? 'opacity-0 translate-y-12 scale-90 duration-800' : 'animate-fade-in-up duration-700'
      }`}>
        {/* Logo with elegant fade */}
        <div
          className={`h-36 w-72 ${isEvening ? 'bg-white' : 'bg-[#2a2a2a]'} [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] mb-16 opacity-95 transition-all duration-800 hover:opacity-100 hover:scale-105 ${
            isExiting ? 'scale-80 opacity-0 -translate-y-4' : ''
          }`}
          style={{
            maskImage: 'url(/torri-dellacqua-logo.svg)',
            WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)',
          }}
          role="img"
          aria-label="Torri dell'Acqua"
        />

        {/* Elegant Button */}
        <button
          onClick={onEnter}
          disabled={isExiting}
          className={`${theme.button} ${theme.buttonRing} px-12 py-4 rounded-full text-base font-light tracking-[0.15em] uppercase transition-all duration-800 transform hover:scale-105 hover:-translate-y-0.5 active:scale-100 active:translate-y-0 mb-6 focus:outline-none focus:ring-4 ${
            isExiting ? 'opacity-0 scale-80 translate-y-4' : ''
          } disabled:pointer-events-none`}
          style={{ fontFamily: 'ui-serif, Georgia, serif' }}
        >
          Visualizza Menu
        </button>

        <Link
          href={BOOKING_URL}
          className={`text-sm font-light tracking-wide opacity-90 hover:opacity-100 transition-opacity mb-8 ${
            isEvening ? 'text-white/90' : 'text-[#2c3e50]/90'
          } ${isExiting ? 'opacity-0 pointer-events-none' : ''}`}
          style={{ fontFamily: 'ui-serif, Georgia, serif' }}
        >
          Prenota un tavolo
        </Link>

        {/* Refined Instagram Link */}
        <a
          href={RESTAURANT.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full border ${theme.instagramBorder} text-sm font-light tracking-wide transition-all duration-900 hover:scale-105 ${
            isExiting ? 'opacity-0 scale-80 translate-y-6' : ''
          }`}
          style={{ fontFamily: 'ui-serif, Georgia, serif', pointerEvents: isExiting ? 'none' : 'auto' }}
        >
          <svg className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.281.261 2.15.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.281-.06 2.15-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.281-.262-2.15-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63 19.095.333 18.225.131 16.947.072 15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.897 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          {RESTAURANT.instagramHandle}
        </a>
      </div>

      <style jsx>{`
        @keyframes subtle-zoom {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.08); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 20s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </div>
  );
}
