'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cookie-consent';

export type CookieConsent = 'all' | 'necessary' | null;

export function getCookieConsent(): CookieConsent {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'all' || v === 'necessary') return v;
    return null;
  } catch {
    return null;
  }
}

export function setCookieConsent(value: 'all' | 'necessary') {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent === null) setVisible(true);
  }, []);

  const handleChoice = (value: 'all' | 'necessary') => {
    setCookieConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-5 bg-[#2d1515] border-t border-rose-300/30 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
      role="dialog"
      aria-label="Informativa cookie"
    >
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-rose-200/90 text-sm flex-1">
          Utilizziamo cookie tecnici necessari al funzionamento del sito. Per dettagli e per gestire le tue preferenze:{' '}
          <Link href="/privacy#cookie" className="text-rose-200 underline underline-offset-2 hover:text-rose-100">
            informativa privacy e cookie
          </Link>
          .
        </p>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleChoice('necessary')}
            className="px-4 py-2 rounded-xl border border-rose-300/30 text-rose-200/90 text-sm hover:bg-rose-800/40 transition-colors"
          >
            Solo necessari
          </button>
          <button
            type="button"
            onClick={() => handleChoice('all')}
            className="px-4 py-2 rounded-xl bg-rose-700 text-rose-100 text-sm font-medium hover:bg-rose-600 transition-colors"
          >
            Accetta tutti
          </button>
        </div>
      </div>
    </div>
  );
}
