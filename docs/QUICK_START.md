# Quick Start Guide - Torri dell'Acqua Booking Platform

## Setup Rapido (5 minuti)

### 1. Prerequisiti
```bash
node --version  # >= 20.0.0
npm --version   # >= 10.0.0
```

### 2. Installazione

```bash
# Naviga nella cartella
cd booking-platform

# Installa dipendenze
npm install

# Crea file .env
cp .env.example .env
```

### 3. Database Setup

#### Opzione A: Vercel Postgres (Consigliato)

1. Vai su [vercel.com](https://vercel.com)
2. Crea nuovo progetto
3. Vai in "Storage" → "Create Database" → "Postgres"
4. Copia le variabili d'ambiente in `.env`

```env
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."
```

5. Push schema al database:
```bash
npm run prisma:push
```

#### Opzione B: PostgreSQL Locale

```bash
# Installa PostgreSQL
brew install postgresql  # macOS
# oppure segui https://www.postgresql.org/download/

# Avvia PostgreSQL
brew services start postgresql

# Crea database
createdb torri_booking

# Aggiorna .env
POSTGRES_URL="postgresql://localhost:5432/torri_booking"
POSTGRES_PRISMA_URL="postgresql://localhost:5432/torri_booking"

# Push schema
npm run prisma:push
```

### 4. Configurazione Servizi (Opzionale MVP)

#### Stripe (per depositi)
1. Account su [stripe.com](https://stripe.com)
2. Ottieni API keys da Dashboard
3. Aggiungi a `.env`:
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

#### Resend (per email)
1. Account su [resend.com](https://resend.com) (free tier: 3k email/mese)
2. Crea API key
3. Aggiungi a `.env`:
```env
RESEND_API_KEY="re_..."
```

### 5. Avvia Development Server

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) 🎉

---

## Prossimi Step

### 1. Seed Database con Evento San Valentino

Crea: `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crea evento San Valentino
  const sanValentino = await prisma.event.create({
    data: {
      name: 'Cena di San Valentino 2026',
      slug: 'san-valentino-2026',
      date: new Date('2026-02-14'),
      description: 'Menu speciale per San Valentino',
      maxBookings: 50,
      requiresDeposit: true,
      depositAmount: 30,
      active: true,
    },
  });

  // Crea time slots
  const times = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
  
  for (const time of times) {
    await prisma.timeSlot.create({
      data: {
        eventSlug: 'san-valentino-2026',
        date: new Date('2026-02-14'),
        time,
        capacity: 8,
        booked: 0,
        available: true,
      },
    });
  }

  console.log('✅ Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Esegui seed:
```bash
npx tsx prisma/seed.ts
```

### 2. Verifica Database

```bash
npm run prisma:studio
```

Si apre Prisma Studio su [http://localhost:5555](http://localhost:5555) - puoi vedere/editare i dati visualmente.

### 3. Crea Primo Admin User

Nella Prisma Studio:
1. Vai in tabella `User`
2. Aggiungi record:
   - email: `admin@torridellacqua.it`
   - name: `Admin`
   - role: `ADMIN`

---

## Sviluppo

### Hot Reload
Ogni modifica al codice ricarica automaticamente la pagina.

### TypeScript
```bash
npm run type-check  # Controlla errori TypeScript
```

### Linting
```bash
npm run lint        # Controlla code style
npm run lint -- --fix  # Fix automatico
```

### Database Changes

Quando modifichi `prisma/schema.prisma`:

```bash
# Development: push diretto
npm run prisma:push

# Production: crea migration
npm run prisma:migrate
```

---

## Struttura File Key

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── prenota/
│   │   └── page.tsx          # Booking page
│   └── api/
│       └── bookings/
│           └── route.ts      # API endpoint
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   └── booking/
│       └── BookingForm.tsx
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── utils.ts              # Utilities
│   └── validations/
│       └── booking.ts        # Zod schemas
└── styles/
    └── globals.css
```

---

## Deploy Vercel (1 minuto)

### Via Git (Consigliato)

1. Push codice su GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. Vai su [vercel.com/new](https://vercel.com/new)
3. Importa repository GitHub
4. Vercel rileva automaticamente Next.js
5. Aggiungi environment variables
6. Click "Deploy" ✅

### Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Troubleshooting

### Errore: "prisma not found"
```bash
npm run prisma:generate
```

### Errore: "Cannot find module '@prisma/client'"
```bash
npm install
npm run prisma:generate
```

### Database connection error
Verifica `.env` e che il database sia attivo:
```bash
psql $POSTGRES_URL -c "SELECT 1"
```

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill
npm run dev
```

---

## Comandi Utili

```bash
# Restart dev server pulito
rm -rf .next && npm run dev

# Vedere logs Prisma
DEBUG="prisma:*" npm run dev

# Build production locale
npm run build
npm run start

# Reset database (ATTENZIONE: cancella tutti i dati)
npx prisma migrate reset
```

---

## Risorse

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## Support

Per problemi o domande:
- Email: me@davideconte.me
- Docs: `/docs` folder

Buon sviluppo! 🚀
