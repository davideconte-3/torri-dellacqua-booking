# Setup Semplice - Booking Platform

## Installazione e Avvio

```bash
# 1. Installa dipendenze
npm install

# 2. Setup database SQLite locale
npx prisma generate
npx prisma db push

# 3. Avvia server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) per vedere la pagina di prenotazione.

## Cosa Contiene

- **Pagina singola** di prenotazione (`/prenota`)
- **Form mobile-first** con campi essenziali
- **Database SQLite** locale (file `prisma/dev.db`)
- **API route** per salvare prenotazioni
- Design pulito e responsive

## Struttura

```
booking-platform/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Redirect a /prenota
│   │   ├── prenota/page.tsx      # Pagina prenotazione
│   │   └── api/bookings/route.ts # API per salvare dati
│   └── styles/globals.css        # Stili Tailwind
├── prisma/
│   ├── schema.prisma             # Schema DB semplificato
│   └── dev.db                    # Database SQLite
└── package.json
```

## Campi Form

1. Nome completo
2. Email
3. Telefono
4. Data
5. Ora
6. Numero ospiti
7. Note (opzionale)

## Vedere le Prenotazioni

Le prenotazioni vengono salvate nel database SQLite locale.

Per visualizzarle:

```bash
# Apri Prisma Studio
npx prisma studio
```

Si aprirà un'interfaccia web su `http://localhost:5555` dove puoi vedere tutte le prenotazioni.

## Deploy

### Vercel (consigliato)

```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Aggiungi queste variabili d'ambiente su Vercel:
- Usa un database PostgreSQL gratuito (Vercel Postgres o Supabase)
- Aggiorna il `schema.prisma` per usare PostgreSQL invece di SQLite

## Note

- SQLite va bene per sviluppo locale
- Per produzione usa PostgreSQL (es. Vercel Postgres o Supabase free tier)
- Le email di conferma non sono implementate (aggiungi Resend se serve)
