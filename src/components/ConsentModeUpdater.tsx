'use client';

import { useEffect } from 'react';
import { useConsent } from '@/contexts/ConsentContext';

/** Quando l’utente accetta i cookie, aggiorna Google Consent Mode a granted. */
export default function ConsentModeUpdater() {
  const { consent } = useConsent();

  useEffect(() => {
    if (consent !== 'accepted') return;

    const granted = {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    };

    const apply = () => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', granted);
        return true;
      }
      return false;
    };

    if (apply()) return;
    const t = setInterval(() => {
      if (apply()) clearInterval(t);
    }, 100);
    return () => clearInterval(t);
  }, [consent]);

  return null;
}
