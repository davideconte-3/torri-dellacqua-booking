# Integrazioni: marketing, newsletter, gestione tavoli/prenotazioni

Riepilogo di cosa si può collegare al progetto attuale (prenotazioni, email Resend, Meta Pixel, GA4, DB Prisma).

---

## 1. Marketing (pubblicità e conversioni)

**Già in uso**
- **Meta Pixel** (`NEXT_PUBLIC_META_PIXEL_ID`): eventi Lead su prenotazione, view content, ecc. Utile per campagne Meta/Instagram e remarketing.
- **Google Analytics 4** (`NEXT_PUBLIC_GA_ID`): traffico, funnel, conversioni. Consenso cookie gestito (Consent Mode).
- **Google Consent Mode**: default denied; si passa a granted solo dopo “Accetta” sul banner.

**Cosa si può aggiungere**
- **Meta Conversions API**: invio eventi (es. Lead) anche lato server, per ridurre dipendenza da cookie e migliorare attribuzione. Vedi `docs/CONVERSIONS_API_GATEWAY.md`.
- **Google Ads**: collegare GA4 a un account Google Ads e importare conversioni (es. “prenotazione inviata”) per campagne a performance.
- **TikTok Pixel** (se usi TikTok Ads): stesso concetto del Meta Pixel, evento Lead su submit prenotazione.
- **UTM e link tracciati**: già gestibili da GA4/Meta; assicurarsi che `NEXT_PUBLIC_SITE_URL` e le landing (es. `/sanvalentino`, `/prenota`) siano usate nelle campagne con UTM.

---

## 2. Newsletter e comunicazioni promozionali

**Situazione attuale**
- In fase prenotazione c’è il consenso facoltativo **marketing/newsletter** (`marketingConsent`).
- Il valore viene salvato in DB sulla `Booking` (`marketingConsent: true/false`).
- Non c’è ancora invio automatico a una newsletter né export verso servizi esterni.

**Cosa si può collegare**

| Strumento | Uso | Come si collega |
|----------|-----|-----------------|
| **Resend (già in uso)** | Email transazionali (conferma prenotazione). Opzionale: **Resend Broadcasts** o liste per newsletter gestite da Resend. | Export contatti con `marketingConsent = true` (email ± nome) e import in una lista Resend; oppure API Resend per aggiungere contatti a una “audience” quando arriva una prenotazione con consenso. |
| **Mailchimp** | Newsletter, automazioni, segmenti. | API Mailchimp: alla creazione prenotazione con `marketingConsent`, chiamata per aggiungere/aggiornare il contatto in una lista. Serve API key e list ID in env. |
| **Brevo (ex Sendinblue)** | Newsletter + SMS (opzionale). | Come Mailchimp: webhook o chiamata API dopo POST `/api/bookings` se `marketingConsent` è true. |
| **Constant Contact / GetResponse / simili** | Newsletter. | Stesso schema: API per “subscribe” dopo prenotazione con consenso. |

**Implementazione minima consigliata**
- **Endpoint export**: `GET /api/contacts?pin=...` (protetto con `BOOKING_VIEW_PIN`) che restituisce email (e nome) delle prenotazioni con `marketingConsent = true`, in CSV o JSON. Così puoi importarli manualmente in qualsiasi provider newsletter.
- **Integrazione diretta**: in `src/app/api/bookings/route.ts`, dopo `prisma.booking.create`, se `data.marketingConsent` è true chiamare l’API del provider scelto (Resend, Mailchimp, ecc.) per aggiungere il contatto. Tenere API key e ID lista in env.

---

## 3. Gestione tavoli e prenotazioni

**Situazione attuale**
- Le “prenotazioni” sono **richieste** (nome, email, telefono, data, ora, numero ospiti, note). Non c’è assegnazione tavoli né slot predefiniti; la conferma è manuale (email al cliente + notifica al ristorante).

**Cosa si può collegare**

| Tipo | Strumento | Ruolo | Integrazione possibile |
|------|-----------|--------|-------------------------|
| **Calendario / slot** | **Calendly** | Slot prenotabili, link nel sito. | Link “Prenota” che porta a Calendly invece del form; oppure widget embed. Non usa il DB attuale. |
| **Prenotazioni ristorante** | **TheFork (TripAdvisor)** | Gestione tavoli, turni, coperti. | Di solito sostituisce il form: si reindirizza su TheFork o si usa loro widget. Possibile solo inviare “lead” al tuo sistema e gestire il resto su TheFork. |
| **Prenotazioni ristorante** | **Resy / OpenTable / simili** | Come TheFork. | Stesso concetto: o si usa loro come front-end prenotazioni e si abbandona il form custom, o si resta con il form e la gestione tavoli è esterna (foglio, app interna). |
| **App / foglio gestione** | **Google Calendar** | Turni, tavoli, promemoria. | Export periodico (es. CSV da `/api/bookings`) e import in Calendar; oppure script che crea eventi in Calendar per ogni prenotazione (API Google). |
| **App gestione** | **Caspio / Airtable / Notion** | DB e vista operativa. | Export prenotazioni (API o CSV) verso questi strumenti; oppure webhook che alla nuova prenotazione crea un record (Airtable/Notion hanno API). |
| **Solo notifiche** | **WhatsApp Business API** | Conferme/reminder ai clienti. | Dopo creazione prenotazione, invio messaggio WhatsApp (template approvati). Richiede account Business API e numero verificato. |
| **Solo notifiche** | **SMS (Twilio / Brevo)** | Come WhatsApp, via SMS. | Stesso flusso: dopo POST booking, invio SMS di conferma. |

