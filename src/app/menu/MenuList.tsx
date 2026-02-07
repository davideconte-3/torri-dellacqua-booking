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
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cerca nel menu..."
          className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-sm backdrop-blur-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors"
            aria-label="Cancella ricerca"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search results count */}
      {searchQuery && (
        <p className="text-white/70 text-xs">
          {filteredCategories.length === 0
            ? 'Nessun risultato trovato'
            : `${filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0)} risultati trovati`}
        </p>
      )}

      {/* Categories list */}
      <div className="space-y-2.5">
        {filteredCategories.length === 0 ? (
          <p className="text-white/70 text-sm text-center py-8">
            Nessun piatto trovato per &ldquo;{searchQuery}&rdquo;
          </p>
        ) : (
          filteredCategories.map((cat) => {
        const isOpen = searchQuery ? true : openId === cat.id;
        return (
          <section
            key={cat.id}
            className={`rounded-xl overflow-hidden border transition-all ${
              isOpen ? 'border-white/50 shadow-lg' : 'border-white/25 shadow-md'
            } bg-white/10 backdrop-blur-sm`}
          >
            <button
              type="button"
              onClick={() => !searchQuery && setOpenId(isOpen ? null : cat.id)}
              className={`w-full flex items-center justify-between gap-2 px-4 py-3.5 min-h-[48px] text-left font-semibold text-base transition-all ${
                searchQuery ? 'cursor-default' : 'hover:bg-white/15 touch-manipulation'
              } focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-inset rounded-xl ${
                isOpen ? 'bg-white/15' : ''
              }`}
              aria-expanded={isOpen}
              disabled={!!searchQuery}
            >
              <span className="uppercase text-white">{cat.name}</span>
              {!searchQuery && (
                <svg
                  className={`w-5 h-5 shrink-0 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
            {isOpen && (
              <ul className="border-t border-white/20 px-4 py-3 space-y-2.5 max-h-[65vh] overflow-y-auto">
                {cat.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-baseline gap-3 py-2 border-b border-white/10 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-white text-sm font-medium">{item.name}</span>
                      {item.description && (
                        <p className="text-white/70 text-xs mt-0.5 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    <span className="text-white font-bold whitespace-nowrap shrink-0">
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
    </div>
  );
}
