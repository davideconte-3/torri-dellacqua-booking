'use client';

import { useState, useMemo, useEffect, CSSProperties } from 'react';

type Item = { id: string; name: string; price: number; description: string | null };
type Category = { id: string; name: string; order: number; items: Item[] };

function getStyles(isDark: boolean) {
  if (isDark) {
    return {
      searchBg: { backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' } as CSSProperties,
      searchPlaceholderColor: 'rgba(255,255,255,0.6)',
      searchIconColor: 'rgba(255,255,255,0.7)',
      cardBg: { backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' } as CSSProperties,
      categoryColor: { color: '#fff' } as CSSProperties,
      chevronColor: 'rgba(255,255,255,0.85)',
      listBorder: { borderColor: 'rgba(255,255,255,0.25)' } as CSSProperties,
      itemBorder: { borderColor: 'rgba(255,255,255,0.12)' } as CSSProperties,
      itemNameColor: { color: '#fff' } as CSSProperties,
      itemDescColor: { color: 'rgba(255,255,255,0.85)' } as CSSProperties,
      priceColor: { color: '#fff' } as CSSProperties,
      emptyColor: { color: 'rgba(255,255,255,0.9)' } as CSSProperties,
      countColor: { color: 'rgba(255,255,255,0.9)' } as CSSProperties,
      clearColor: 'rgba(255,255,255,0.7)',
      scrollThumb: 'rgba(255,255,255,0.3)',
      scrollThumbHover: 'rgba(255,255,255,0.45)',
    };
  }
  return {
    searchBg: {} as CSSProperties,
    searchPlaceholderColor: '',
    searchIconColor: '',
    cardBg: {} as CSSProperties,
    categoryColor: {} as CSSProperties,
    chevronColor: '',
    listBorder: {} as CSSProperties,
    itemBorder: {} as CSSProperties,
    itemNameColor: {} as CSSProperties,
    itemDescColor: {} as CSSProperties,
    priceColor: {} as CSSProperties,
    emptyColor: {} as CSSProperties,
    countColor: {} as CSSProperties,
    clearColor: '',
    scrollThumb: 'rgba(0,0,0,0.15)',
    scrollThumbHover: 'rgba(0,0,0,0.25)',
  };
}

export default function MenuList({ categories, isLightTheme = false }: { categories: Category[]; isLightTheme?: boolean }) {
  const isDark = !isLightTheme;
  const s = getStyles(isDark);

  const [openId, setOpenId] = useState<string | null>(categories[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleCategory = (categoryId: string) => {
    if (searchQuery) return;
    const isCurrentlyOpen = openId === categoryId;
    if (isCurrentlyOpen) {
      setClosingId(categoryId);
      setTimeout(() => { setOpenId(null); setClosingId(null); }, 300);
    } else {
      setOpenId(categoryId);
    }
  };

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
    return <p className="text-sm" style={isDark ? s.emptyColor : { color: '#4b5563' }}>Nessuna voce in menu.</p>;
  }

  return (
    <div className={`space-y-6 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Search */}
      <div className="relative group animate-slide-down" style={{ animationDelay: '0.1s' }}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 transition-all duration-300 group-focus-within:scale-110"
            style={{ color: isDark ? s.searchIconColor : '#6b7280' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cerca nel menu..."
          className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-500 text-sm font-light tracking-wide focus:shadow-lg focus:scale-[1.02] ${
            isDark ? '' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-300/30 focus:border-blue-400/50 shadow-sm'
          }`}
          style={{
            fontFamily: 'ui-serif, Georgia, serif',
            ...s.searchBg,
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95"
            style={{ color: isDark ? s.clearColor : '#6b7280' }}
            aria-label="Cancella ricerca"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search count */}
      {searchQuery && (
        <p className="text-xs font-light tracking-wide animate-fade-in" style={{ fontFamily: 'ui-serif, Georgia, serif', ...(isDark ? s.countColor : { color: '#4b5563' }) }}>
          {filteredCategories.length === 0
            ? 'Nessun risultato trovato'
            : `${filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0)} piatti trovati`}
        </p>
      )}

      {/* Categories */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <p className="text-sm text-center py-12 font-light animate-fade-in" style={{ fontFamily: 'ui-serif, Georgia, serif', ...(isDark ? s.countColor : { color: '#4b5563' }) }}>
            Nessun piatto trovato per &ldquo;{searchQuery}&rdquo;
          </p>
        ) : (
          filteredCategories.map((cat, categoryIndex) => {
            const isOpen = searchQuery ? true : openId === cat.id;
            const isClosing = closingId === cat.id;
            const shouldShowContent = isOpen || isClosing;

            return (
              <section
                key={cat.id}
                className={`rounded-2xl overflow-hidden border transition-all duration-500 animate-slide-up hover:shadow-xl ${
                  isDark ? '' : (isOpen ? 'border-gray-300 bg-white shadow-md' : 'border-gray-200 bg-white shadow')
                }`}
                style={{
                  animationDelay: `${categoryIndex * 0.1 + 0.2}s`,
                  ...s.cardBg,
                }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between gap-3 px-6 py-5 min-h-[56px] text-left font-light text-lg transition-all duration-500 ${
                    searchQuery ? 'cursor-default' : 'touch-manipulation hover:pl-7'
                  } focus:outline-none`}
                  aria-expanded={isOpen}
                  disabled={!!searchQuery}
                  style={{ fontFamily: 'ui-serif, Georgia, serif' }}
                >
                  <span
                    className="uppercase tracking-[0.15em] text-base transition-all duration-300 hover:tracking-[0.2em]"
                    style={isDark ? s.categoryColor : { color: '#111827' }}
                  >
                    {cat.name}
                  </span>
                  {!searchQuery && (
                    <svg
                      className={`w-5 h-5 shrink-0 transition-all duration-500 ${isOpen ? 'rotate-180 scale-110' : ''}`}
                      style={{ color: isDark ? s.chevronColor : '#4b5563' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                {shouldShowContent && (
                  <ul
                    className={`border-t px-6 py-4 space-y-2 max-h-[45vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent ${
                      isClosing ? 'animate-collapse-up' : 'animate-expand-down'
                    }`}
                    style={isDark ? s.listBorder : { borderColor: '#e5e7eb' }}
                  >
                    {cat.items.map((item, index) => (
                      <li
                        key={item.id}
                        className="group relative flex justify-between items-start gap-4 py-3 px-3 -mx-3 border-b last:border-0 transition-all duration-500 hover:px-4 hover:-mx-4 rounded-xl"
                        style={{
                          animation: `fadeInItem 0.4s ease-out ${index * 0.06}s both`,
                          ...(isDark ? s.itemBorder : { borderColor: '#f3f4f6' }),
                        }}
                      >
                        <div className="min-w-0 flex-1 transition-all duration-300 group-hover:translate-x-1">
                          <span
                            className="text-base font-normal tracking-wide block mb-1 transition-colors duration-300"
                            style={{ fontFamily: 'ui-serif, Georgia, serif', ...(isDark ? s.itemNameColor : { color: '#111827' }) }}
                          >
                            {item.name}
                          </span>
                          {item.description && (
                            <p
                              className="text-xs mt-1.5 leading-relaxed font-light line-clamp-3 transition-all duration-300"
                              style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', ...(isDark ? s.itemDescColor : { color: '#4b5563' }) }}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="relative shrink-0 pt-0.5">
                          <span
                            className="font-light text-base whitespace-nowrap tracking-wide transition-all duration-500 group-hover:scale-110 group-hover:font-normal inline-block"
                            style={{ fontFamily: 'ui-serif, Georgia, serif', ...(isDark ? s.priceColor : { color: '#111827' }) }}
                          >
                            &euro; {item.price.toFixed(2)}
                          </span>
                        </div>
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes expand-down {
          from { opacity: 0; max-height: 0; transform: translateY(-10px); }
          to { opacity: 1; max-height: 45vh; transform: translateY(0); }
        }
        @keyframes collapse-up {
          from { opacity: 1; max-height: 45vh; transform: translateY(0); }
          to { opacity: 0; max-height: 0; transform: translateY(-10px); }
        }
        .animate-slide-down { animation: slide-down 0.6s ease-out both; }
        .animate-slide-up { animation: slide-up 0.6s ease-out both; }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-expand-down { animation: expand-down 0.4s ease-out; }
        .animate-collapse-up { animation: collapse-up 0.3s ease-in; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: ${s.scrollThumb};
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: ${s.scrollThumbHover};
        }
      `}</style>
    </div>
  );
}
