import type { Metadata } from 'next';
import Analytics from '@/components/Analytics';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://torridellacqua.it';
const RESTAURANT_NAME = process.env.NEXT_PUBLIC_RESTAURANT_NAME || "Torri dell'Acqua";
const RESTAURANT_COMPANY = process.env.NEXT_PUBLIC_RESTAURANT_COMPANY_NAME || "TORRI DELL'ACQUA S.R.L.";
const RESTAURANT_ADDRESS = process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS || 'Via Dante Alighieri n. 8, 73040 Marina di Leuca (LE)';

export const metadata: Metadata = {
  title: 'Cena di San Valentino 2026 | Ristorante Torri Dell\'Acqua',
  description: 'Prenota la cena di San Valentino al ristorante Torri dell\'Acqua. Menu degustazione 60€ a persona, sabato 14 febbraio 2026 a Marina di Leuca (LE). Posti limitati.',
  keywords: 'cena san valentino, ristorante san valentino castrignano del capo, menu san valentino salento, prenotazione san valentino 2026, torri dell\'acqua, ristorante salento',

  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: `${SITE_URL}/sanvalentino`,
    siteName: 'Torri Dell\'Acqua',
    title: 'Cena di San Valentino 2026 - Ristorante Torri Dell\'Acqua',
    description: 'Prenota la tua cena di San Valentino. Menu degustazione 60€ a persona. Sabato 14 febbraio 2026 a Marina di Leuca (LE). Posti limitati.',
    images: [
      { url: `${SITE_URL}/og-sanvalentino.jpg`, width: 1200, height: 630, alt: 'San Valentino 2026 - Torri Dell\'Acqua' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cena di San Valentino 2026 | Torri Dell\'Acqua',
    description: 'Menu degustazione 60€ a persona. Sabato 14 febbraio 2026 a Marina di Leuca (LE). Prenota ora.',
    images: [`${SITE_URL}/og-sanvalentino.jpg`],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/sanvalentino` },
  other: { 'fb:app_id': process.env.NEXT_PUBLIC_FB_APP_ID || '' },
};

export default function SanValentinoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'Cena di San Valentino 2026',
            description: 'Cena di San Valentino con menu degustazione',
            startDate: '2026-02-14T19:00:00+01:00',
            endDate: '2026-02-14T23:00:00+01:00',
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: {
              '@type': 'Restaurant',
              name: RESTAURANT_NAME,
              address: { '@type': 'PostalAddress', streetAddress: RESTAURANT_ADDRESS, addressCountry: 'IT' },
              geo: { '@type': 'GeoCoordinates', latitude: 39.8333, longitude: 18.3667 },
            },
            offers: { '@type': 'Offer', name: 'Menu San Valentino', price: '60', priceCurrency: 'EUR', availability: 'https://schema.org/LimitedAvailability', url: `${SITE_URL}/sanvalentino`, validFrom: '2026-01-15T00:00:00+01:00' },
            performer: { '@type': 'Restaurant', name: RESTAURANT_NAME },
            organizer: { '@type': 'Organization', name: RESTAURANT_COMPANY, url: SITE_URL },
            image: [`${SITE_URL}/og-sanvalentino.jpg`],
          }),
        }}
      />
      <Analytics metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} googleAnalyticsId={process.env.NEXT_PUBLIC_GA_ID} />
      {children}
    </>
  );
}
