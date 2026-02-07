# Deploy su Vercel - prenota.torridellacqua.it

## 🚀 Guida Deploy Completa

### Step 1: Deploy su Vercel

1. **Vai su** [vercel.com](https://vercel.com)
2. **Login** con GitHub/GitLab o email
3. **Import Project** → Import Git Repository
4. **Collega questo repository GitHub**
5. **Framework Preset**: Next.js (rilevato automaticamente)
6. **Root Directory**: `./` (default)

---

### Step 2: Configura Database PostgreSQL

**Opzione A: Vercel Postgres (Consigliato)**

1. Nel progetto Vercel → **Storage** → **Create Database**
2. Scegli **Postgres**
3. Copia le variabili d'ambiente (vengono aggiunte automaticamente)

**Opzione B: Database Esterno (Neon, Supabase, Railway)**

- Crea database PostgreSQL su provider esterno
- Copia connection string

---

### Step 3: Configura Environment Variables

Nel pannello Vercel → **Settings** → **Environment Variables**, aggiungi:

#### 🔴 OBBLIGATORIE:

```bash
# Database (auto-generate se usi Vercel Postgres)
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Email (Resend)
RESEND_API_KEY="re_..."
RESEND_FROM="Torri dell'Acqua <prenotazioni@torridellacqua.it>"
RESEND_DOMAIN="torridellacqua.it"

# Sito
NEXT_PUBLIC_SITE_URL="https://prenota.torridellacqua.it"

# Admin
BOOKING_VIEW_PIN="1234"
ADMIN_EMAIL="info@torridellacqua.it"

# Restaurant Info
RESTAURANT_NAME="Torri dell'Acqua"
RESTAURANT_EMAIL="info@torridellacqua.it"
RESTAURANT_PHONE="+39 ..."
RESTAURANT_ADDRESS="Via Dante Alighieri n. 8, 73040 Castrignano del Capo (LE)"
```

#### 🟡 CONSIGLIATE (Analytics):

```bash
# Meta Pixel (Facebook/Instagram)
NEXT_PUBLIC_META_PIXEL_ID="..."

# Google Analytics
NEXT_PUBLIC_GA_ID="G-..."

# Facebook App ID (OpenGraph)
NEXT_PUBLIC_FB_APP_ID="..."
```

#### ⚪ OPZIONALI:

```bash
# NextAuth (se implementato)
NEXTAUTH_URL="https://prenota.torridellacqua.it"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Stripe (se implementato)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Google Maps (se implementato)
GOOGLE_MAPS_API_KEY="..."
```

---

### Step 4: Prima Deploy

1. **Vercel Deploy** automaticamente dopo la configurazione
2. **Attendi build** (2-3 minuti)
3. **Verifica deploy** su URL temporaneo (es: `*.vercel.app`)

---

### Step 5: Setup Database (Prima volta)

Dopo il primo deploy con database configurato:

1. Vai su **Vercel Dashboard** → tuo progetto
2. **Settings** → **Functions** → **Terminal**
3. Oppure usa `vercel env pull` localmente e poi:

```bash
npx prisma db push
```

Questo crea le tabelle nel database production.

---

### Step 6: Configura DNS su Cloudflare

1. **Vai su Cloudflare** → torridellacqua.it → **DNS**

2. **Aggiungi record CNAME:**
   ```
   Type: CNAME
   Name: prenota
   Target: cname.vercel-dns.com
   Proxy status: DNS only (gray cloud)
   TTL: Auto
   ```

3. **Torna su Vercel** → tuo progetto → **Settings** → **Domains**

4. **Add Domain**: `prenota.torridellacqua.it`

5. Vercel verificherà DNS (1-2 minuti)

6. **Attiva SSL** (automatico)

---

### Step 7: Verifica Finale

✅ Controlla:
- [ ] Sito accessibile su `https://prenota.torridellacqua.it`
- [ ] SSL attivo (lucchetto verde)
- [ ] Form prenotazione funzionante
- [ ] Email di conferma arrivano
- [ ] Analytics tracking (se configurato)
- [ ] OpenGraph preview (testa con [opengraph.xyz](https://www.opengraph.xyz/))

---

## 🔧 Comandi Utili

```bash
# Deploy locale per test
npm run build
npm start

# Aggiorna database production
npx prisma db push

# Pull env variables da Vercel
vercel env pull

# Deploy manuale
vercel --prod
```

---

## 📧 Configurazione Resend Email

1. Vai su [resend.com](https://resend.com)
2. Crea account e verifica dominio `torridellacqua.it`
3. Aggiungi DNS records su Cloudflare:
   - TXT record per verifica
   - MX, TXT (SPF), TXT (DKIM) per invio email
4. Copia API Key e configurala su Vercel

---

## 🎯 Prossimi Passi

- [ ] Test completo prenotazioni
- [ ] Monitoraggio errori (Sentry?)
- [ ] Setup backup database
- [ ] Configurare menu.torridellacqua.it (futuro)

---

## 🆘 Troubleshooting

### Build fallisce
- Verifica `package.json` e `next.config.js`
- Controlla logs build su Vercel

### Database non si connette
- Verifica `POSTGRES_PRISMA_URL` corretta
- Controlla che tabelle siano create (`prisma db push`)

### Email non arrivano
- Verifica API Key Resend valida
- Controlla dominio verificato su Resend
- Verifica DNS records email su Cloudflare

### Domain non verifica
- Assicurati CNAME su Cloudflare sia "DNS only" (no proxy)
- Attendi propagazione DNS (max 24h, di solito 5-10 min)
