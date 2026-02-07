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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/menu');
      if (!res.ok) throw new Error('Errore caricamento');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
      setTimeout(() => setSaved(false), 3000);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore');
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = (index: number, field: 'name' | 'order', value: string | number) => {
    setCategories((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const updateItem = (catIndex: number, itemIndex: number, field: 'name' | 'price' | 'description', value: string | number) => {
    setCategories((prev) => {
      const next = prev.map((c) => ({ ...c, items: [...c.items] }));
      next[catIndex].items[itemIndex] = { ...next[catIndex].items[itemIndex], [field]: value };
      return next;
    });
  };

  const removeItem = (catIndex: number, itemIndex: number) => {
    setCategories((prev) => {
      const next = prev.map((c) => ({ ...c, items: [...c.items] }));
      next[catIndex].items.splice(itemIndex, 1);
      return next;
    });
  };

  const addItem = (catIndex: number) => {
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

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    setCategories((prev) => [...prev, { id: '', name: 'Nuova categoria', order: prev.length, items: [] }]);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1a0a0c] text-rose-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">Caricamento...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a0a0c] text-rose-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/menu" className="text-rose-300/90 hover:text-rose-200 text-sm">
            ← Torna al menu
          </Link>
        </div>
        <h1 className="text-xl font-semibold text-rose-100 mb-2">Modifica menu</h1>
        <p className="text-rose-200/60 text-sm mb-4">
          Inserisci il PIN admin e modifica le voci. Salva per applicare.
        </p>
        <div className="mb-6">
          <label className="block text-rose-200/80 text-sm mb-1">PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full max-w-xs px-3 py-2 rounded-lg bg-black/30 border border-rose-300/20 text-rose-100"
            placeholder="PIN"
          />
        </div>
        {error && (
          <p className="text-red-300 text-sm mb-4">{error}</p>
        )}
        {saved && (
          <p className="text-green-300 text-sm mb-4">Menu salvato.</p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mb-8 px-4 py-2 rounded-lg bg-rose-700 text-white text-sm font-medium hover:bg-rose-600 disabled:opacity-50"
        >
          {saving ? 'Salvataggio...' : 'Salva menu'}
        </button>

        <div className="space-y-8">
          {categories.map((cat, ci) => (
            <section key={cat.id || ci} className="bg-[#2d1515]/80 rounded-xl p-4 border border-rose-300/20">
              <div className="flex gap-2 items-center mb-3">
                <input
                  value={cat.name}
                  onChange={(e) => updateCategory(ci, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-rose-300/20 text-rose-100 font-medium"
                />
                <button
                  type="button"
                  onClick={() => removeCategory(ci)}
                  className="text-rose-300/70 hover:text-red-300 text-sm"
                >
                  Elimina categoria
                </button>
              </div>
              <ul className="space-y-2">
                {cat.items.map((item, ii) => (
                  <li key={item.id || ii} className="flex flex-wrap gap-2 items-start p-2 rounded-lg bg-black/20">
                    <input
                      value={item.name}
                      onChange={(e) => updateItem(ci, ii, 'name', e.target.value)}
                      placeholder="Nome"
                      className="flex-1 min-w-[120px] px-2 py-1.5 rounded bg-black/30 border border-rose-300/20 text-rose-100 text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price || ''}
                      onChange={(e) => updateItem(ci, ii, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="Prezzo"
                      className="w-20 px-2 py-1.5 rounded bg-black/30 border border-rose-300/20 text-rose-100 text-sm"
                    />
                    <input
                      value={item.description || ''}
                      onChange={(e) => updateItem(ci, ii, 'description', e.target.value)}
                      placeholder="Descrizione (opzionale)"
                      className="w-full px-2 py-1.5 rounded bg-black/30 border border-rose-300/20 text-rose-100 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(ci, ii)}
                      className="text-rose-300/70 hover:text-red-300 text-sm"
                    >
                      Elimina
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => addItem(ci)}
                className="mt-2 text-rose-300/90 hover:text-rose-200 text-sm"
              >
                + Aggiungi voce
              </button>
            </section>
          ))}
          <button
            type="button"
            onClick={addCategory}
            className="w-full py-2 rounded-lg border border-dashed border-rose-300/40 text-rose-200/80 hover:bg-rose-900/30 text-sm"
          >
            + Aggiungi categoria
          </button>
        </div>
      </div>
    </main>
  );
}
