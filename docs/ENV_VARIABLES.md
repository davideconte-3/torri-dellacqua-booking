# Variabili d'Ambiente - Guida Completa

## 📋 Panoramica

Questo progetto utilizza variabili d'ambiente per configurare informazioni sensibili e specifiche dell'ambiente. Le variabili sono divise in tre categorie:

1. **Server-side** - Accessibili solo lato server (Node.js)
2. **Client-side** - Accessibili nel browser (prefisso `NEXT_PUBLIC_`)
3. **Build-time** - Utilizzate durante il processo di build

## 🔧 File di Configurazione

- `.env.local` - Ambiente locale (mai committato, git-ignored)
- `.env.example` - Template con tutte le variabili disponibili
- `.env.production` - Produzione (opzionale, meglio usare Vercel UI)

## 📍 Informazioni Ristorante

### ⚠️ IMPORTANTE: Doppia Configurazione

Le informazioni del ristorante devono essere configurate **DUE VOLTE**:

1. **Server-side** (senza prefisso) - per API e email
2. **Client-side** (con `NEXT_PUBLIC_`) - per pagine menu e prenotazioni

### Server-side (API, Email, Backend)

```bash
RESTAURANT_NAME="Torri dell'Acqua"
RESTAURANT_EMAIL="info@torridellacqua.it"
RESTAURANT_PHONE="+39 0833 123456"
RESTAURANT_ADDRESS="Via Dante Alighieri n. 8, 73040 Castrignano del Capo (LE)"
```

**Usate in:**
- `/api/bookings` - Email di conferma
- `/api/settings` - Configurazioni backend
- Template email

### Client-side (Menu, Pagine Pubbliche)

```bash
NEXT_PUBLIC_RESTAURANT_NAME="Torri dell'Acqua"
NEXT_PUBLIC_RESTAURANT_COMPANY_NAME="TORRI DELL'ACQUA S.R.L."
NEXT_PUBLIC_RESTAURANT_ADDRESS="Via Dante Alighieri n. 8, 73040 Castrignano del Capo (LE)"
NEXT_PUBLIC_RESTAURANT_PHONE="+39 0833 123456"
NEXT_PUBLIC_RESTAURANT_EMAIL="info@torridellacqua.it"
NEXT_PUBLIC_RESTAURANT_PIVA="05375440756"
NEXT_PUBLIC_RESTAURANT_INSTAGRAM="https://www.instagram.com/torridellacqua_restaurant/"
NEXT_PUBLIC_RESTAURANT_INSTAGRAM_HANDLE="@torridellacqua_restaurant"
```

**Usate in:**
- `/menu` - Pagina menu pubblico
- `/prenota` - Pagina prenotazioni San Valentino
- Footer e contatti

## 🎯 Perché Serve la Doppia Configurazione?

Next.js separa rigorosamente le variabili d'ambiente:

- **Senza `NEXT_PUBLIC_`**: Solo server (API routes, getServerSideProps)
- **Con `NEXT_PUBLIC_`**: Anche client (browser, componenti React)

### ❌ Problema Precedente

```tsx
// MenuWrapper.tsx (client component)
const RESTAURANT = {
  address: "Via Dante Alighieri, 8, 73040 Santa Maria di Leuca LE" // ❌ HARDCODED & SBAGLIATO
}
```

### ✅ Soluzione Corretta

```tsx
// MenuWrapper.tsx (client component)
const RESTAURANT = {
  address: process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS || "fallback" // ✅ DA ENV
}
```

## 🚀 Setup Locale

1. **Copia il template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Compila tutte le variabili** (sia con che senza `NEXT_PUBLIC_`)

3. **Restart del dev server:**
   ```bash
   npm run dev
   ```

## ☁️ Setup Vercel (Produzione)

1. Vai su **Settings** → **Environment Variables**
2. Aggiungi **TUTTE** le variabili (server + client)
3. Seleziona environments: **Production**, **Preview**, **Development**
4. Salva e rideploya

### ⚠️ Errore Comune su Vercel

Se vedi ancora l'indirizzo sbagliato dopo il deploy:

1. Verifica di aver aggiunto **TUTTE** le variabili `NEXT_PUBLIC_*`
2. Forza un nuovo deploy (non usa la cache)
3. Controlla i logs del build per errori

## 📝 Checklist Completa

- [ ] `.env.local` creato da `.env.example`
- [ ] Tutte le variabili `RESTAURANT_*` compilate
- [ ] Tutte le variabili `NEXT_PUBLIC_RESTAURANT_*` compilate
- [ ] Database `DATABASE_URL` configurato
- [ ] Email `RESEND_API_KEY` configurato
- [ ] Analytics configurati (opzionale)
- [ ] Su Vercel: tutte le env vars aggiunte
- [ ] Redeploy forzato su Vercel

## 🔍 Testing

### Test Locale

```bash
# Controlla che le variabili siano caricate
npm run dev

# Apri browser console e testa:
# Vai su /menu e controlla l'indirizzo nel footer
```

### Test Produzione

```bash
# Build locale
npm run build
npm run start

# Controlla che usi i valori corretti
```

## 🆘 Troubleshooting

### "Indirizzo sbagliato nel menu"

✅ **Soluzione**: Aggiungi `NEXT_PUBLIC_RESTAURANT_ADDRESS` su Vercel

### "process.env.NEXT_PUBLIC_* è undefined"

✅ **Soluzione**:
1. Restart dev server
2. Verifica prefisso `NEXT_PUBLIC_` corretto
3. Rebuild: `npm run build`

### "Variabili funzionano in locale ma non in produzione"

✅ **Soluzione**: Aggiungi su Vercel UI (non basta `.env` nel repo)

## 📚 Documentazione Ufficiale

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Ultimo aggiornamento**: 2026-02-07
