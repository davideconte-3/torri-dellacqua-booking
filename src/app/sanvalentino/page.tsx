'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { analytics } from '@/components/Analytics';
import Credits from '@/components/Credits';

const SAN_VALENTINO_DATE = '2026-02-14';

// Restaurant info from environment variables
const RESTAURANT = {
  companyName: process.env.NEXT_PUBLIC_RESTAURANT_COMPANY_NAME || "TORRI DELL'ACQUA S.R.L.",
  address: process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS || "Via Dante Alighieri n. 8, 73040 Castrignano del Capo (LE)",
  addressUrl: process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS)}`
    : "https://www.google.com/maps/search/?api=1&query=Via+Dante+Alighieri+8+Castrignano+del+Capo+LE",
  piva: process.env.NEXT_PUBLIC_RESTAURANT_PIVA || "05375440756",
  phone: process.env.NEXT_PUBLIC_RESTAURANT_PHONE || "+39 0833 123456",
  email: process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || "info@torridellacqua.it",
  instagram: process.env.NEXT_PUBLIC_RESTAURANT_INSTAGRAM || "https://www.instagram.com/torridellacqua_restaurant/",
  instagramHandle: process.env.NEXT_PUBLIC_RESTAURANT_INSTAGRAM_HANDLE || "@torridellacqua_restaurant",
};

export default function SanValentinoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingsEnabled, setBookingsEnabled] = useState(true);
  const [bookingsMessage, setBookingsMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    time: '',
    guests: '2',
    notes: '',
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      window.scrollTo(0, 0);
    }
  }, [showSuccess]);

  // Track page engagement & check booking status
  useEffect(() => {
    analytics.viewContent('San Valentino Booking Page', 'Valentine Dinner');

    // Check if bookings are enabled
    fetch('/api/bookings/status')
      .then(res => res.json())
      .then(data => {
        setBookingsEnabled(data.enabled);
        if (!data.enabled) {
          setBookingsMessage(data.message || 'Le prenotazioni sono chiuse');
        }
      })
      .catch(() => {
        // Fail open - allow bookings if check fails
        setBookingsEnabled(true);
      });
  }, []);

  // Form auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('booking_draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        // Ignore invalid data
      }
    }
  }, []);

  useEffect(() => {
    // Save form data on change
    const timeoutId = setTimeout(() => {
      if (formData.customerName || formData.customerEmail) {
        localStorage.setItem('booking_draft', JSON.stringify(formData));
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [showMenu]);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMenu(false);
    };
    if (showMenu) {
      window.addEventListener('keydown', onEscape);
      return () => window.removeEventListener('keydown', onEscape);
    }
  }, [showMenu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!privacyAccepted) {
      setError('Per inviare la prenotazione devi accettare l\'informativa sulla privacy.');
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: SAN_VALENTINO_DATE,
          source: 'sanvalentino',
          privacyConsent: privacyAccepted,
          marketingConsent,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const guests = parseInt(formData.guests || '2', 10);
        const value = 60 * guests;
        analytics.lead(value, guests);
        setShowSuccess(true);
        // Clear localStorage after successful booking
        localStorage.removeItem('booking_draft');
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          time: '',
          guests: '2',
          notes: '',
        });
        setPrivacyAccepted(false);
        setMarketingConsent(false);
      } else {
        setError(data.error || 'Qualcosa è andato storto. Riprova.');
      }
    } catch {
      setError('Controlla la connessione e riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <main className="min-h-screen relative flex items-center justify-center p-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="/wallpaper.png"
            alt="Background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 bg-[#3d1a1a]/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center border border-rose-300/20">
          <div
            className="h-16 w-32 mx-auto mb-6 bg-[rgb(254_205_211/0.8)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
            style={{ maskImage: 'url(/torri-dellacqua-logo.svg)', WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)' }}
            role="img"
            aria-label="Torri dell'acqua"
          />
          <div className="w-20 h-20 bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-rose-300/30">
            <svg className="w-10 h-10 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif text-rose-200 mb-4">Prenotazione Inviata</h1>
          <p className="text-rose-100/80 mb-8">
            Riceverai conferma della prenotazione via email.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="bg-rose-800 text-rose-100 px-8 py-3 rounded-full font-medium hover:bg-rose-700 transition-all border border-rose-300/30"
          >
            Nuova Prenotazione
          </button>
        </div>
      </main>
    );
  }

  const handlePrenotaClick = () => {
    analytics.customEvent('cta_click', { location: 'hero_prenota' });
    setShowForm(true);
  };

  return (
    <main className="min-h-screen relative">
      {/* Hero Section - Fullscreen */}
      {!showForm && (
      <section className="min-h-screen relative flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/wallpaper.png"
            alt="Background"
            fill
            className="object-cover brightness-110"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-16">
          {/* 1. LOGO RISTORANTE - Primario */}
          <div
            className="h-24 md:h-28 w-48 md:w-56 mx-auto [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] drop-shadow-2xl"
            style={{
              maskImage: 'url(/torri-dellacqua-logo.svg)',
              WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)',
              backgroundColor: '#D495A0'
            }}
            role="img"
            aria-label="Torri dell'Acqua"
          />

          {/* 2. TITOLO SAN VALENTINO - Secondario */}
          <div className="flex justify-center">
            <img
              src="/sanvalentino-title.svg"
              alt="San Valentino"
              className="h-24 md:h-32 w-auto drop-shadow-2xl"
            />
          </div>

          {/* 3. INFO - Terziario */}
          <div className="space-y-3">
            <p className="text-white/90 text-sm md:text-base font-medium tracking-widest uppercase">
              Sabato 14 Febbraio 2026
            </p>
            <p className="text-white/70 text-base md:text-lg">
              Menu Degustazione · 60€
            </p>
          </div>

          {/* 4. CTA - DOMINANTE */}
          <div className="pt-8">
            {bookingsEnabled ? (
              <button
                onClick={handlePrenotaClick}
                className="bg-white text-rose-900 py-6 px-20 rounded-full font-bold text-2xl md:text-3xl hover:bg-white/90 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 shadow-2xl hover:shadow-white/40 min-h-[80px] touch-manipulation"
              >
                Prenota
              </button>
            ) : (
              <div className="text-center space-y-4">
                <div className="inline-block bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-8 py-6">
                  <p className="text-white text-lg md:text-xl font-semibold">
                    {bookingsMessage}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 5. LINK SECONDARIO - Minimo */}
          <button
            type="button"
            onClick={() => {
              setShowMenu(true);
              analytics.customEvent('view_menu', { location: 'hero' });
            }}
            className="inline-block text-white/60 text-sm hover:text-white/90 transition-colors underline underline-offset-4 touch-manipulation"
          >
            Vedi il menu
          </button>
        </div>
      </section>
      )}

      {/* Menu Modal */}
      {showMenu && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 animate-in"
          role="dialog"
          aria-modal="true"
          aria-label="Menu San Valentino"
        >
          <div className="flex-none flex justify-end items-start p-4">
            <button
              type="button"
              onClick={() => setShowMenu(false)}
              className="p-3 -m-2 rounded-full text-rose-200/90 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
              aria-label="Chiudi menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div
            className="flex-1 min-h-0 overflow-auto overscroll-contain -mt-14 pt-14"
            onClick={() => setShowMenu(false)}
          >
            <div
              className="flex justify-center p-4 pb-12 min-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/menu-sanvalentino.jpeg"
                alt="Menu cena San Valentino"
                className="max-w-full h-auto rounded-lg shadow-2xl w-full"
                draggable={false}
              />
            </div>
          </div>
          <p className="flex-none text-center text-rose-200/50 text-xs pb-8 pt-2">
            Chiudi con X o toccando fuori dal menu
          </p>
        </div>
      )}

      {/* Form Section */}
      {showForm && (
      <section className="min-h-screen relative py-8 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="/wallpaper.png"
            alt="Background"
            fill
            className="object-cover brightness-110"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto">
          {/* Logo e Titolo */}
          <div className="text-center mb-12 space-y-6">
            <div
              className="h-16 md:h-20 w-32 md:w-40 mx-auto [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] drop-shadow-2xl"
              style={{
                maskImage: 'url(/torri-dellacqua-logo.svg)',
                WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)',
                backgroundColor: '#D495A0'
              }}
              role="img"
              aria-label="Torri dell'Acqua"
            />
            <div className="flex justify-center">
              <img
                src="/sanvalentino-title.svg"
                alt="San Valentino"
                className="h-16 md:h-20 w-auto drop-shadow-xl"
              />
            </div>
          </div>

        <form ref={formRef} onSubmit={handleSubmit} className="bg-[#3d1a1a]/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 space-y-5 border border-rose-300/20">
          <p className="text-rose-200/80 text-sm text-center -mt-1 mb-1">
            Sabato 14 febbraio 2026 · Compila e invia
          </p>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-rose-200/90 mb-1.5">Nome</label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={formData.customerName}
              onChange={(e) => {
                setFormData({ ...formData, customerName: e.target.value });
                if (e.target.value && !formData.customerEmail) {
                  analytics.initiateCheckout();
                }
              }}
              onFocus={() => analytics.customEvent('form_field_focus', { field: 'name' })}
              className="w-full px-4 py-3.5 rounded-xl bg-black/30 border-2 border-rose-300/20 text-rose-100 placeholder-rose-300/40 focus:border-rose-300/60 focus:outline-none focus:ring-2 focus:ring-rose-300/20 transition-colors min-h-[48px]"
              placeholder="Come ti chiami?"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-rose-200/90 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={formData.customerEmail}
              onChange={(e) => {
                setFormData({ ...formData, customerEmail: e.target.value });
                if (e.target.value.includes('@')) {
                  analytics.addToCart(60 * parseInt(formData.guests || '2'));
                }
              }}
              onFocus={() => analytics.customEvent('form_field_focus', { field: 'email' })}
              className="w-full px-4 py-3.5 rounded-xl bg-black/30 border-2 border-rose-300/20 text-rose-100 placeholder-rose-300/40 focus:border-rose-300/60 focus:outline-none focus:ring-2 focus:ring-rose-300/20 transition-colors min-h-[48px]"
              placeholder="Per la conferma"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-rose-200/90 mb-1.5">Telefono</label>
            <input
              id="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="numeric"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-black/30 border-2 border-rose-300/20 text-rose-100 placeholder-rose-300/40 focus:border-rose-300/60 focus:outline-none focus:ring-2 focus:ring-rose-300/20 transition-colors min-h-[48px]"
              placeholder="333 1234567"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-rose-200/90 mb-1.5">Ora</label>
              <select
                id="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-black/30 border-2 border-rose-300/20 text-rose-100 focus:border-rose-300/60 focus:outline-none focus:ring-2 focus:ring-rose-300/20 transition-colors min-h-[48px]"
              >
                <option value="" className="bg-[#3d1a1a]">Scegli orario</option>
                <option value="19:00" className="bg-[#3d1a1a]">19:00</option>
                <option value="19:30" className="bg-[#3d1a1a]">19:30</option>
                <option value="20:00" className="bg-[#3d1a1a]">20:00</option>
                <option value="20:30" className="bg-[#3d1a1a]">20:30</option>
                <option value="21:00" className="bg-[#3d1a1a]">21:00</option>
                <option value="21:30" className="bg-[#3d1a1a]">21:30</option>
                <option value="22:00" className="bg-[#3d1a1a]">22:00</option>
              </select>
            </div>
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-rose-200/90 mb-1.5">Ospiti</label>
              <select
                id="guests"
                required
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-black/30 border-2 border-rose-300/20 text-rose-100 focus:border-rose-300/60 focus:outline-none focus:ring-2 focus:ring-rose-300/20 transition-colors min-h-[48px]"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num} className="bg-[#3d1a1a]">
                    {num} {num === 1 ? 'persona' : 'persone'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-rose-200/90 mb-1.5">Note <span className="text-rose-300/50 font-normal">(opzionale)</span></label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border-2 border-rose-300/20 text-rose-100 placeholder-rose-300/40 focus:border-rose-300/60 focus:outline-none focus:ring-2 focus:ring-rose-300/20 transition-colors resize-none min-h-[72px]"
              placeholder="Allergie, richieste speciali..."
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setPrivacyAccepted(checked);
                  setMarketingConsent(checked);
                }}
                className="mt-1 w-5 h-5 rounded border-2 border-[#D495A0]/50 bg-black/20 checked:bg-[#D495A0] checked:border-[#D495A0] focus:ring-2 focus:ring-[#D495A0]/50 transition-all cursor-pointer"
                style={{ accentColor: '#D495A0' }}
              />
              <span className="text-rose-200/90 text-sm leading-relaxed">
                Accetto l&apos;<a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#D495A0] underline underline-offset-2 hover:text-rose-100">informativa sulla privacy</a> e il trattamento dei miei dati per la gestione della prenotazione. <span className="text-[#D495A0]">*</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-[#D495A0]/50 bg-black/20 checked:bg-[#D495A0] checked:border-[#D495A0] focus:ring-2 focus:ring-[#D495A0]/50 transition-all cursor-pointer"
                style={{ accentColor: '#D495A0' }}
              />
              <span className="text-rose-200/80 text-sm leading-relaxed">
                Acconsento all&apos;uso dei miei dati (email e telefono) per invio di comunicazioni promozionali, newsletter e aggiornamenti su eventi del ristorante. Facoltativo.
              </span>
            </label>
          </div>

          {error && (
            <p className="text-rose-200 bg-rose-900/40 rounded-xl px-4 py-3 text-sm" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !privacyAccepted}
            className="w-full border-2 border-white text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-white hover:text-rose-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3d1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 min-h-[52px] touch-manipulation shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Invio in corso...' : 'Prenota'}
          </button>

          <p className="text-xs text-center text-rose-200/50">
            Conferma via email
          </p>
        </form>

        <footer className="mt-12 space-y-8">
          <div className="bg-[#3d1a1a]/90 backdrop-blur-sm rounded-2xl p-6 border border-rose-300/20">
            <div
              className="h-28 md:h-36 w-48 md:w-64 mx-auto bg-[rgb(254_205_211/0.8)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
              style={{ maskImage: 'url(/torri-dellacqua-logo.svg)', WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)' }}
              role="img"
              aria-label="Torri dell'acqua Restaurant"
            />

            <div className="mt-6 space-y-3 text-center">
              <p className="text-rose-200/80 text-sm">
                <a
                  href={RESTAURANT.addressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-200 transition-colors underline underline-offset-2"
                >
                  {RESTAURANT.address}
                </a>
              </p>
              <p className="text-rose-200/60 text-xs">
                P.IVA: {RESTAURANT.piva}
              </p>
              <p className="text-rose-200/80 text-sm">
                <a href={`tel:${RESTAURANT.phone.replace(/\s/g, '')}`} className="hover:text-rose-200 transition-colors">
                  {RESTAURANT.phone}
                </a>
                {' · '}
                <a href={`mailto:${RESTAURANT.email}`} className="hover:text-rose-200 transition-colors">
                  {RESTAURANT.email}
                </a>
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <a
                href={RESTAURANT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-300/10 border border-rose-300/30 text-rose-200 hover:bg-rose-300/20 transition-colors"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.281.261 2.15.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.281-.06 2.15-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.281-.262-2.15-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63C19.095.333 18.225.131 16.947.072 15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.897 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Seguici su Instagram {RESTAURANT.instagramHandle}
              </a>
            </div>
          </div>

          <div id="privacy" className="bg-[#2d1515]/90 backdrop-blur-sm rounded-2xl p-5 border border-rose-300/10 scroll-mt-8">
            <h3 className="text-rose-200/90 font-medium text-sm mb-2">Trattamento dei dati</h3>
            <p className="text-rose-200/60 text-xs leading-relaxed">
              I dati raccolti sono utilizzati per gestire la prenotazione e per contattarti in caso di necessità. Titolare: {RESTAURANT.companyName}. Per finalità, diritti e reclamo al Garante:{' '}
              <a href="/privacy" className="text-rose-300/90 hover:text-rose-200 underline underline-offset-1">informativa privacy completa</a>. Per esercitare i diritti scrivi a{' '}
              <a href={`mailto:${RESTAURANT.email}`} className="text-rose-300/90 hover:text-rose-200 underline underline-offset-1">
                {RESTAURANT.email}
              </a>
              .
            </p>
          </div>

          {/* Credits */}
          <div className="mt-12 pt-6 border-t border-rose-300/20">
            <Credits />
          </div>
        </footer>
      </div>
      </section>
      )}
    </main>
  );
}
