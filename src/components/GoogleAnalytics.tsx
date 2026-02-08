'use client';

import Script from 'next/script';

/** Carica gtag.js e esegue config solo dopo il load, così GA riceve sempre il primo hit. */
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const onLoad = () => {
    if (typeof window === 'undefined' || !(window as any).gtag) return;
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', gaId, { send_page_view: true });
  };

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        onLoad={onLoad}
      />
    </>
  );
}