**Percorso consigliato senza stravolgere il progetto**
1. **Mantenere** il form attuale e il DB come “registro richieste”.
2. **Aggiungere** (opzionale) un export prenotazioni (per data, per stato) protetto da PIN, in CSV/Excel, per import in un foglio o in un gestionale.
3. **Se serve gestione tavoli “vera”** (capienza, slot, assegnazione): valutare un servizio dedicato (TheFork, Resy, o app tipo **TableAgent**, **Yuma**, **Meitre**) e decidere se:
   - reindirizzare “Prenota” al loro link, oppure
   - integrare via API (più complesso, dipende dal fornitore).

---

## 4. Soluzioni self-hosted (da hostare e integrare tu)

Puoi hostare tu stesso un gestionale che fa tavoli, comande, cucina e (dove disponibile) prenotazioni, e collegarlo al sito prenotazioni.

| Soluzione | Stack | Cosa fa | Integrazione con questo progetto |
|-----------|--------|---------|-----------------------------------|
| **TastyIgniter** | PHP/Laravel, MySQL | Ordini online, **prenotazioni tavoli**, multi-ristorante, gestione location. Estensione **Reservation** per prenotazioni; estensione **API** (REST) per creare/leggere prenotazioni da fuori. | **Ideale per integrazione**: dopo `POST /api/bookings` nel tuo Next.js puoi chiamare l’API TastyIgniter per creare la prenotazione lato gestionale (stesso cliente, stessa data/ora). Oppure il form prenotazioni può restare sul sito e in backend fai una chiamata all’API TastyIgniter. Hosting: VPS con PHP, MySQL, Nginx/Apache. |
| **Floreant POS** | Java, funziona offline | **POS classico**: tavoli, comande, stampante cucina, cassa, incassi. Visuale tavoli, niente prenotazioni web native. | Nessuna API prenotazioni. Puoi usarlo solo per **sala/cucina/cassa**. Le prenotazioni restano sul tuo sito; in sala inserisci a mano in Floreant o fai export CSV dal tuo `/api/bookings` e importi/leggi da un foglio. Hosting: PC/tablet in sede o server Java. |
| **URY** | ERPNext (Python/JS), Vue, PostgreSQL | **POS web**, KDS (cucina), gestione tavoli, ordini (sala, asporto, delivery), report. Basato su ERPNext. | ERPNext espone API REST. URY gestisce ordini e tavoli; le **prenotazioni** non sono il focus ma si possono mappare su risorse ERPNext. Integrazione: o invii le prenotazioni dal Next.js all’API ERPNext, o tieni prenotazioni sul sito e usi URY solo per comande/tavoli. Hosting: VPS, Docker; richiede installazione ERPNext + URY. |
| **Gestionale-Ristorante** (GitHub) | PHP, SQL | Sala → comande → cucina → cassa, con ruoli. Progetto italiano, più essenziale. | Nessuna API documentata. Adatto se vuoi **solo** sala/cucina/cassa in casa. Prenotazioni restano sul tuo sito; in sala si consulta la pagina `/prenotazioni` o un export. |

**Sintesi**

- **Vuoi tutto in uno (prenotazioni + tavoli + comande) e poter integrare via API**: **TastyIgniter** (estensione Reservation + API). Hosti su un VPS (es. 5–10 €/mese), dominio/secondo sottodominio per il gestionale, e nel Next.js dopo la creazione prenotazione chiami l’API TastyIgniter per creare la stessa prenotazione lì.
- **Vuoi solo sala/cucina/cassa self-hosted, le prenotazioni restano sul sito**: **Floreant POS** (semplice, collaudato) o **Gestionale-Ristorante** (PHP, italiano). Niente integrazione automatica: usi il tuo sito per prenotazioni e il POS per servizio.
- **Vuoi un “mini-ERP” ristorante (menu, ricette, POS, KDS, report)**: **URY** su ERPNext. Integrazione possibile via API ERPNext ma più configurazione.

**Link rapidi**

- TastyIgniter: [github.com/tastyigniter/TastyIgniter](https://github.com/tastyigniter/TastyIgniter), [ti-ext-reservation](https://github.com/tastyigniter/ti-ext-reservation), [ti-ext-api](https://github.com/tastyigniter/ti-ext-api) (API prenotazioni).
- Floreant POS: [floreantpos.org](https://floreantpos.org).
- URY: [ury.app](https://ury.app), [github.com/ury-erp/ury](https://github.com/ury-erp/ury).
- Gestionale-Ristorante: [github.com/Mrahh/Gestionale-Ristorante](https://github.com/Mrahh/Gestionale-Ristorante).

---

## Riepilogo veloce

| Obiettivo | Già presente | Da collegare (esempi) |
|-----------|-------------|------------------------|
| **Marketing / ADV** | Meta Pixel, GA4, Consent Mode | Conversions API Meta, Google Ads conversioni, UTM |
| **Newsletter** | Consenso salvato in DB (`marketingConsent`) | Export contatti, Resend/Mailchimp/Brevo per invio |
| **Gestione tavoli** | Solo richieste in DB + email | Export CSV, Google Calendar, TheFork/Resy, oppure **self-hosted** (TastyIgniter, Floreant, URY) |
| **Self-hosted (tavoli + comande)** | — | TastyIgniter (con API prenotazioni), Floreant POS, URY, Gestionale-Ristorante – vedi sezione 4 |
| **Scontrini / cassa / fiscale (Italia)** | — | Stampanti cucina/ricevuta: estensioni TastyIgniter (a pagamento). Scontrino fiscale: API (OpenAPI, Apiscontrino) o RT/POS fisico. Dettaglio in `docs/TASTYIGNITER_SELF_HOSTED.md` sez. 7b. |

Se mi dici su quale ambito vuoi partire (solo uno o più), posso proporti i passi concreti nel codice (env, endpoint, chiamate API).
