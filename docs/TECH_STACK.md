# Stack Tecnologico Dettagliato

## Architettura Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                          │
│  Next.js 15 App Router + React 19 + TailwindCSS            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Vercel Edge Network                             │
│  CDN + Edge Functions + Middleware                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Server                                  │
│  ├─ Server Components (RSC)                                 │
│  ├─ API Routes                                              │
│  ├─ Server Actions                                          │
│  └─ Middleware Auth                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Data Layer                                      │
│  ├─ Vercel Postgres (Prisma ORM)                           │
│  ├─ Vercel KV (Redis - Session)                            │
│  └─ Vercel Blob (Image Storage)                            │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           External Services                                  │
│  ├─ Resend (Transactional Emails)                          │
│  ├─ Stripe (Payments)                                       │
│  └─ Google Maps API                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Stack

### Core Framework
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.5.0"
}
```

**Perché Next.js 15:**
- App Router stabile (file-based routing)
- React Server Components (performance)
- Server Actions (no API routes boilerplate)
- Built-in image optimization
- SEO-friendly out of the box
- Deploy istantaneo su Vercel

### Styling & UI
```json
{
  "tailwindcss": "^4.0.0",
  "tailwind-merge": "^2.5.0",
  "clsx": "^2.1.0",
  "@tailwindcss/forms": "^0.5.9",
  "@tailwindcss/typography": "^0.5.15"
}
```

**UI Components:**
```json
{
  "@radix-ui/react-dialog": "^1.1.0",
  "@radix-ui/react-dropdown-menu": "^2.1.0",
  "@radix-ui/react-select": "^2.1.0",
  "@radix-ui/react-toast": "^1.2.0",
  "@radix-ui/react-calendar": "^1.0.0"
}
```

### Form Handling
```json
{
  "react-hook-form": "^7.53.0",
  "zod": "^3.23.0",
  "@hookform/resolvers": "^3.9.0"
}
```

### Animazioni
```json
{
  "framer-motion": "^11.5.0"
}
```

### Date Management
```json
{
  "date-fns": "^3.6.0",
  "date-fns-tz": "^3.1.0"
}
```

---

## Backend Stack

### Database ORM
```json
{
  "@prisma/client": "^5.20.0",
  "prisma": "^5.20.0"
}
```

**Prisma Advantages:**
- Type-safe database queries
- Auto-generated types
- Migrazioni gestite
- Studio UI per debugging
- Multi-database support

### Authentication
```json
{
  "next-auth": "^5.0.0-beta.20",
  "@auth/prisma-adapter": "^2.5.0"
}
```

**Opzione alternativa (premium):**
```json
{
  "@clerk/nextjs": "^5.5.0"
}
```

### Validazione
```json
{
  "zod": "^3.23.0",
  "validator": "^13.12.0"
}
```

---

## Database

### Vercel Postgres
```bash
# Setup
npm i @vercel/postgres

# ENV
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
```

**Pro:**
- Integrazione nativa Vercel
- Scaling automatico
- Backup automatici
- €0 fino a 256 MB
- Latency bassa (edge)

**Alternative:**
- Supabase (più features, free tier generoso)
- PlanetScale (MySQL-based)
- Railway (PostgreSQL managed)

### Caching Layer
```json
{
  "@vercel/kv": "^2.0.0"
}
```

Vercel KV (Redis) per:
- Session storage
- Rate limiting
- Cache disponibilità tavoli
- Lock distribuiti

---

## Payments

### Stripe Integration
```json
{
  "stripe": "^16.12.0",
  "@stripe/stripe-js": "^4.5.0"
}
```

**Setup:**
```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Deposito prenotazione: €20-50
// Payment Intent con metadata booking_id
```

---

## Email Service

### Resend
```json
{
  "resend": "^4.0.0"
}
```

**Email Templates:**
- Conferma prenotazione
- Reminder 24h prima
- Cancellazione prenotazione
- Receipt pagamento

**Alternative:**
- SendGrid
- Postmark
- AWS SES

---

## Development Tools

### Code Quality
```json
{
  "eslint": "^9.0.0",
  "prettier": "^3.3.0",
  "@typescript-eslint/parser": "^8.6.0",
  "@typescript-eslint/eslint-plugin": "^8.6.0"
}
```

### Testing
```json
{
  "vitest": "^2.1.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.5.0",
  "playwright": "^1.47.0"
}
```

### Development Experience
```json
{
  "tsx": "^4.19.0",
  "nodemon": "^3.1.0"
}
```

---

## Monitoring & Analytics

### Vercel Analytics
```json
{
  "@vercel/analytics": "^1.3.0"
}
```

### Error Tracking
```json
{
  "@sentry/nextjs": "^8.30.0"
}
```

### Logging
```json
{
  "pino": "^9.4.0",
  "pino-pretty": "^11.2.0"
}
```

---

## Deploy & CI/CD

### Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["fra1"]
}
```

