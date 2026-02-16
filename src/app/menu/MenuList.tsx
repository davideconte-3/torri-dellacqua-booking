'use client';

import { useState, useMemo, useEffect } from 'react';

type Item = { id: string; name: string; price: number; description: string | null };
type Category = { id: string; name: string; order: number; items: Item[] };

const light = {
  empty: 'text-gray-600',
  searchIcon: 'text-gray-500 group-focus-within:text-gray-700',
  searchInput: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#2563eb]/30 focus:border-[#2563eb]/50 focus:bg-white shadow-sm',
  searchClear: 'text-gray-500 hover:text-gray-800',
  searchCount: 'text-gray-600',
  card: 'border border-gray-200 bg-white text-gray-900 hover:border-gray-300 shadow shadow-gray-200/60',
  cardOpen: 'border border-gray-300 bg-white shadow-md shadow-gray-200/70',
  cardBtn: 'hover:bg-gray-50',
  cardBtnOpen: 'bg-gray-50',
  focusRing: 'focus:ring-gray-300',
  categoryName: 'text-gray-900',
  chevron: 'text-gray-600',
  listBorder: 'border-gray-200',
  item: 'border-gray-100 hover:bg-gray-50/80',
  itemLine: 'bg-[#2563eb]/40',
  itemName: 'text-gray-900 group-hover:text-gray-900',
  itemDesc: 'text-gray-600 group-hover:text-gray-700',
  price: 'text-gray-900',
  priceLine: 'bg-gray-400',
  scrollbarThumb: 'rgba(0,0,0,0.15)',
  scrollbarThumbHover: 'rgba(0,0,0,0.25)',
};
const dark = {
  empty: 'text-white/90',
  searchIcon: 'text-white/70 group-focus-within:text-white',
  searchInput: 'bg-white/[0.08] border-white/30 text-white placeholder-white/65 focus:ring-white/35 focus:border-white/45 focus:bg-white/[0.12] shadow-none',
  searchClear: 'text-white/70 hover:text-white',
  searchCount: 'text-white/80',
  card: 'border-white/25 bg-white/[0.07] hover:border-white/40 shadow-black/15',
  cardOpen: 'border-white/25 bg-white/[0.07] hover:border-white/40 shadow-black/15',
  cardBtn: 'hover:bg-white/[0.06]',
  cardBtnOpen: 'hover:bg-white/[0.06]',
  focusRing: 'focus:ring-white/35',
  categoryName: 'text-white',
  chevron: 'text-white/85',
  listBorder: 'border-white/20',
  item: 'border-white/10 hover:bg-white/[0.05]',
  itemLine: 'bg-white/35',
  itemName: 'text-white group-hover:text-white',
  itemDesc: 'text-white/82 group-hover:text-white/92',
  price: 'text-white',
  priceLine: 'bg-white/35',
  scrollbarThumb: 'rgba(255,255,255,0.25)',
  scrollbarThumbHover: 'rgba(255,255,255,0.38)',
};

