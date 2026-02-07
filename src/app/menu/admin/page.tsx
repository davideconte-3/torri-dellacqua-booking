'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type MenuItem = { id: string; name: string; price: number; description?: string | null; order: number };
type MenuCategory = { id: string; name: string; order: number; items: MenuItem[] };

export default function MenuAdminPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [pin, setPin] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{type: 'category' | 'item', catIndex: number, itemIndex?: number} | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/menu');
      if (!res.ok) throw new Error('Errore caricamento');
      const data = await res.json();
      setCategories(data.categories || []);
      setHasUnsavedChanges(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    if (!pin.trim()) {
      setError('Inserisci il PIN');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/menu/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-PIN': pin,
        },
        body: JSON.stringify({
          categories: categories.map((c) => ({
            name: c.name,
            order: c.order,
            items: c.items.map((i) => ({
              name: i.name,
              price: i.price,
              description: i.description || null,
              order: i.order,
            })),
          })),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Salvataggio fallito');
      }
      setSaved(true);
      setHasUnsavedChanges(false);
      setTimeout(() => setSaved(false), 3000);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore');
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = (index: number, field: 'name' | 'order', value: string | number) => {
    setHasUnsavedChanges(true);
    setCategories((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const updateItem = (catIndex: number, itemIndex: number, field: 'name' | 'price' | 'description', value: string | number) => {
    setHasUnsavedChanges(true);
    setCategories((prev) => {
      const next = prev.map((c) => ({ ...c, items: [...c.items] }));
      next[catIndex].items[itemIndex] = { ...next[catIndex].items[itemIndex], [field]: value };
      return next;
    });
  };

  const confirmRemoveItem = (catIndex: number, itemIndex: number) => {
    setDeleteConfirm({ type: 'item', catIndex, itemIndex });
  };

  const removeItem = (catIndex: number, itemIndex: number) => {
    setHasUnsavedChanges(true);
    setCategories((prev) => {
      const next = prev.map((c) => ({ ...c, items: [...c.items] }));
      next[catIndex].items.splice(itemIndex, 1);
      return next;
    });
    setDeleteConfirm(null);
  };

  const addItem = (catIndex: number) => {
    setHasUnsavedChanges(true);
    setCategories((prev) => {
      const next = prev.map((c) => ({ ...c, items: [...c.items] }));
      next[catIndex].items.push({
        id: '',
        name: '',
        price: 0,
        description: null,
        order: next[catIndex].items.length,
      });
      return next;
    });
  };

  const confirmRemoveCategory = (index: number) => {
    setDeleteConfirm({ type: 'category', catIndex: index });
  };

  const removeCategory = (index: number) => {
    setHasUnsavedChanges(true);
    setCategories((prev) => prev.filter((_, i) => i !== index));
    setDeleteConfirm(null);
  };

  const addCategory = () => {
    setHasUnsavedChanges(true);
    setCategories((prev) => [...prev, { id: '', name: 'Nuova categoria', order: prev.length, items: [] }]);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1a0a0c] text-rose-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-300/20 border-t-rose-500 rounded-full animate-spin"></div>
          <p className="text-rose-200/60 text-sm">Caricamento menu...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a0a0c] text-rose-100 pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#1a0a0c]/95 backdrop-blur-sm border-b border-rose-300/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-rose-300/90 hover:text-rose-200 text-sm transition-colors"
                aria-label="Torna al menu pubblico"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Menu
              </Link>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-rose-100">Pannello Admin</h1>
                {hasUnsavedChanges && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Non salvato
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !pin.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-rose-500/20"
                aria-label="Salva modifiche al menu"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvataggio...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Salva
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* PIN Section */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-[#2d1515]/80 to-[#1f0f0f]/80 border border-rose-300/20 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <label htmlFor="admin-pin" className="block text-rose-100 font-medium mb-1">
                PIN Amministratore
              </label>
              <p className="text-rose-200/60 text-sm mb-3">
                Inserisci il PIN per autenticare le modifiche al menu.
              </p>
              <input
                id="admin-pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full max-w-xs px-4 py-2.5 rounded-lg bg-black/40 border border-rose-300/30 text-rose-100 placeholder-rose-300/40 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
                placeholder="Inserisci PIN"
                autoComplete="off"
                aria-required="true"
                aria-describedby="pin-description"
              />
              <p id="pin-description" className="sr-only">PIN richiesto per salvare le modifiche</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-400/30 flex items-start gap-3" role="alert">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {saved && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-400/30 flex items-start gap-3" role="alert">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-200 text-sm font-medium">Menu salvato con successo!</p>
          </div>
        )}

        {/* Categories Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-rose-100">Categorie Menu</h2>
            <span className="text-rose-200/60 text-sm">{categories.length} categorie</span>
          </div>

          {categories.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-300/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-rose-200/60 mb-4">Nessuna categoria presente</p>
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600/20 border border-rose-500/30 text-rose-200 hover:bg-rose-600/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Aggiungi prima categoria
              </button>
            </div>
          ) : (
            <>
              {categories.map((cat, ci) => (
                <section
                  key={cat.id || ci}
                  className="bg-gradient-to-br from-[#2d1515]/80 to-[#251313]/80 rounded-xl p-5 border border-rose-300/20 shadow-lg hover:shadow-xl transition-shadow"
                >
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 pb-4 border-b border-rose-300/10">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-300 font-semibold text-sm">
                        {ci + 1}
                      </span>
                      <input
                        value={cat.name}
                        onChange={(e) => updateCategory(ci, 'name', e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-lg bg-black/40 border border-rose-300/30 text-rose-100 font-medium placeholder-rose-300/30 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
                        placeholder="Nome categoria"
                        aria-label={`Nome categoria ${ci + 1}`}
                      />
                    </div>

                    {deleteConfirm?.type === 'category' && deleteConfirm.catIndex === ci ? (
                      <div className="flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-400/30">
                        <span className="text-red-200 text-sm">Confermi?</span>
                        <button
                          type="button"
                          onClick={() => removeCategory(ci)}
                          className="px-2 py-1 rounded bg-red-500/20 text-red-200 hover:bg-red-500/30 text-xs font-medium transition-colors"
                        >
                          Sì
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 rounded bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 text-xs font-medium transition-colors"
                        >
                          Annulla
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => confirmRemoveCategory(ci)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-400/20 text-red-300 hover:bg-red-500/20 hover:border-red-400/30 text-sm transition-colors"
                        aria-label={`Elimina categoria ${cat.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Elimina
                      </button>
                    )}
                  </div>

                  {/* Items List */}
                  {cat.items.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-rose-200/40 text-sm mb-3">Nessuna voce in questa categoria</p>
                    </div>
                  ) : (
                    <ul className="space-y-3 mb-4" role="list">
                      {cat.items.map((item, ii) => (
                        <li
                          key={item.id || ii}
                          className="p-3 rounded-lg bg-black/30 border border-rose-300/10 hover:border-rose-300/20 transition-colors"
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="flex-shrink-0 w-6 h-6 rounded bg-rose-500/10 flex items-center justify-center text-rose-300/60 text-xs font-medium">
                                  {ii + 1}
                                </span>
                                <input
                                  value={item.name}
                                  onChange={(e) => updateItem(ci, ii, 'name', e.target.value)}
                                  placeholder="Nome piatto"
                                  className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-black/40 border border-rose-300/20 text-rose-100 text-sm placeholder-rose-300/30 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                                  aria-label={`Nome piatto ${ii + 1}`}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300/60 text-sm">€</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={item.price || ''}
                                    onChange={(e) => updateItem(ci, ii, 'price', parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                    className="w-24 pl-7 pr-3 py-2 rounded-lg bg-black/40 border border-rose-300/20 text-rose-100 text-sm placeholder-rose-300/30 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                                    aria-label={`Prezzo ${item.name || 'piatto ' + (ii + 1)}`}
                                  />
                                </div>

                                {deleteConfirm?.type === 'item' && deleteConfirm.catIndex === ci && deleteConfirm.itemIndex === ii ? (
                                  <div className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded border border-red-400/30">
                                    <button
                                      type="button"
                                      onClick={() => removeItem(ci, ii)}
                                      className="p-1 rounded bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors"
                                      aria-label="Conferma eliminazione"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeleteConfirm(null)}
                                      className="p-1 rounded bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 transition-colors"
                                      aria-label="Annulla eliminazione"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => confirmRemoveItem(ci, ii)}
                                    className="p-2 rounded-lg bg-red-500/10 border border-red-400/20 text-red-300 hover:bg-red-500/20 hover:border-red-400/30 transition-colors"
                                    aria-label={`Elimina ${item.name || 'piatto'}`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                            <textarea
                              value={item.description || ''}
                              onChange={(e) => updateItem(ci, ii, 'description', e.target.value)}
                              placeholder="Descrizione opzionale (ingredienti, allergeni, note...)"
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-rose-300/20 text-rose-100 text-sm placeholder-rose-300/30 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all resize-none"
                              aria-label={`Descrizione ${item.name || 'piatto ' + (ii + 1)}`}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Add Item Button */}
                  <button
                    type="button"
                    onClick={() => addItem(ci)}
                    className="w-full py-2.5 rounded-lg border border-dashed border-rose-300/30 text-rose-200/80 hover:bg-rose-500/10 hover:border-rose-300/50 text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Aggiungi piatto
                  </button>
                </section>
              ))}

              {/* Add Category Button */}
              <button
                type="button"
                onClick={addCategory}
                className="w-full py-4 rounded-xl border-2 border-dashed border-rose-300/30 text-rose-200/80 hover:bg-rose-500/10 hover:border-rose-300/50 font-medium transition-all inline-flex items-center justify-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center group-hover:bg-rose-500/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                Aggiungi nuova categoria
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal Backdrop */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setDeleteConfirm(null)} aria-hidden="true"></div>
      )}
    </main>
  );
}
