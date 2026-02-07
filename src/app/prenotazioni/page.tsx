'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'booking_view_pin';

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
      <main className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Prenotazioni</h1>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={toggleBookings}
                  disabled={toggling}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    bookingsEnabled
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  } disabled:opacity-50`}
                >
                  {toggling ? '...' : bookingsEnabled ? '✓ Prenotazioni Aperte' : '✕ Prenotazioni Chiuse'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Esci
                </button>
              </div>
            </div>

            {/* Messaggio personalizzato quando chiuse */}
            {!bookingsEnabled && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Messaggio visualizzato quando prenotazioni chiuse:
                </label>
                {editingMessage ? (
                  <div className="space-y-2">
                    <textarea
                      value={closedMessage}
                      onChange={(e) => setClosedMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Es: Le prenotazioni riapriranno a breve..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveMessage}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Salva
                      </button>
                      <button
                        onClick={() => setEditingMessage(false)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-gray-700 text-sm flex-1">{closedMessage}</p>
                    <button
                      onClick={() => setEditingMessage(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium whitespace-nowrap"
                    >
                      Modifica
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
              Nessuna prenotazione ancora.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="p-3 font-medium">Nome</th>
                      <th className="p-3 font-medium hidden sm:table-cell">Email</th>
                      <th className="p-3 font-medium hidden md:table-cell">Telefono</th>
                      <th className="p-3 font-medium">Data</th>
                      <th className="p-3 font-medium">Ora</th>
                      <th className="p-3 font-medium">Ospiti</th>
                      <th className="p-3 font-medium hidden lg:table-cell">Note</th>
                      <th className="p-3 font-medium hidden xl:table-cell">Inviata il</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900">{b.customerName}</td>
                        <td className="p-3 hidden sm:table-cell">
                          <a href={`mailto:${b.customerEmail}`} className="text-blue-600 hover:underline">
                            {b.customerEmail}
                          </a>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <a href={`tel:${b.customerPhone.replace(/\s/g, '')}`} className="text-gray-700">
                            {b.customerPhone}
                          </a>
                        </td>
                        <td className="p-3">{formatDate(b.date)}</td>
                        <td className="p-3">{b.time}</td>
                        <td className="p-3">{b.guests}</td>
                        <td className="p-3 max-w-[180px] truncate hidden lg:table-cell text-gray-600" title={b.notes || ''}>
                          {b.notes || '–'}
                        </td>
                        <td className="p-3 text-gray-500 text-xs hidden xl:table-cell">{formatDateTime(b.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Visualizza prenotazioni</h1>
        <p className="text-gray-600 text-sm mb-6">Inserisci il PIN di accesso</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="PIN"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-800 focus:outline-none text-center text-lg tracking-widest"
            maxLength={8}
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading || !inputPin.trim()}
            className="w-full mt-4 bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifica...' : 'Accedi'}
          </button>
        </form>
      </div>
    </main>
  );
}
