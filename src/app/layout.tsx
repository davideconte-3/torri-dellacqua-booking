import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import '@/styles/globals.css';
import { ConsentProvider } from '@/contexts/ConsentContext';
import CookieBanner from '@/components/CookieBanner';
import ConsentModeUpdater from '@/components/ConsentModeUpdater';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Analytics from '@/components/Analytics';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Prenota | Ristorante Torri Dell\'Acqua',
    template: '%s | Torri Dell\'Acqua',
  },
  description: 'Prenota al ristorante Torri dell\'Acqua a Marina di Leuca (LE). Cena di San Valentino e prenotazioni.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3d1a1a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={playfair.variable}>
      <body className="antialiased font-serif">
        {/* Google Consent Mode v2: default denied così la modalità consenso è attiva e i tool la vedono */}
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{'ad_storage':'denied','analytics_storage':'denied','ad_user_data':'denied','ad_personalization':'denied'});`}
        </Script>
        <ConsentProvider>
          <ConsentModeUpdater />
          {children}
          <CookieBanner />
        </ConsentProvider>
      {/* GA: config dopo load di gtag.js così la raccolta dati parte subito */}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        ) : null}
        <Analytics metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
      </body>
    </html>
  );
}