### Environment Variables
```bash
# Database
DATABASE_URL=
POSTGRES_PRISMA_URL=

# Auth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=

# Google
GOOGLE_MAPS_API_KEY=

# Admin
ADMIN_EMAIL=
```

---

## Alternative Stack Consideration

### Fly.io Deployment
Se serve più controllo infrastruttura:

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

**Pro Fly.io:**
- Più economico a scale
- Controllo completo VM
- Multi-region facile
- PostgreSQL managed incluso

**Contro:**
- Setup più complesso
- Meno "zero-config"
- Gestione manuale scaling

---

## Structured Cost Analysis

### Vercel Pro Plan
- **Base**: €20/mese
- Include:
  - Hosting illimitato
  - 1TB bandwidth
  - Edge Functions
  - Vercel Postgres (fino 256MB)
  - Vercel KV (fino 256MB)
  - Analytics
  - Preview deployments

### External Services
- **Resend**: €0 (fino 3k email/mese), poi €20/mese
- **Stripe**: 2.9% + €0.30 per transazione
- **Google Maps**: €0 (fino 28k requests/mese)

### Estimated Monthly (piccolo ristorante)
```
Vercel Pro:        €20
Resend:            €0-20
Stripe fees:       ~€5-20 (se 100 depositi/mese)
Domain:            €1 (€15/anno)
─────────────────────
Total:             €26-61/mese
```

---

## Performance Targets

### Core Web Vitals
```
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay):        < 100ms
CLS (Cumulative Layout Shift):  < 0.1
```

### Custom Metrics
```
Time to Interactive:     < 3s
Total Blocking Time:     < 200ms
Speed Index:            < 3s
```

### Optimization Strategies
- Image optimization (WebP, AVIF)
- Font optimization (subset, display=swap)
- Code splitting (dynamic imports)
- Route prefetching
- Static generation dove possibile
- ISR per contenuti semi-statici

---

## Security Checklist

- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Rate limiting (Vercel KV)
- [ ] Input sanitization (Zod)
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (React)
- [ ] CSRF tokens (NextAuth)
- [ ] Secure headers (Helmet)
- [ ] Environment secrets (Vercel Env)
- [ ] Webhook verification (Stripe)
- [ ] Email verification
- [ ] Phone verification (opzionale)

---

## Scalability Considerations

### Current MVP (< 1000 prenotazioni/mese)
- Vercel Hobby/Pro sufficiente
- Database < 1GB
- Email < 5k/mese

### Growth Phase (1000-10000 prenotazioni/mese)
- Vercel Pro + add-ons
- Database scaling
- CDN per assets statici
- Redis caching layer

### Enterprise (> 10000 prenotazioni/mese)
- Multi-region deployment
- Database read replicas
- Queue system (BullMQ)
- Microservices architecture

---

## Recommended Development Workflow

```bash
# 1. Clone & Install
git clone <repo>
cd booking-platform
npm install

# 2. Database Setup
npx prisma generate
npx prisma db push
npx prisma studio  # UI per vedere dati

# 3. Development
npm run dev

# 4. Testing
npm run test
npm run test:e2e

# 5. Build & Deploy
npm run build
vercel --prod
```

---

## Conclusioni

Questo stack è ottimizzato per:
- ✅ Velocità di sviluppo
- ✅ Performance production
- ✅ Costi contenuti
- ✅ Scalabilità futura
- ✅ Developer experience
- ✅ Type safety end-to-end

La combinazione Next.js + Vercel + Prisma rappresenta lo standard de facto nel 2026 per applicazioni web moderne con requisiti di performance e SEO.
