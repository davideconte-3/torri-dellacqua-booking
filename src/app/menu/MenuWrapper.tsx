'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import MenuSplash from './MenuSplash';
import MenuList from './MenuList';
import Credits from '@/components/Credits';

const BOOKING_BASE = process.env.NEXT_PUBLIC_BOOKING_URL || '/';
const BOOKING_URL = BOOKING_BASE + (BOOKING_BASE.includes('?') ? '&' : '?') + 'skipSplash=1';

const MENU_SPLASH_DISMISSED_KEY = 'menu-splash-dismissed';

function hasMenuSplashBeenDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(MENU_SPLASH_DISMISSED_KEY) === '1';
}

type Item = { id: string; name: string; price: number; description: string | null; order: number };
type Category = { id: string; name: string; order: number; items: Item[] };

const MENU_NOTE = 'coperto 3,50€ - terrazza 5,00€';

// Restaurant info from environment variables
const RESTAURANT = {
  name: process.env.NEXT_PUBLIC_RESTAURANT_NAME || "Torri dell'Acqua",
  address: process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS || "Via Dante Alighieri n. 8, 73040 Marina di Leuca (LE)",
  addressUrl: process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS)}`
    : "https://www.google.com/maps/search/?api=1&query=Via+Dante+Alighieri+8+Marina+di+Leuca+LE",
  phone: process.env.NEXT_PUBLIC_RESTAURANT_PHONE || "+39 0833 123456",
  email: process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || "info@torridellacqua.it",
  instagram: process.env.NEXT_PUBLIC_RESTAURANT_INSTAGRAM || "https://www.instagram.com/torridellacqua_restaurant/",
  instagramHandle: process.env.NEXT_PUBLIC_RESTAURANT_INSTAGRAM_HANDLE || "@torridellacqua_restaurant",
};

export default function MenuWrapper({ categories, skipSplash = false }: { categories: Category[]; skipSplash?: boolean }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isEvening, setIsEvening] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  });
  const [isVisible, setIsVisible] = useState(false);
  const [splashExiting, setSplashExiting] = useState(false);

  useLayoutEffect(() => {
    const hour = new Date().getHours();
    setIsEvening(hour >= 18 || hour < 6);
  }, []);

  useEffect(() => {
    if (skipSplash || hasMenuSplashBeenDismissed()) {
      setShowSplash(false);
      setIsVisible(true);
    }
  }, [skipSplash]);

  useEffect(() => {
    if (!showSplash) {
      setIsVisible(true);
    }
  }, [showSplash]);

  useEffect(() => {
    if (showSplash) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    document.body.style.overflow = '';
  }, [showSplash]);

  const handleEnterMenu = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(MENU_SPLASH_DISMISSED_KEY, '1');
    }
    setIsVisible(true);
    setSplashExiting(true);

    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  };

  const theme = isEvening
    ? {
        bg: 'bg-gradient-to-b from-[#2d3a47] via-[#1e2a35] to-[#2d3a47]',
        logo: 'bg-white',
        text: 'text-white',
        textSecondary: 'text-white/95',
        textTertiary: 'text-white/88',
        border: 'border-white/25',
        borderAccent: 'border-white/35',
      }
    : {
        bg: 'bg-gray-50',
        logo: 'bg-[#1e293b]',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textTertiary: 'text-gray-600',
        border: 'border-gray-200',
        borderAccent: 'border-gray-300',
      };

  return (
    <>
      {/* Main Menu - Rendered behind splash */}
      <main className={`min-h-screen ${theme.bg} ${theme.text} py-8 px-4 pb-10 transition-all duration-1000 ease-out overflow-x-hidden ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
      }`}>
      <div className="max-w-2xl mx-auto flex flex-col min-h-screen">
        <header className="flex flex-col items-center mt-6 mb-10">
          <div
            className={`h-28 w-56 ${theme.logo} opacity-95 [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] transition-all duration-500 hover:opacity-100 hover:scale-105 animate-fade-in-down`}
            style={{ maskImage: 'url(/torri-dellacqua-logo.svg)', WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)' }}
            role="img"
            aria-label="Torri dell'Acqua"
          />
          <h1 className={`text-2xl font-light ${theme.text} mt-6 tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.25em] animate-fade-in`} style={{ fontFamily: 'ui-serif, Georgia, serif', animationDelay: '0.2s' }}>Menu</h1>
          <div className={`h-px ${theme.borderAccent} my-4 animate-expand-width`} style={{ animationDelay: '0.4s' }} />
          <p className={`${theme.textSecondary} text-xs tracking-wide font-light animate-fade-in`} style={{ fontFamily: 'ui-serif, Georgia, serif', animationDelay: '0.6s' }}>{MENU_NOTE}</p>
          <Link
            href={BOOKING_URL}
            className={`mt-4 text-xs font-light tracking-wide ${theme.textTertiary} transition-colors animate-fade-in ${isEvening ? 'hover:text-white' : 'hover:text-gray-900'}`}
            style={{ fontFamily: 'ui-serif, Georgia, serif', animationDelay: '0.5s' }}
          >
            Prenota un tavolo
          </Link>
        </header>
        <div className="flex-1">
          <MenuList categories={categories} isLightTheme={!isEvening} />
        </div>
        <footer className={`mt-16 pt-10 border-t ${theme.border} animate-fade-in-up`} style={{ animationDelay: '0.8s' }}>
          <div className="flex flex-col items-center text-center">
            <div
              className={`h-20 w-40 ${theme.logo} opacity-85 [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] mb-6 transition-all duration-500 hover:opacity-100 hover:scale-105`}
              style={{ maskImage: 'url(/torri-dellacqua-logo.svg)', WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)' }}
              role="img"
              aria-label="Torri dell'Acqua"
            />
            <address className={`not-italic ${theme.textSecondary} text-sm space-y-2.5 mb-6 font-light`} style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
              <a
                href={RESTAURANT.addressUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`block transition-all duration-300 hover:tracking-wide ${isEvening ? 'hover:text-white' : 'hover:text-gray-900'}`}
              >
                {RESTAURANT.address}
              </a>
              <div className="flex justify-center gap-4 text-xs">
                <a href={`tel:${RESTAURANT.phone.replace(/\s/g, '')}`} className={`transition-all duration-300 hover:scale-105 inline-block ${isEvening ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  {RESTAURANT.phone}
                </a>
                <span className={theme.textTertiary}>·</span>
                <a href={`mailto:${RESTAURANT.email}`} className={`transition-all duration-300 hover:scale-105 inline-block ${isEvening ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  {RESTAURANT.email}
                </a>
              </div>
            </address>
            <a
              href={RESTAURANT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-2.5 px-6 py-3 rounded-full border ${isEvening ? 'border-white/35 hover:bg-white/10 hover:border-white/50 hover:shadow-white/10' : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-gray-200/50'} ${theme.text} text-sm font-light transition-all duration-500 hover:scale-105 hover:shadow-lg`}
              style={{ fontFamily: 'ui-serif, Georgia, serif' }}
            >
              <svg className="w-4 h-4 shrink-0 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.281.261 2.15.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.281-.06 2.15-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.281-.262-2.15-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63 19.095.333 18.225.131 16.947.072 15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.897 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span className="transition-all duration-300 group-hover:tracking-wide">{RESTAURANT.instagramHandle}</span>
            </a>
          </div>

          {/* Credits */}
          <div className={`mt-8 pt-6 border-t ${theme.border} animate-fade-in`} style={{ animationDelay: '1s' }}>
            <Credits onLightBg={!isEvening} />
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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

        @keyframes expand-width {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 4rem;
            opacity: 1;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        .animate-expand-width {
          animation: expand-width 0.8s ease-out both;
        }
      `}</style>
      </main>

      {/* Splash Screen - Overlays menu with cross-fade */}
      {showSplash && <MenuSplash onEnter={handleEnterMenu} isExiting={splashExiting} />}
    </>
  );
}
