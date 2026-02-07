# Torri dell'Acqua - Prenotazioni

Pagina singola mobile-first per prenotazioni tavoli.

## Avvio Rapido

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## Cosa C'è

- Pagina singola di prenotazione (`/prenota`)
- Form mobile-first con validazione
- Database SQLite locale
- API per salvare prenotazioni

## Campi Form

1. Nome completo
2. Email
3. Telefono
4. Data
5. Ora (19:00 - 22:00)
6. Numero ospiti (1-10)
7. Note (opzionale)

## Vedere le Prenotazioni

```bash
npx prisma studio
```

Si apre su http://localhost:5555

## Deploy Vercel

```bash
npm i -g vercel
vercel
```

Per produzione usa PostgreSQL invece di SQLite (Vercel Postgres o Supabase gratis).

## Struttura

```
src/
├── app/
│   ├── page.tsx              # Redirect a /prenota
│   ├── prenota/page.tsx      # Pagina prenotazione
│   ├── layout.tsx            # Layout base
│   └── api/bookings/route.ts # API salvataggio
├── styles/globals.css        # Tailwind base
prisma/
├── schema.prisma             # Schema DB semplice
└── dev.db                    # Database SQLite
```

## Tecnologie

- Next.js 15
- React 18
- Prisma
- SQLite (dev) / PostgreSQL (prod)
- Tailwind CSS
- TypeScript

## Contatti

Sviluppato da Davide Conte per Torri dell'Acqua
