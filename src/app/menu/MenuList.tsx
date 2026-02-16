'use client';

import { useState, useMemo, useEffect, CSSProperties } from 'react';

type Item = { id: string; name: string; price: number; description: string | null };
type Category = { id: string; name: string; order: number; items: Item[] };

interface ThemeColors {
  searchBg: CSSProperties;
  searchIcon: string;
  clearBtn: string;
  countText: CSSProperties;
  cardSection: CSSProperties;
  cardButton: CSSProperties;
  categoryName: CSSProperties;
  chevron: string;
  listUl: CSSProperties;
  itemLi: CSSProperties;
  itemName: CSSProperties;
  itemDesc: CSSProperties;
  itemPrice: CSSProperties;
  scrollThumb: string;
  scrollThumbHover: string;
}

function getTheme(isDark: boolean): ThemeColors {
  if (isDark) {
    const cardBg = '#1e293b';
    return {
      searchBg: { backgroundColor: cardBg, borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' },
      searchIcon: 'rgba(255,255,255,0.7)',
      clearBtn: 'rgba(255,255,255,0.7)',
      countText: { color: 'rgba(255,255,255,0.9)' },
      cardSection: { backgroundColor: cardBg, borderColor: 'rgba(255,255,255,0.3)', borderWidth: '1px', borderStyle: 'solid', color: '#ffffff' },
      cardButton: { backgroundColor: 'transparent', color: '#ffffff' },
      categoryName: { color: '#ffffff' },
      chevron: 'rgba(255,255,255,0.85)',
      listUl: { backgroundColor: cardBg, borderTopColor: 'rgba(255,255,255,0.25)', borderTopWidth: '1px', borderTopStyle: 'solid' as const, color: '#ffffff' },
      itemLi: { borderBottomColor: 'rgba(255,255,255,0.12)', color: '#ffffff' },
      itemName: { color: '#ffffff' },
      itemDesc: { color: 'rgba(255,255,255,0.85)' },
      itemPrice: { color: '#ffffff' },
      scrollThumb: 'rgba(255,255,255,0.3)',
      scrollThumbHover: 'rgba(255,255,255,0.45)',
    };
  }
  return {
    searchBg: { backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#111827' },
    searchIcon: '#6b7280',
    clearBtn: '#6b7280',
    countText: { color: '#4b5563' },
    cardSection: { backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px', borderStyle: 'solid', color: '#111827', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    cardButton: { backgroundColor: 'transparent', color: '#111827' },
    categoryName: { color: '#111827' },
    chevron: '#4b5563',
    listUl: { backgroundColor: '#ffffff', borderTopColor: '#e5e7eb', borderTopWidth: '1px', borderTopStyle: 'solid' as const, color: '#111827' },
    itemLi: { borderBottomColor: '#f3f4f6', color: '#111827' },
    itemName: { color: '#111827' },
    itemDesc: { color: '#4b5563' },
    itemPrice: { color: '#111827' },
    scrollThumb: 'rgba(0,0,0,0.15)',
    scrollThumbHover: 'rgba(0,0,0,0.25)',
  };
}

export default function MenuList({ categories, isLightTheme = false }: { categories: Category[]; isLightTheme?: boolean }) {
  const isDark = !isLightTheme;
  const t = getTheme(isDark);

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
    return <p style={{ ...t.countText, fontSize: '0.875rem' }}>Nessuna voce in menu.</p>;
  }

  return (
    <div style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.7s' }}>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <svg style={{ width: '1.25rem', height: '1.25rem', color: t.searchIcon }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cerca nel menu..."
          className="w-full focus:outline-none focus:ring-2 focus:ring-white/30"
          style={{
            ...t.searchBg,
            fontFamily: 'ui-serif, Georgia, serif',
            paddingLeft: '3rem',
            paddingRight: '3rem',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            borderRadius: '1rem',
            fontSize: '0.875rem',
            fontWeight: 300,
            letterSpacing: '0.025em',
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', top: 0, bottom: 0, right: 0, paddingRight: '1rem', display: 'flex', alignItems: 'center', color: t.clearBtn, background: 'transparent', border: 'none', cursor: 'pointer' }}
            aria-label="Cancella ricerca"
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search count */}
      {searchQuery && (
        <p style={{ ...t.countText, fontSize: '0.75rem', fontWeight: 300, letterSpacing: '0.025em', fontFamily: 'ui-serif, Georgia, serif', marginBottom: '1.5rem' }}>
          {filteredCategories.length === 0
            ? 'Nessun risultato trovato'
            : `${filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0)} piatti trovati`}
        </p>
      )}

      {/* Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredCategories.length === 0 ? (
          <p style={{ ...t.countText, fontSize: '0.875rem', textAlign: 'center', padding: '3rem 0', fontWeight: 300, fontFamily: 'ui-serif, Georgia, serif' }}>
            Nessun piatto trovato per &ldquo;{searchQuery}&rdquo;
          </p>
        ) : (
          filteredCategories.map((cat) => {
            const isOpen = searchQuery ? true : openId === cat.id;
            const isClosing = closingId === cat.id;
            const shouldShowContent = isOpen || isClosing;

            return (
              <section
                key={cat.id}
                style={{
                  ...t.cardSection,
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleCategory(cat.id)}
                  disabled={!!searchQuery}
                  style={{
                    ...t.cardButton,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '1.25rem 1.5rem',
                    minHeight: '56px',
                    textAlign: 'left',
                    fontWeight: 300,
                    fontSize: '1.125rem',
                    border: 'none',
                    cursor: searchQuery ? 'default' : 'pointer',
                    fontFamily: 'ui-serif, Georgia, serif',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ ...t.categoryName, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '1rem', transition: 'all 0.3s' }}>
                    {cat.name}
                  </span>
                  {!searchQuery && (
                    <svg
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        flexShrink: 0,
                        color: t.chevron,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.4s ease',
                      }}
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
                  <ul style={{
                    ...t.listUl,
                    padding: '1rem 1.5rem',
                    margin: 0,
                    listStyle: 'none',
                    maxHeight: '45vh',
                    overflowY: 'auto',
                    animation: isClosing ? 'collapseUp 0.3s ease-in forwards' : 'expandDown 0.4s ease-out',
                  }}>
                    {cat.items.map((item) => (
                      <li
                        key={item.id}
                        style={{
                          ...t.itemLi,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          padding: '0.75rem 0',
                          borderBottomWidth: '1px',
                          borderBottomStyle: 'solid',
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <span style={{ ...t.itemName, fontFamily: 'ui-serif, Georgia, serif', fontSize: '1rem', fontWeight: 400, letterSpacing: '0.025em', display: 'block', marginBottom: '0.25rem' }}>
                            {item.name}
                          </span>
                          {item.description && (
                            <p style={{ ...t.itemDesc, fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '0.75rem', marginTop: '0.375rem', lineHeight: 1.6, fontWeight: 300, margin: '0.375rem 0 0 0' }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span style={{ ...t.itemPrice, fontFamily: 'ui-serif, Georgia, serif', fontSize: '1rem', fontWeight: 300, letterSpacing: '0.025em', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          &euro; {item.price.toFixed(2)}
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
        @keyframes expandDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 45vh; }
        }
        @keyframes collapseUp {
          from { opacity: 1; max-height: 45vh; }
          to { opacity: 0; max-height: 0; }
        }
        ul::-webkit-scrollbar { width: 6px; }
        ul::-webkit-scrollbar-track { background: transparent; }
        ul::-webkit-scrollbar-thumb { background-color: ${t.scrollThumb}; border-radius: 3px; }
        ul::-webkit-scrollbar-thumb:hover { background-color: ${t.scrollThumbHover}; }
      `}</style>
    </div>
  );
}
