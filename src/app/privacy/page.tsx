import Link from 'next/link';

const RESTAURANT = {
  companyName: "TORRI DELL'ACQUA S.R.L.",
  address: "Via Dante Alighieri n. 8, 73040 Castrignano del Capo (LE)",
  piva: "05375440756",
  email: "info@torridellacqua.it",
};

export const metadata = {
  title: 'Informativa sulla privacy | Torri dell\'Acqua',
  description: 'Informativa sul trattamento dei dati personali - Torri dell\'Acqua',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#1a0a0c] text-rose-100">
      <div className="max-w-[720px] mx-auto px-4 py-10">
        <Link
          href="/prenota"
          className="inline-flex items-center gap-2 text-rose-300/90 hover:text-rose-200 text-sm mb-8"
        >
          ← Torna alla prenotazione
        </Link>
        <h1 className="text-2xl font-semibold text-rose-100 mb-2">
          Informativa sulla privacy
        </h1>
        <p className="text-rose-300/70 text-sm mb-8">
          Ultimo aggiornamento: febbraio 2026
        </p>

        <div className="space-y-6 text-rose-200/90 text-sm leading-relaxed">
          <section>
            <h2 className="text-rose-100 font-medium mb-2">1. Titolare del trattamento</h2>
            <p>
              Il titolare del trattamento dei dati personali è {RESTAURANT.companyName}, con sede in {RESTAURANT.address}, P.IVA {RESTAURANT.piva}. Per esercitare i tuoi diritti o per qualsiasi richiesta puoi scrivere a{' '}
              <a href={`mailto:${RESTAURANT.email}`} className="text-rose-300 underline underline-offset-1">{RESTAURANT.email}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-rose-100 font-medium mb-2">2. Dati raccolti e finalità</h2>
            <p>
              In occasione della prenotazione della cena di San Valentino (e in generale delle prenotazioni) raccogliamo: nome, indirizzo email, numero di telefono, data e orario della prenotazione, numero di ospiti ed eventuali note. Tali dati sono trattati per:
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
            <h2 className="text-rose-100 font-medium mb-2">3. Base giuridica</h2>
            <p>
              Il trattamento per la gestione della prenotazione si basa sull’esecuzione di un contratto o su misure precontrattuali (art. 6, comma 1, lett. b) GDPR). Il trattamento per finalità di marketing si basa sul consenso (art. 6, comma 1, lett. a) GDPR), revocabile in qualsiasi momento.
            </p>
          </section>

          <section>
            <h2 className="text-rose-100 font-medium mb-2">4. Conservazione</h2>
            <p>
              I dati relativi alla prenotazione sono conservati per il tempo necessario alla gestione del rapporto e agli obblighi di legge (inclusi contabilità e fiscali). I dati utilizzati per finalità di marketing sono conservati fino a revoca del consenso o richiesta di cancellazione.
            </p>
          </section>

          <section>
            <h2 className="text-rose-100 font-medium mb-2">5. Diritti dell’interessato</h2>
            <p>
              In qualità di interessato puoi esercitare i diritti previsti dal GDPR (Regolamento UE 2016/679): diritto di accesso (art. 15), rettifica (art. 16), cancellazione (art. 17), limitazione del trattamento (art. 18), portabilità (art. 20), opposizione (art. 21), nonché revocare il consenso dove previsto. Puoi proporre reclamo all’Autorità di controllo (Garante per la protezione dei dati personali – Italia: <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-rose-300 underline underline-offset-1">www.garanteprivacy.it</a>).
            </p>
          </section>

          <section>
            <h2 className="text-rose-100 font-medium mb-2">6. Comunicazione e diffusione</h2>
            <p>
              I dati non sono diffusi. Possono essere comunicati a soggetti che forniscono servizi necessari alla gestione del sito e delle prenotazioni (es. hosting, invio email), nel rispetto di adeguate garanzie.
            </p>
          </section>

          <section id="cookie" className="scroll-mt-8">
            <h2 className="text-rose-100 font-medium mb-2">7. Cookie e tecnologie similari</h2>
            <p>
              Il sito utilizza cookie e tecnologie analoghe per il corretto funzionamento delle pagine e per ricordare le tue preferenze (es. consenso cookie).
            </p>
            <p className="mt-2">
              <strong className="text-rose-100">Cookie tecnici (necessari):</strong> sono indispensabili per l’uso del sito (es. gestione della sessione, sicurezza). Non richiedono il tuo consenso; puoi comunque disattivarli dalle impostazioni del browser, con possibile limitazione di alcune funzioni.
            </p>
            <p className="mt-2">
              <strong className="text-rose-100">Cookie analytics o di profilazione:</strong> se presenti (es. per statistiche o pubblicità), vengono attivati solo in caso di consenso tramite il banner cookie. Puoi modificare le tue scelte in qualsiasi momento tramite il link in fondo alla pagina o dalle impostazioni del browser.
            </p>
            <p className="mt-2">
              Per maggiori informazioni su come gestire o eliminare i cookie puoi consultare la guida del tuo browser (Chrome, Firefox, Safari, Edge, ecc.).
            </p>
          </section>
        </div>

        <p className="mt-10 text-rose-300/70 text-xs">
          Per ulteriori informazioni o per esercitare i tuoi diritti contatta il titolare all’indirizzo {RESTAURANT.email}.
        </p>
        <Link
          href="/prenota"
          className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-rose-800/50 border border-rose-300/20 text-rose-200 text-sm hover:bg-rose-800/70 transition-colors"
        >
          Torna alla prenotazione
        </Link>
      </div>
    </main>
  );
}
