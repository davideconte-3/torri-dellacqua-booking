'use client';

import { useState, useMemo, useEffect } from 'react';

type Item = { id: string; name: string; price: number; description: string | null };
type Category = { id: string; name: string; order: number; items: Item[] };

export default function MenuList({ categories }: { categories: Category[] }) {
  const [openId, setOpenId] = useState<string | null>(categories[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
    <div className={`space-y-6 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Refined Search input with entrance animation */}
      <div className="relative group animate-slide-down" style={{ animationDelay: '0.1s' }}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-white/50 group-focus-within:text-white/70 transition-all duration-300 group-focus-within:scale-110"
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
          className="w-full pl-12 pr-12 py-4 bg-white/20 border border-white/30 rounded-2xl text-gray-900 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 focus:bg-white/30 transition-all duration-500 text-sm backdrop-blur-lg font-light tracking-wide focus:shadow-lg focus:shadow-white/10 focus:scale-[1.02]"
          style={{ fontFamily: 'ui-serif, Georgia, serif' }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95"
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
        <p className="text-white/60 text-xs font-light tracking-wide animate-fade-in" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
          {filteredCategories.length === 0
            ? 'Nessun risultato trovato'
            : `${filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0)} piatti trovati`}
        </p>
      )}

      {/* Elegant Categories list */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <p className="text-white/60 text-sm text-center py-12 font-light animate-fade-in" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
            Nessun piatto trovato per &ldquo;{searchQuery}&rdquo;
          </p>
        ) : (
          filteredCategories.map((cat, categoryIndex) => {
        const isOpen = searchQuery ? true : openId === cat.id;
        return (
          <section
            key={cat.id}
            className={`rounded-2xl overflow-hidden border transition-all duration-500 animate-slide-up ${
              isOpen ? 'border-white/40 shadow-2xl shadow-black/20 scale-[1.01]' : 'border-white/20 shadow-lg shadow-black/10'
            } bg-white/[0.07] backdrop-blur-md hover:border-white/50 hover:shadow-xl hover:shadow-black/15`}
            style={{ animationDelay: `${categoryIndex * 0.1 + 0.2}s` }}
          >
            <button
              type="button"
              onClick={() => !searchQuery && setOpenId(isOpen ? null : cat.id)}
              className={`w-full flex items-center justify-between gap-3 px-6 py-5 min-h-[56px] text-left font-light text-lg transition-all duration-500 ${
                searchQuery ? 'cursor-default' : 'hover:bg-white/10 active:bg-white/15 touch-manipulation hover:pl-7'
              } focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-inset ${
                isOpen ? 'bg-white/10' : ''
              }`}
              aria-expanded={isOpen}
              disabled={!!searchQuery}
              style={{ fontFamily: 'ui-serif, Georgia, serif' }}
            >
              <span className="uppercase text-white tracking-[0.15em] text-base transition-all duration-300 hover:tracking-[0.2em]">{cat.name}</span>
              {!searchQuery && (
                <svg
                  className={`w-5 h-5 shrink-0 text-white/70 transition-all duration-500 ${isOpen ? 'rotate-180 scale-110' : 'group-hover:translate-y-0.5'}`}
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
              <ul className="border-t border-white/15 px-6 py-4 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent animate-expand-down">
                {cat.items.map((item, index) => (
                  <li
                    key={item.id}
                    className="group relative flex justify-between items-start gap-4 py-3 px-3 -mx-3 border-b border-white/8 last:border-0 transition-all duration-500 hover:bg-white/5 hover:px-4 hover:-mx-4 rounded-xl hover:shadow-lg hover:shadow-white/5"
                    style={{
                      animation: `fadeInItem 0.4s ease-out ${index * 0.06}s both`
                    }}
                  >
                    {/* Subtle hover indicator line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 bg-white/30 rounded-r-full transition-all duration-500 group-hover:w-1 group-hover:h-8" />

                    <div className="min-w-0 flex-1 transition-all duration-300 group-hover:translate-x-1">
                      <span className="text-white text-base font-normal tracking-wide block mb-1 transition-colors duration-300 group-hover:text-white" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>{item.name}</span>
                      {item.description && (
                        <p className="text-white/60 text-xs mt-1.5 leading-relaxed font-light line-clamp-3 transition-all duration-300 group-hover:text-white/70" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>{item.description}</p>
                      )}
                    </div>
                    <div className="relative shrink-0 pt-0.5">
                      <span className="text-white font-light text-base whitespace-nowrap tracking-wide transition-all duration-500 group-hover:scale-110 group-hover:font-normal inline-block" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                        € {item.price.toFixed(2)}
                      </span>
                      {/* Price underline on hover */}
                      <div className="absolute -bottom-1 left-0 right-0 h-px bg-white/30 scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
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
          }
          to {
            opacity: 1;
            max-height: 70vh;
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
          animation: expand-down 0.5s ease-out;
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
