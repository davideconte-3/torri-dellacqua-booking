'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'booking_view_pin';
const SAN_VALENTINO_DATE = '2026-02-14';

type FilterType = 'all' | 'sanvalentino' | 'other';

export default function PrenotazioniPage() {
  const [pin, setPin] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [bookings, setBookings] = useState<Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    date: string;
    time: string;
    guests: number;
    notes: string | null;
    createdAt: string;
  }> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingsEnabled, setBookingsEnabled] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [closedMessage, setClosedMessage] = useState('Le prenotazioni sono momentaneamente sospese');
  const [editingMessage, setEditingMessage] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const isSanValentino = (date: string) => date === SAN_VALENTINO_DATE;

  const { filteredBookings, sanValentinoCount, otherCount } = useMemo(() => {
    if (!bookings) return { filteredBookings: [], sanValentinoCount: 0, otherCount: 0 };
    const sv = bookings.filter((b) => isSanValentino(b.date));
    const other = bookings.filter((b) => !isSanValentino(b.date));
    let list = bookings;
    if (filter === 'sanvalentino') list = sv;
    else if (filter === 'other') list = other;
    return {
      filteredBookings: list,
      sanValentinoCount: sv.length,
      otherCount: other.length,
    };
  }, [bookings, filter]);

  const fetchSettings = async (pinToUse: string) => {
    try {
      const res = await fetch('/api/settings', {
        headers: { 'X-View-Pin': pinToUse },
      });
      if (res.ok) {
        const data = await res.json();
        setNotificationEmail(data.notificationEmail || '');
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
    }
  };

  const fetchBookings = async (pinToUse: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings', {
        headers: { 'X-View-Pin': pinToUse },
      });
      if (res.status === 401) {
        setBookings(null);
        setPin('');
        setInputPin('');
        sessionStorage.removeItem(STORAGE_KEY);
        setError('PIN errato');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore');
      setBookings(data.bookings);
      setPin(pinToUse);
      setInputPin('');
      sessionStorage.setItem(STORAGE_KEY, pinToUse);

      // Fetch booking status
      fetchBookingStatus();
      // Fetch settings
      fetchSettings(pinToUse);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore di connessione');
      setBookings(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingStatus = async () => {
    try {
      const res = await fetch('/api/bookings/status');
      const data = await res.json();
      setBookingsEnabled(data.enabled);
      if (data.message) {
        setClosedMessage(data.message);
      }
    } catch (e) {
      console.error('Error fetching status:', e);
    }
  };

  const saveEmail = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-View-Pin': pin,
        },
        body: JSON.stringify({ notificationEmail }),
      });

      if (!res.ok) throw new Error('Errore');
      setEditingEmail(false);
      alert('Email salvata!');
    } catch (e) {
      alert('Errore durante il salvataggio');
    }
  };

  const deleteBooking = async (id: string, customerName: string) => {
    if (!confirm(`Eliminare prenotazione di ${customerName}?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'X-View-Pin': pin },
      });

      if (!res.ok) throw new Error('Errore');

      // Ricarica lista
      await fetchBookings(pin);
    } catch (e) {
      alert('Errore durante l\'eliminazione');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleBookings = async () => {
    setToggling(true);
    try {
      const res = await fetch('/api/bookings/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-View-Pin': pin,
        },
        body: JSON.stringify({
          enabled: !bookingsEnabled,
          message: closedMessage
        }),
      });

      if (!res.ok) throw new Error('Errore');

      const data = await res.json();
      setBookingsEnabled(data.enabled);
    } catch (e) {
      alert('Errore durante il cambio stato');
    } finally {
      setToggling(false);
    }
  };

  const saveMessage = async () => {
    try {
      const res = await fetch('/api/bookings/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-View-Pin': pin,
        },
        body: JSON.stringify({
          enabled: bookingsEnabled,
          message: closedMessage
        }),
      });

      if (!res.ok) throw new Error('Errore');
      setEditingMessage(false);
      alert('Messaggio salvato!');
    } catch (e) {
      alert('Errore durante il salvataggio');
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) fetchBookings(stored);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPin.trim()) return;
    fetchBookings(inputPin.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPin('');
    setBookings(null);
    setError(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (bookings !== null && pin) {
    return (
      <main className="min-h-screen bg-slate-100 py-6 sm:py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">Prenotazioni</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {bookings.length} {bookings.length === 1 ? 'prenotazione' : 'prenotazioni'}
                {sanValentinoCount > 0 && otherCount > 0 && (
                  <span className="ml-1">
                    · <span className="text-rose-600 font-medium">{sanValentinoCount}</span> San Valentino, <span className="text-slate-600 font-medium">{otherCount}</span> altre
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleBookings}
                disabled={toggling}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
                  bookingsEnabled
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-600 text-white hover:bg-slate-700'
                } disabled:opacity-50`}
              >
                {toggling ? (
                  <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : bookingsEnabled ? (
                  <span className="size-2.5 rounded-full bg-white/90" title="Aperte" />
                ) : (
                  <span className="size-2.5 rounded-full bg-white/60" title="Chiuse" />
                )}
                {toggling ? '...' : bookingsEnabled ? 'Prenotazioni aperte' : 'Prenotazioni chiuse'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-200 hover:text-slate-800 text-sm font-medium transition-colors"
              >
                Esci
              </button>
            </div>
          </header>

          {/* Settings cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {!bookingsEnabled && (
              <div className="sm:col-span-2 bg-amber-50 border border-amber-200/80 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-amber-900">Messaggio quando prenotazioni chiuse</p>
                    {editingMessage ? (
                      <div className="mt-3 space-y-3">
                        <textarea
                          value={closedMessage}
                          onChange={(e) => setClosedMessage(e.target.value)}
                          className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                          rows={2}
                          placeholder="Es: Le prenotazioni riapriranno a breve..."
                        />
                        <div className="flex gap-2">
                          <button type="button" onClick={saveMessage} className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">Salva</button>
                          <button type="button" onClick={() => setEditingMessage(false)} className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200">Annulla</button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-amber-800">{closedMessage}</p>
                    )}
                  </div>
                  {!editingMessage && (
                    <button type="button" onClick={() => setEditingMessage(true)} className="text-amber-700 hover:text-amber-900 text-sm font-medium shrink-0">Modifica</button>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <span className="text-slate-400">Email notifiche</span>
              </p>
              {editingEmail ? (
                <div className="mt-3 space-y-3">
                  <input
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                    placeholder="email@torridellacqua.it"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={saveEmail} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700">Salva</button>
                    <button type="button" onClick={() => setEditingEmail(false)} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">Annulla</button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex items-start justify-between gap-2">
                  <p className="text-sm text-slate-600 truncate min-w-0">
                    {notificationEmail || <span className="italic text-slate-400">Non configurata</span>}
                  </p>
                  <button type="button" onClick={() => setEditingEmail(true)} className="text-slate-600 hover:text-slate-800 text-sm font-medium shrink-0">Modifica</button>
                </div>
              )}
            </div>
          </div>

          {/* List */}
          {bookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 text-slate-400 mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-slate-600 font-medium">Nessuna prenotazione</p>
              <p className="text-slate-500 text-sm mt-1">Le richieste appariranno qui</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50/50">
                <div className="flex rounded-lg bg-slate-100 p-0.5">
                  {[
                    { key: 'all' as const, label: 'Tutte' },
                    { key: 'sanvalentino' as const, label: 'San Valentino' },
                    { key: 'other' as const, label: 'Altre date' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFilter(key)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        filter === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-slate-500 text-sm">
                  {filteredBookings.length} {filteredBookings.length === 1 ? 'risultato' : 'risultati'}
                </p>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-sm">
                  Nessuna prenotazione con questo filtro.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800 text-slate-100">
                      <tr>
                        <th className="px-4 py-3 font-medium">Tipo</th>
                        <th className="px-4 py-3 font-medium">Nome</th>
                        <th className="px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                        <th className="px-4 py-3 font-medium hidden md:table-cell">Telefono</th>
                        <th className="px-4 py-3 font-medium">Data</th>
                        <th className="px-4 py-3 font-medium">Ora</th>
                        <th className="px-4 py-3 font-medium">Ospiti</th>
                        <th className="px-4 py-3 font-medium hidden lg:table-cell">Note</th>
                        <th className="px-4 py-3 font-medium hidden xl:table-cell">Inviata il</th>
                        <th className="px-4 py-3 font-medium w-20 text-right">Azioni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                                isSanValentino(b.date) ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {isSanValentino(b.date) ? 'San Valentino' : 'Prenotazione'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">{b.customerName}</td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <a href={`mailto:${b.customerEmail}`} className="text-slate-600 hover:text-slate-900 hover:underline truncate block max-w-[180px]">
                              {b.customerEmail}
                            </a>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <a href={`tel:${b.customerPhone.replace(/\s/g, '')}`} className="text-slate-600 hover:text-slate-900">
                              {b.customerPhone}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{formatDate(b.date)}</td>
                          <td className="px-4 py-3 text-slate-700">{b.time}</td>
                          <td className="px-4 py-3 text-slate-700">{b.guests}</td>
                          <td className="px-4 py-3 max-w-[200px] truncate hidden lg:table-cell text-slate-500" title={b.notes || ''}>
                            {b.notes || '–'}
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs hidden xl:table-cell">{formatDateTime(b.createdAt)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => deleteBooking(b.id, b.customerName)}
                              disabled={deletingId === b.id}
                              className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                              title="Elimina prenotazione"
                            >
                              {deletingId === b.id ? (
                                <span className="size-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              )}
                              <span className="hidden sm:inline">Elimina</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 sm:p-10 w-full">
          <div className="flex flex-col items-center text-center mb-8">
            <div
              className="h-20 w-44 bg-slate-800 [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] opacity-95"
              style={{
                maskImage: 'url(/torri-dellacqua-logo.svg)',
                WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)',
              }}
              role="img"
              aria-label="Torri dell'Acqua"
            />
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight mt-6">Prenotazioni</h1>
            <p className="text-slate-500 text-sm mt-1">Area riservata · Inserisci il PIN di accesso</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="pin" className="sr-only">PIN di accesso</label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-center text-lg tracking-[0.4em] font-medium text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/20 focus:outline-none transition-colors"
                maxLength={8}
                autoFocus
                disabled={loading}
                aria-invalid={!!error}
                aria-describedby={error ? 'pin-error' : undefined}
              />
              {error && (
                <p id="pin-error" className="mt-2 text-sm text-red-600 text-center flex items-center justify-center gap-1.5" role="alert">
                  <span className="inline-block w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">!</span>
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !inputPin.trim()}
              className="w-full py-3.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifica in corso...
                </>
              ) : (
                'Accedi'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">Solo personale autorizzato</p>
        </div>

        <Link
          href="/"
          className="mt-6 text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Torna al sito
        </Link>
      </div>
    </main>
  );
}
