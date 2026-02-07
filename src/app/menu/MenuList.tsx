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
    return <p className="text-[#49738C]/80 text-sm">Nessuna voce in menu.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-[#49738C]"
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
          className="w-full pl-10 pr-10 py-3 bg-[#162228] border border-[#49738C]/30 rounded-xl text-[#e8eef1] placeholder-[#49738C]/60 focus:outline-none focus:ring-2 focus:ring-[#ff8b42]/50 focus:border-[#ff8b42]/50 transition-all text-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#49738C] hover:text-[#ff8b42] transition-colors"
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
        <p className="text-[#49738C]/80 text-xs">
          {filteredCategories.length === 0
            ? 'Nessun risultato trovato'
            : `${filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0)} risultati trovati`}
        </p>
      )}

      {/* Categories list */}
      <div className="space-y-2.5">
        {filteredCategories.length === 0 ? (
          <p className="text-[#49738C]/80 text-sm text-center py-8">
            Nessun piatto trovato per &ldquo;{searchQuery}&rdquo;
          </p>
        ) : (
          filteredCategories.map((cat) => {
        const isOpen = searchQuery ? true : openId === cat.id;
        return (
          <section
            key={cat.id}
            className={`rounded-xl overflow-hidden border transition-all ${
              isOpen ? 'border-[#ff8b42]/40 shadow-md' : 'border-[#49738C]/25 shadow-sm'
            } bg-[#162228]`}
          >
            <button
              type="button"
              onClick={() => !searchQuery && setOpenId(isOpen ? null : cat.id)}
              className={`w-full flex items-center justify-between gap-2 px-4 py-3.5 min-h-[48px] text-left font-semibold text-base transition-all ${
                searchQuery ? 'cursor-default' : 'hover:bg-[#49738C]/15 touch-manipulation'
              } focus:outline-none focus:ring-2 focus:ring-[#ff8b42]/50 focus:ring-inset rounded-xl ${
                isOpen ? 'bg-[#49738C]/10' : ''
              }`}
              aria-expanded={isOpen}
              disabled={!!searchQuery}
            >
              <span className={`uppercase ${isOpen ? 'text-[#ff8b42]' : 'text-[#e8eef1]'}`}>{cat.name}</span>
              {!searchQuery && (
                <svg
                  className={`w-5 h-5 shrink-0 text-[#ff8b42] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
            {isOpen && (
              <ul className="border-t border-[#49738C]/20 px-4 py-3 space-y-2.5 max-h-[65vh] overflow-y-auto">
                {cat.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-baseline gap-3 py-2 border-b border-[#49738C]/10 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[#e8eef1] text-sm">{item.name}</span>
                      {item.description && (
                        <p className="text-[#49738C]/70 text-xs mt-0.5 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    <span className="text-[#ff8b42] font-medium whitespace-nowrap shrink-0">
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
