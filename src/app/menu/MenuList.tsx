'use client';

import { useState, useMemo } from 'react';

type Item = { id: string; name: string; price: number; description: string | null };
type Category = { id: string; name: string; order: number; items: Item[] };

export default function MenuList({ categories }: { categories: Category[] }) {
  const [openId, setOpenId] = useState<string | null>(categories[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            (item.description?.toLowerCase().includes(query) ?? false)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery]);

  if (categories.length === 0) {
    return <p className="text-white/80 text-sm">Nessuna voce in menu.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Refined Search input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-white/50 group-focus-within:text-white/70 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cerca nel menu..."
          className="w-full pl-12 pr-12 py-4 bg-white/20 border border-white/30 rounded-2xl text-gray-900 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 focus:bg-white/30 transition-all duration-300 text-sm backdrop-blur-lg font-light tracking-wide"
          style={{ fontFamily: 'ui-serif, Georgia, serif' }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-all duration-300 hover:scale-110"
            aria-label="Cancella ricerca"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Refined Search results count */}
      {searchQuery && (
        <p className="text-white/60 text-xs font-light tracking-wide" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
          {filteredCategories.length === 0
            ? 'Nessun risultato trovato'
            : `${filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0)} piatti trovati`}
        </p>
      )}

      {/* Elegant Categories list */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <p className="text-white/60 text-sm text-center py-12 font-light" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
            Nessun piatto trovato per &ldquo;{searchQuery}&rdquo;
          </p>
        ) : (
          filteredCategories.map((cat) => {
        const isOpen = searchQuery ? true : openId === cat.id;
        return (
          <section
            key={cat.id}
            className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
              isOpen ? 'border-white/40 shadow-2xl shadow-black/20' : 'border-white/20 shadow-lg shadow-black/10'
            } bg-white/[0.07] backdrop-blur-md hover:border-white/50`}
          >
            <button
              type="button"
              onClick={() => !searchQuery && setOpenId(isOpen ? null : cat.id)}
              className={`w-full flex items-center justify-between gap-3 px-6 py-5 min-h-[56px] text-left font-light text-lg transition-all duration-300 ${
                searchQuery ? 'cursor-default' : 'hover:bg-white/10 active:bg-white/15 touch-manipulation'
              } focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-inset ${
                isOpen ? 'bg-white/10' : ''
              }`}
              aria-expanded={isOpen}
              disabled={!!searchQuery}
              style={{ fontFamily: 'ui-serif, Georgia, serif' }}
            >
              <span className="uppercase text-white tracking-[0.15em] text-base">{cat.name}</span>
              {!searchQuery && (
                <svg
                  className={`w-5 h-5 shrink-0 text-white/70 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
            {isOpen && (
              <ul className="border-t border-white/15 px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {cat.items.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-start gap-4 py-3 border-b border-white/8 last:border-0 transition-all duration-300 hover:bg-white/5 hover:px-2 rounded-lg group"
                    style={{
                      animation: `fadeInItem 0.3s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-white text-base font-normal tracking-wide block mb-1" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>{item.name}</span>
                      {item.description && (
                        <p className="text-white/60 text-xs mt-1.5 leading-relaxed font-light line-clamp-3" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>{item.description}</p>
                      )}
                    </div>
                    <span className="text-white font-light text-base whitespace-nowrap shrink-0 pt-0.5 tracking-wide" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                      € {item.price.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInItem {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