export default function MenuList({ categories, isLightTheme = false }: { categories: Category[]; isLightTheme?: boolean }) {
  const c = isLightTheme ? light : dark;
  const [openId, setOpenId] = useState<string | null>(categories[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleCategory = (categoryId: string) => {
    if (searchQuery) return;

    const isCurrentlyOpen = openId === categoryId;

    if (isCurrentlyOpen) {
      // Closing
      setClosingId(categoryId);
      setTimeout(() => {
        setOpenId(null);
        setClosingId(null);
      }, 300); // Match collapse animation duration
    } else {
      // Opening
      setOpenId(categoryId);
    }
  };

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
    return <p className={`${c.empty} text-sm`}>Nessuna voce in menu.</p>;
  }

  return (
    <div className={`space-y-6 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Refined Search input with entrance animation */}
      <div className="relative group animate-slide-down" style={{ animationDelay: '0.1s' }}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className={`h-5 w-5 ${c.searchIcon} transition-all duration-300 group-focus-within:scale-110`}
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
          className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-500 text-sm backdrop-blur-lg font-light tracking-wide focus:shadow-lg focus:scale-[1.02] ${c.searchInput}`}
          style={{ fontFamily: 'ui-serif, Georgia, serif' }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center ${c.searchClear} transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95`}
            aria-label="Cancella ricerca"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Refined Search results count with animation */}
      {searchQuery && (
        <p className={`${c.searchCount} text-xs font-light tracking-wide animate-fade-in`} style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
          {filteredCategories.length === 0
            ? 'Nessun risultato trovato'
            : `${filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0)} piatti trovati`}
        </p>
      )}

      {/* Elegant Categories list */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <p className={`${c.searchCount} text-sm text-center py-12 font-light animate-fade-in`} style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
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
            className={`rounded-2xl overflow-hidden border transition-all duration-500 animate-slide-up backdrop-blur-md ${
              isOpen ? c.cardOpen : c.card
            } hover:shadow-xl`}
            style={{ animationDelay: `${categoryIndex * 0.1 + 0.2}s` }}
          >
            <button
              type="button"
              onClick={() => handleToggleCategory(cat.id)}
              className={`w-full flex items-center justify-between gap-3 px-6 py-5 min-h-[56px] text-left font-light text-lg transition-all duration-500 ${
                searchQuery ? 'cursor-default' : `${c.cardBtn} touch-manipulation hover:pl-7`
              } focus:outline-none focus:ring-2 ${c.focusRing} focus:ring-inset ${
                isOpen ? c.cardBtnOpen : ''
              }`}
              aria-expanded={isOpen}
              disabled={!!searchQuery}
              style={{ fontFamily: 'ui-serif, Georgia, serif' }}
            >
              <span className={`uppercase tracking-[0.15em] text-base transition-all duration-300 hover:tracking-[0.2em] ${c.categoryName}`}>{cat.name}</span>
              {!searchQuery && (
                <svg
                  className={`w-5 h-5 shrink-0 ${c.chevron} transition-all duration-500 ${isOpen ? 'rotate-180 scale-110' : 'group-hover:translate-y-0.5'}`}
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
              <ul className={`border-t ${c.listBorder} px-6 py-4 space-y-2 max-h-[45vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent ${
                isClosing ? 'animate-collapse-up' : 'animate-expand-down'
              }`}>
                {cat.items.map((item, index) => (
                  <li
                    key={item.id}
                    className={`group relative flex justify-between items-start gap-4 py-3 px-3 -mx-3 border-b last:border-0 transition-all duration-500 ${c.item} hover:px-4 hover:-mx-4 rounded-xl hover:shadow-lg`}
                    style={{
                      animation: `fadeInItem 0.4s ease-out ${index * 0.06}s both`
                    }}
                  >
                    {/* Subtle hover indicator line */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 ${c.itemLine} rounded-r-full transition-all duration-500 group-hover:w-1 group-hover:h-8`} />

                    <div className="min-w-0 flex-1 transition-all duration-300 group-hover:translate-x-1">
                      <span className={`text-base font-normal tracking-wide block mb-1 transition-colors duration-300 ${c.itemName}`} style={{ fontFamily: 'ui-serif, Georgia, serif' }}>{item.name}</span>
                      {item.description && (
                        <p className={`text-xs mt-1.5 leading-relaxed font-light line-clamp-3 transition-all duration-300 ${c.itemDesc}`} style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>{item.description}</p>
                      )}
                    </div>
                    <div className="relative shrink-0 pt-0.5">
                      <span className={`${c.price} font-light text-base whitespace-nowrap tracking-wide transition-all duration-500 group-hover:scale-110 group-hover:font-normal inline-block`} style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                        € {item.price.toFixed(2)}
                      </span>
                      <div className={`absolute -bottom-1 left-0 right-0 h-px ${c.priceLine} scale-x-0 transition-transform duration-500 group-hover:scale-x-100`} />
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
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes expand-down {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 45vh;
            transform: translateY(0);
          }
        }

        @keyframes collapse-up {
          from {
            opacity: 1;
            max-height: 45vh;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out both;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .animate-expand-down {
          animation: expand-down 0.4s ease-out;
        }

        .animate-collapse-up {
          animation: collapse-up 0.3s ease-in;
        }

        /* Custom scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          transition: background-color 0.3s ease;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
