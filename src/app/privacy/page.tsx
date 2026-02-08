'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Credits from '@/components/Credits';

const RESTAURANT = {
  companyName: process.env.NEXT_PUBLIC_RESTAURANT_COMPANY_NAME || "TORRI DELL'ACQUA S.R.L.",
  address: process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS || "Via Dante Alighieri n. 8, 73040 Castrignano del Capo (LE)",
  piva: process.env.NEXT_PUBLIC_RESTAURANT_PIVA || "05375440756",
  email: process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || "info@torridellacqua.it",
};

const themeDay = {
  bg: 'bg-gradient-to-b from-[#63B1D2] via-[#5aabcc] to-[#4a9ec4]',
  card: 'bg-white/15 backdrop-blur-md border-white/25',
  text: 'text-white/95',
  textMuted: 'text-white/70',
  heading: 'text-white',
  link: 'text-white hover:text-white/95 underline underline-offset-2',
  btn: 'border-white/40 text-white hover:bg-white/15',
  border: 'border-white/20',
};

const themeNight = {
  bg: 'bg-gradient-to-b from-[#34495e] via-[#2c3e50] to-[#34495e]',
  card: 'bg-white/10 backdrop-blur-md border-white/20',
  text: 'text-white/95',
  textMuted: 'text-white/70',
  heading: 'text-white',
  link: 'text-white/90 hover:text-white underline underline-offset-2',
  btn: 'border-white/30 text-white hover:bg-white/10',
  border: 'border-white/20',
};

export default function PrivacyPage() {
  const [isEvening, setIsEvening] = useState(true);

  useEffect(() => {
    const h = new Date().getHours();
    setIsEvening(h >= 18 || h < 6);
  }, []);

  const t = isEvening ? themeNight : themeDay;

  return (
    <main className={`min-h-screen ${t.bg} transition-colors duration-500`}>
      <div className="max-w-[720px] mx-auto px-4 py-10">
        <Link
          href="/"
          className={`inline-flex items-center gap-2 ${t.textMuted} hover:text-white text-sm mb-8 transition-colors`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Torna alla prenotazione
        </Link>

        <div className={`${t.card} rounded-2xl border p-6 sm:p-8`}>
          <h1 className={`text-2xl font-semibold ${t.heading} mb-2`}>
            Informativa sulla privacy
          </h1>
          <p className={`${t.textMuted} text-sm mb-8`}>
            Ultimo aggiornamento: febbraio 2026
          </p>

          <div className={`space-y-6 ${t.text} text-sm leading-relaxed`}>
            <section>
              <h2 className={`${t.heading} font-medium mb-2`}>1. Titolare del trattamento</h2>
              <p>
                Il titolare del trattamento dei dati personali è {RESTAURANT.companyName}, con sede in {RESTAURANT.address}, P.IVA {RESTAURANT.piva}. Per esercitare i tuoi diritti o per qualsiasi richiesta puoi scrivere a{' '}
                <a href={`mailto:${RESTAURANT.email}`} className={t.link}>{RESTAURANT.email}</a>.
              </p>
            </section>

            <section>
              <h2 className={`${t.heading} font-medium mb-2`}>2. Dati raccolti e finalità</h2>
              <p>
                In occasione delle prenotazioni raccogliamo: nome, indirizzo email, numero di telefono, data e orario della prenotazione, numero di ospiti ed eventuali note. Tali dati sono trattati per:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>gestire la prenotazione e il rapporto con te in relazione al servizio richiesto;</li>
                <li>contattarti per conferme, modifiche o comunicazioni relative alla prenotazione;</li>
                <li>adempimenti contabili e fiscali ove richiesto dalla legge.</li>
              </ul>
              <p className="mt-2">
                Con tuo consenso facoltativo, i dati (in particolare email e telefono) possono essere utilizzati per invio di comunicazioni promozionali, newsletter e aggiornamenti su eventi e iniziative del ristorante.
              </p>
            </section>

            <section>
              <h2 className={`${t.heading} font-medium mb-2`}>3. Base giuridica</h2>
              <p>
                Il trattamento per la gestione della prenotazione si basa sull'esecuzione di un contratto o su misure precontrattuali (art. 6, comma 1, lett. b) GDPR). Il trattamento per finalità di marketing si basa sul consenso (art. 6, comma 1, lett. a) GDPR), revocabile in qualsiasi momento.
              </p>
            </section>

            <section>
              <h2 className={`${t.heading} font-medium mb-2`}>4. Conservazione</h2>
              <p>
                I dati relativi alla prenotazione sono conservati per il tempo necessario alla gestione del rapporto e agli obblighi di legge (inclusi contabilità e fiscali). I dati utilizzati per finalità di marketing sono conservati fino a revoca del consenso o richiesta di cancellazione.
              </p>
            </section>

            <section>
              <h2 className={`${t.heading} font-medium mb-2`}>5. Diritti dell'interessato</h2>
              <p>
                In qualità di interessato puoi esercitare i diritti previsti dal GDPR (Regolamento UE 2016/679): diritto di accesso (art. 15), rettifica (art. 16), cancellazione (art. 17), limitazione del trattamento (art. 18), portabilità (art. 20), opposizione (art. 21), nonché revocare il consenso dove previsto. Puoi proporre reclamo all'Autorità di controllo (Garante per la protezione dei dati personali – Italia: <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className={t.link}>www.garanteprivacy.it</a>).
              </p>
            </section>

            <section>
              <h2 className={`${t.heading} font-medium mb-2`}>6. Comunicazione e diffusione</h2>
              <p>
                I dati non sono diffusi. Possono essere comunicati a soggetti che forniscono servizi necessari alla gestione del sito e delle prenotazioni (es. hosting, invio email), nel rispetto di adeguate garanzie.
              </p>
            </section>

            <section id="cookie" className="scroll-mt-8">
              <h2 className={`${t.heading} font-medium mb-2`}>7. Cookie e tecnologie similari</h2>
              <p>
                Il sito utilizza cookie e tecnologie analoghe per il corretto funzionamento delle pagine e per ricordare le tue preferenze (es. consenso cookie).
              </p>
              <p className="mt-2">
                <strong className={t.heading}>Cookie tecnici (necessari):</strong> sono indispensabili per l'uso del sito (es. gestione della sessione, sicurezza). Non richiedono il tuo consenso; puoi comunque disattivarli dalle impostazioni del browser, con possibile limitazione di alcune funzioni.
              </p>
              <p className="mt-2">
                <strong className={t.heading}>Cookie analytics o di profilazione:</strong> se presenti (es. per statistiche o pubblicità), vengono attivati solo in caso di consenso tramite il banner cookie. Puoi modificare le tue scelte in qualsiasi momento tramite il link in fondo alla pagina o dalle impostazioni del browser.
              </p>
              <p className="mt-2">
                Per maggiori informazioni su come gestire o eliminare i cookie puoi consultare la guida del tuo browser (Chrome, Firefox, Safari, Edge, ecc.).
              </p>
            </section>
          </div>

          <p className={`mt-8 ${t.textMuted} text-xs`}>
            Per ulteriori informazioni o per esercitare i tuoi diritti contatta il titolare all'indirizzo {RESTAURANT.email}.
          </p>
        </div>

        <Link
          href="/"
          className={`inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl border-2 ${t.btn} text-sm font-medium transition-colors`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Torna alla prenotazione
        </Link>

        <div className={`mt-12 pt-6 border-t ${t.border}`}>
          <Credits />
        </div>
      </div>
    </main>
  );
}
