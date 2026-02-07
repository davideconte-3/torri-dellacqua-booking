'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export const PROFILING_COOKIES = [
  'ad_storage',
  'analytics_storage',
  '_fbp (Meta Pixel)',
  '_fbc (Meta Pixel)',
  '_ga (Google Analytics)',
  '_gid (Google Analytics)',
  'cookie di profilazione e targeting',
] as const;

const CONSENT_KEY = 'cookie-consent';
export type ConsentStatus = 'pending' | 'accepted' | 'rejected';

type ConsentContextValue = {
  consent: ConsentStatus;
  acceptProfiling: () => void;
  rejectProfiling: () => void;
  hasChosen: boolean;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readStoredConsent(): ConsentStatus {
  if (typeof window === 'undefined') return 'pending';
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'accepted') return 'accepted';
  if (stored === 'rejected') return 'rejected';
  return 'pending';
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentStatus>('pending');

  useEffect(() => {
    setConsent(readStoredConsent());
  }, []);

  const acceptProfiling = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
  }, []);

  const rejectProfiling = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setConsent('rejected');
  }, []);

  const value: ConsentContextValue = {
    consent,
    acceptProfiling,
    rejectProfiling,
    hasChosen: consent !== 'pending',
  };

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return ctx;
}

export function useProfilingConsent(): boolean {
  const { consent } = useConsent();
  return consent === 'accepted';
}
