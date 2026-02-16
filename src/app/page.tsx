'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { analytics } from '@/components/Analytics';
import Credits from '@/components/Credits';
import BookingCalendar from '@/components/BookingCalendar';
import BookingSplash from '@/components/BookingSplash';
import { isMealAvailable, getDayName, getDayService, getTimeSlots, type MealType } from '@/lib/openingHours';

const RESTAURANT = {
  companyName: process.env.NEXT_PUBLIC_RESTAURANT_COMPANY_NAME || "TORRI DELL'ACQUA S.R.L.",
  address: process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS || "Via Dante Alighieri n. 8, 73040 Marina di Leuca (LE)",
  addressUrl: process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS)}`
    : "https://www.google.com/maps/search/?api=1&query=Via+Dante+Alighieri+8+Marina+di+Leuca+LE",
  piva: process.env.NEXT_PUBLIC_RESTAURANT_PIVA || "05375440756",
  phone: process.env.NEXT_PUBLIC_RESTAURANT_PHONE || "+39 0833 123456",
  email: process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || "info@torridellacqua.it",
  instagram: process.env.NEXT_PUBLIC_RESTAURANT_INSTAGRAM || "https://www.instagram.com/torridellacqua_restaurant/",
  instagramHandle: process.env.NEXT_PUBLIC_RESTAURANT_INSTAGRAM_HANDLE || "@torridellacqua_restaurant",
};

function formatDateLabel(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function maxDateISO(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

// Stessa palette del menu: giorno celeste, sera blu scuro
const themeDay = {
  bg: 'bg-gradient-to-b from-[#63B1D2] via-[#5aabcc] to-[#4a9ec4]',
  card: 'bg-white/15 backdrop-blur-md border-white/25',
  input: 'bg-white/10 border-white/25 text-white placeholder-white/50 focus:border-white/50 focus:ring-2 focus:ring-white/20',
  label: 'text-white/95',
  labelMuted: 'text-white/70',
  link: 'text-white hover:text-white/95 underline underline-offset-2',
  btn: 'bg-white text-[#2c3e50] hover:bg-white/95 focus:ring-white/30',
  btnSecondary: 'border-white/40 text-white hover:bg-white/15',
  error: 'bg-red-500/20 border border-white/20 text-white',
  accent: 'text-white',
};
const themeNight = {
  bg: 'bg-gradient-to-b from-[#34495e] via-[#2c3e50] to-[#34495e]',
  card: 'bg-white/10 backdrop-blur-md border-white/20',
  input: 'bg-white/5 border-white/20 text-white placeholder-white/45 focus:border-white/40 focus:ring-2 focus:ring-white/15',
  label: 'text-white/95',
  labelMuted: 'text-white/70',
  link: 'text-white/90 hover:text-white underline underline-offset-2',
  btn: 'bg-white text-[#2c3e50] hover:bg-white/95 focus:ring-white/30',
  btnSecondary: 'border-white/30 text-white hover:bg-white/10',
  error: 'bg-red-500/20 border border-white/20 text-white',
  accent: 'text-white',
};

export default function HomePage() {
  const [isEvening, setIsEvening] = useState(() => {
    if (typeof window === 'undefined') return true;
    const h = new Date().getHours();
    return h >= 18 || h < 6;
  });
  const [mealType, setMealType] = useState<MealType>('cena');
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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

  const timeSlots = getTimeSlots(mealType);
  const mealNotAvailable = selectedDate && !isMealAvailable(selectedDate, mealType);
  const dayName = selectedDate ? getDayName(selectedDate) : '';
  const canSubmitDate = !selectedDate || isMealAvailable(selectedDate, mealType);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashExiting, setSplashExiting] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const skip = new URLSearchParams(window.location.search).get('skipSplash') === '1';
    if (skip) {
      setShowSplash(false);
      setContentVisible(true);
    }
  }, []);

  const handleEnterBooking = () => {
    setContentVisible(true);
    setSplashExiting(true);
    setTimeout(() => setShowSplash(false), 1000);
  };

  useEffect(() => {
    const h = new Date().getHours();
    setIsEvening(h >= 18 || h < 6);
  }, []);

  useEffect(() => {
    if (showSuccess) window.scrollTo(0, 0);
  }, [showSuccess]);

  useEffect(() => {
    if (showSplash) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    document.body.style.overflow = '';
  }, [showSplash]);

  useEffect(() => {
    const slots = getTimeSlots(mealType);
    if (formData.time && !slots.includes(formData.time)) {
      setFormData((prev) => ({ ...prev, time: '' }));
    }
  }, [mealType, formData.time]);

  useEffect(() => {
    analytics.viewContent('Prenotazione', 'Booking');
    fetch('/api/bookings/status')
      .then((res) => res.json())
      .then((data) => {
        setBookingsEnabled(data.enabled);
        if (!data.enabled) setBookingsMessage(data.message || 'Le prenotazioni sono chiuse');
      })
      .catch(() => setBookingsEnabled(true));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedDate) {
      setError('Seleziona una data.');
      return;
    }
    if (!isMealAvailable(selectedDate, mealType)) {
      const s = getDayService(selectedDate);
      if (s === 'chiuso') {
        setError(`Siamo chiusi di ${dayName}. Scegli un altro giorno.`);
      } else {
        setError(`${mealType === 'pranzo' ? 'Pranzo' : 'Cena'} non disponibile di ${dayName}. Scegli un altro giorno o l'altro servizio.`);
      }
      return;
    }
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
          date: selectedDate,
          privacyConsent: privacyAccepted,
          marketingConsent,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        const guests = parseInt(formData.guests || '2', 10);
        analytics.lead(60 * guests, guests);
        setShowSuccess(true);
        setFormData({ customerName: '', customerEmail: '', customerPhone: '', time: '', guests: '2', notes: '' });
        setSelectedDate('');
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

  const t = isEvening ? themeNight : themeDay;
  const inputBase = `w-full px-4 py-3.5 rounded-xl border-2 transition-colors min-h-[48px] touch-manipulation ${t.input}`;
  const selectBg = isEvening ? 'bg-[#2c3e50]' : 'bg-[#4a9ec4]/80';

  if (showSuccess) {
    return (
      <main className={`min-h-screen ${t.bg} flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500`}>
        <div className={`${t.card} rounded-3xl shadow-2xl p-8 md:p-12 lg:p-14 max-w-md lg:max-w-lg w-full text-center border`}>
          <div
            className="h-20 w-40 mx-auto mb-6 bg-white [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
            style={{ maskImage: 'url(/torri-dellacqua-logo.svg)', WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)' }}
            role="img"
            aria-label="Torri dell'Acqua"
          />
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/40">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-white mb-3">Prenotazione inviata</h1>
          <p className="text-white/85 text-sm mb-8">Riceverai conferma via email a breve.</p>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className={`${t.btn} px-8 py-3.5 rounded-full font-medium text-base focus:outline-none focus:ring-4 transition-all min-h-[48px]`}
          >
            Nuova prenotazione
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      {showSplash && <BookingSplash onEnter={handleEnterBooking} isExiting={splashExiting} />}
      <main className={`min-h-screen ${t.bg} transition-all duration-1000 ease-out ${contentVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <section className="py-8 md:py-12 lg:py-14 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
          <header className="text-center mb-8 lg:mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:text-left">
              <div className="flex flex-col items-center lg:items-start">
                <div
                  className="h-24 md:h-28 lg:h-32 w-44 md:w-52 lg:w-56 bg-white [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] opacity-95"
                  style={{ maskImage: 'url(/torri-dellacqua-logo.svg)', WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)' }}
                  role="img"
                  aria-label="Torri dell'Acqua"
                />
                <h1 className="text-xl md:text-2xl lg:text-3xl font-light text-white mt-6 tracking-[0.15em] uppercase" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                  Prenota
                </h1>
                <p className="text-white/80 text-sm lg:text-base mt-2">Scegli data e compila il modulo</p>
              </div>
              <nav className="flex flex-wrap justify-center lg:justify-end gap-3 mt-6 lg:mt-0">
                <Link href="/menu" className={`${t.btnSecondary} px-5 py-3 rounded-full text-sm font-light border transition-colors hover:bg-white/20`}>
                  Menu
                </Link>
              </nav>
            </div>
          </header>

          <form ref={formRef} onSubmit={handleSubmit} className={`${t.card} rounded-3xl p-6 md:p-8 lg:p-10 border`}>
            <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-10 xl:gap-12 space-y-6 lg:space-y-0">
              <div className="space-y-5">
                <p className="text-white/70 text-xs uppercase tracking-wider">Data e orario</p>
                <div>
                  <span className={`block text-sm font-medium ${t.label} mb-2`}>Pranzo o cena</span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setMealType('pranzo')}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${mealType === 'pranzo' ? 'bg-white text-[#2c3e50] border-white' : `${t.btnSecondary} border-white/30`}`}
                    >
                      Pranzo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMealType('cena')}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${mealType === 'cena' ? 'bg-white text-[#2c3e50] border-white' : `${t.btnSecondary} border-white/30`}`}
                    >
                      Cena
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  <div className="lg:max-w-[280px]">
                    <span className={`block text-sm font-medium ${t.label} mb-2`}>Scegli il giorno</span>
                    <BookingCalendar
                      value={selectedDate}
                      onChange={setSelectedDate}
                      mealType={mealType}
                      minDate={todayISO()}
                      maxDate={maxDateISO(60)}
                      theme={{
                        label: t.label,
                        labelMuted: t.labelMuted,
                        day: 'text-white/90 hover:bg-white/20',
                        dayDisabled: 'text-white/40 cursor-not-allowed bg-white/5',
                        daySelected: 'bg-white text-[#2c3e50] ring-2 ring-white/60',
                        dayToday: 'text-white bg-white/15 ring-1 ring-white/40',
                        nav: 'text-white/90 hover:bg-white/15 hover:text-white',
                      }}
                    />
                    {selectedDate && (
                      <p id="date-label" className={`text-sm mt-3 ${mealNotAvailable ? 'text-red-200' : t.labelMuted}`}>
                        {mealNotAvailable
                          ? (getDayService(selectedDate) === 'chiuso'
                            ? `Chiusi di ${dayName}. Scegli un altro giorno.`
                            : `${mealType === 'pranzo' ? 'Pranzo' : 'Cena'} non disponibile di ${dayName}.`)
                          : formatDateLabel(selectedDate)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="time" className={`block text-sm font-medium ${t.label} mb-1.5`}>Ora</label>
                    <select
                      id="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className={`${inputBase} ${selectBg}`}
                    >
                      <option value="">Scegli orario</option>
                      {timeSlots.map((hour) => (
                        <option key={hour} value={hour}>{hour}</option>
                      ))}
                    </select>
                    <p className={`${t.labelMuted} text-xs mt-1`}>
                      {mealType === 'pranzo' ? 'Pranzo' : 'Cena'} – orari disponibili
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 lg:border-l lg:border-white/20 lg:pl-10 xl:pl-12">
                <p className="text-white/70 text-xs uppercase tracking-wider">I tuoi dati</p>
                <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-x-4 xl:gap-y-4 xl:space-y-0 space-y-5">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium ${t.label} mb-1.5`}>Nome e cognome</label>
                    <input
                      id="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className={inputBase}
                      placeholder="Mario Rossi"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${t.label} mb-1.5`}>Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className={inputBase}
                      placeholder="mario@email.it"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={`block text-sm font-medium ${t.label} mb-1.5`}>Telefono</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className={inputBase}
                      placeholder="333 1234567"
                    />
                  </div>
                  <div>
                    <label htmlFor="guests" className={`block text-sm font-medium ${t.label} mb-1.5`}>Numero ospiti</label>
                    <select
                      id="guests"
                      required
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className={`${inputBase} ${selectBg}`}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'persone'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className={`block text-sm font-medium ${t.label} mb-1.5`}>Note <span className="font-normal opacity-70">(opzionale)</span></label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className={`${inputBase} resize-none min-h-[72px]`}
                    placeholder="Allergie, richieste speciali..."
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(e) => {
                        setPrivacyAccepted(e.target.checked);
                        setMarketingConsent(e.target.checked);
                      }}
                      className="mt-1 w-5 h-5 rounded border-2 border-white/40 bg-white/10 checked:bg-white checked:border-white focus:ring-2 focus:ring-white/30 cursor-pointer touch-manipulation"
                      style={{ accentColor: isEvening ? '#34495e' : '#63B1D2' }}
                    />
                    <span className={`${t.label} text-sm`}>
                      Accetto l&apos;<a href="/privacy" target="_blank" rel="noopener noreferrer" className={`${t.link} font-medium`}>informativa sulla privacy</a> e il trattamento dei dati per la prenotazione. *
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-2 border-white/40 bg-white/10 checked:bg-white checked:border-white focus:ring-2 focus:ring-white/30 cursor-pointer touch-manipulation"
                      style={{ accentColor: isEvening ? '#34495e' : '#63B1D2' }}
                    />
                    <span className={`${t.labelMuted} text-sm`}>Consenso a comunicazioni promozionali (facoltativo).</span>
                  </label>
                </div>

                {!bookingsEnabled && bookingsMessage && (
                  <p className={`${t.error} rounded-xl px-4 py-3 text-sm`}>{bookingsMessage}</p>
                )}
                {error && <p className={`${t.error} rounded-xl px-4 py-3 text-sm`} role="alert">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading || !privacyAccepted || !bookingsEnabled || !canSubmitDate}
                  className={`w-full ${t.btn} py-4 px-6 rounded-xl font-medium text-lg focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[52px] touch-manipulation`}
                >
                  {isLoading ? 'Invio in corso...' : 'Invia prenotazione'}
                </button>
              </div>
            </div>
          </form>

          <footer className="mt-10 lg:mt-12 space-y-6">
            <div className={`${t.card} rounded-2xl p-6 lg:p-8 border overflow-hidden`}>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div
                    className="h-14 w-32 bg-white/95 [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] shrink-0"
                    style={{
                      maskImage: 'url(/torri-dellacqua-logo.svg)',
                      WebkitMaskImage: 'url(/torri-dellacqua-logo.svg)',
                    }}
                    role="img"
                    aria-label="Torri dell'Acqua"
                  />
                  <p className="text-white/60 text-xs mt-3">P.IVA {RESTAURANT.piva}</p>
                </div>

                <div className="flex-1 space-y-4 lg:max-w-md">
                  <div>
                    <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1.5">Indirizzo</p>
                    <a
                      href={RESTAURANT.addressUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${t.link} text-white/90 text-sm lg:text-base inline-flex items-center gap-2 hover:text-white`}
                    >
                      <svg className="w-4 h-4 shrink-0 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {RESTAURANT.address}
                    </a>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1.5">Contatti</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm lg:text-base">
                      <a href={`tel:${RESTAURANT.phone.replace(/\s/g, '')}`} className={`${t.link} text-white/90 inline-flex items-center gap-2 hover:text-white`}>
                        <svg className="w-4 h-4 shrink-0 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {RESTAURANT.phone}
                      </a>
                      <a href={`mailto:${RESTAURANT.email}`} className={`${t.link} text-white/90 inline-flex items-center gap-2 hover:text-white`}>
                        <svg className="w-4 h-4 shrink-0 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {RESTAURANT.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center lg:items-end shrink-0">
                  <a
                    href={RESTAURANT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-full border-2 ${t.btnSecondary} text-sm font-medium transition-all hover:bg-white/20 hover:scale-[1.02]`}
                  >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
                      <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1={17.5} y1={6.5} x2={17.51} y2={6.5} />
                    </svg>
                    {RESTAURANT.instagramHandle}
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/20">
              <Credits />
            </div>
          </footer>
        </div>
      </section>
    </main>
    </>
  );
}
