import { prisma } from '@/lib/db';
import type { Metadata } from 'next';
import MenuList from './MenuList';

export const metadata: Metadata = {
  title: 'Menu | Torri Dell\'Acqua',
  description: 'Menu del ristorante Torri dell\'Acqua - Castrignano del Capo',
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

const MENU_NOTE = 'coperto 3,50€ - terrazza 5,00€';

const RESTAURANT = {
  name: "Torri dell'Acqua",
  address: "Via Dante Alighieri n. 8, 73040 Castrignano del Capo (LE)",
  addressUrl: "https://www.google.com/maps/search/?api=1&query=Via+Dante+Alighieri+8+Castrignano+del+Capo+LE",
  phone: "+39 080 123 4567",
  email: "info@torridellacqua.it",
  instagram: "https://www.instagram.com/torridellacqua_restaurant/",
  instagramHandle: "@torridellacqua_restaurant",
};

export default async function MenuPage() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { order: 'asc' },
    include: { items: { orderBy: { order: 'asc' } } },
  });

  return (
    <main className="min-h-screen bg-[#0f181d] text-[#e8eef1] py-5 px-4 pb-8">
      <div className="max-w-xl mx-auto flex flex-col min-h-screen">
        <header className="flex flex-col items-center mt-4 mb-6">
          <div
            className="h-24 w-48 bg-white [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
            style={{ maskImage: 'url(/torri-dellacqua-logo.svg)', WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)' }}
            role="img"
            aria-label="Torri dell'Acqua"
          />
          <h1 className="text-xl font-semibold text-[#e8eef1] mt-3">Menu</h1>
          <p className="text-[#49738C]/90 text-xs mt-1">{MENU_NOTE}</p>
        </header>
        <div className="flex-1">
          <MenuList categories={categories} />
        </div>
        <footer className="mt-12 pt-8 border-t border-[#49738C]/20">
          <div className="flex flex-col items-center text-center">
            <div
              className="h-16 w-36 bg-[#49738C]/90 [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] mb-4"
              style={{ maskImage: 'url(/torri-dellacqua-logo.svg)', WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)' }}
              role="img"
              aria-label="Torri dell'Acqua"
            />
            <address className="not-italic text-[#49738C]/90 text-sm space-y-1.5 mb-4">
              <a
                href={RESTAURANT.addressUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-[#ff8b42] transition-colors"
              >
                {RESTAURANT.address}
              </a>
              <div className="flex justify-center gap-3 text-xs">
                <a href={`tel:${RESTAURANT.phone.replace(/\s/g, '')}`} className="hover:text-[#ff8b42] transition-colors">
                  {RESTAURANT.phone}
                </a>
                <span className="text-[#49738C]/40">·</span>
                <a href={`mailto:${RESTAURANT.email}`} className="hover:text-[#ff8b42] transition-colors">
                  {RESTAURANT.email}
                </a>
              </div>
            </address>
            <a
              href={RESTAURANT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#49738C]/30 text-[#49738C] text-sm hover:bg-[#49738C]/10 hover:text-[#ff8b42] transition-all"
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.281.261 2.15.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.281-.06 2.15-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.281-.262-2.15-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63 19.095.333 18.225.131 16.947.072 15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.897 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              {RESTAURANT.instagramHandle}
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
