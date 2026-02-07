import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import CookieBanner from '@/components/CookieBanner';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'San Valentino - La Cena | Torri Dell\'Acqua',
  description: 'Prenota la tua cena di San Valentino al ristorante Torri dell\'Acqua - Sabato 14 Febbraio',
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 5 },
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
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
