# 🚀 Setup Campagna ADV San Valentino - Guida Rapida

## ✅ Funzionalità Implementate

### 1. 📊 Tracking Conversioni
- ✅ Meta Pixel (Facebook/Instagram Ads)
- ✅ Google Analytics 4
- ✅ Eventi conversione completi:
  - `PageView` - Visualizzazione pagina
  - `ViewContent` - Arrivo sulla landing
  - `InitiateCheckout` - Inizio compilazione form
  - `AddToCart` - Email inserita
  - `Lead` - Prenotazione completata ⭐ **CONVERSIONE PRINCIPALE**

### 2. 🎯 Meta Tags Ottimizzati
- ✅ Open Graph per Facebook/Instagram/WhatsApp
- ✅ Twitter Cards
- ✅ Schema.org (Event + Restaurant markup)
- ✅ Preview ottimizzato per condivisioni social

### 3. 🔥 Elementi CRO (Conversion Rate Optimization)
- ✅ Countdown timer fino a San Valentino
- ✅ Badge "Posti limitati" con progress bar
- ✅ WhatsApp quick booking
- ✅ Form auto-save (localStorage)
- ✅ Tracking micro-conversioni

### 4. 📱 Mobile-First
- ✅ Touch-optimized (pulsanti 48x48px)
- ✅ WhatsApp share dopo prenotazione
- ✅ Responsive design ottimizzato

## 🎬 Setup in 5 Minuti

### Step 1: Configura Analytics

#### A. Meta Pixel (Facebook/Instagram)
1. Vai su [Meta Business Suite](https://business.facebook.com/events_manager)
2. Crea un nuovo Pixel
3. Copia il Pixel ID (es. `1234567890123456`)
4. Aggiungi a `.env.local`:
```bash
NEXT_PUBLIC_META_PIXEL_ID="1234567890123456"
```

#### B. Google Analytics 4
1. Vai su [Google Analytics](https://analytics.google.com)
2. Crea una nuova proprietà GA4
3. Copia il Measurement ID (formato: `G-XXXXXXXXXX`)
4. Aggiungi a `.env.local`:
```bash
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Step 2: Crea Immagine Social Sharing
Crea un'immagine `og-sanvalentino.jpg` (1200x630px) con:
- Logo ristorante
- "San Valentino 2026"
- "14 Febbraio - €60/persona"
- Immagine di San Valentino del ristorante

Salva in `/public/og-sanvalentino.jpg`

### Step 3: Testa il Tracking

#### Test Meta Pixel:
1. Installa [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Visita la pagina `/prenota`
3. Verifica che vedi:
   - ✅ PageView
   - ✅ ViewContent
   - ✅ InitiateCheckout (quando focusi sul form)
   - ✅ Lead (quando completi la prenotazione)

#### Test Google Analytics:
1. Vai su Analytics > Realtime
2. Apri la pagina `/prenota` in una nuova tab
3. Verifica che vedi la visita in tempo reale

### Step 4: Verifica Meta Tags
1. Vai su [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Inserisci URL: `tuodominio.com/prenota`
3. Clicca "Scrape Again"
4. Verifica che vedi:
   - ✅ Titolo ottimizzato
   - ✅ Descrizione accattivante
   - ✅ Immagine preview 1200x630px

## 🎯 Crea Campagne ADV

### Facebook/Instagram Ads

#### 1. Obiettivo Campagna:
- **Conversioni** (consigliato)
- Evento: Lead
- Budget: 800-1200€ per 3 settimane

#### 2. Pubblico:
**Targeting Locale:**
- Località: 30km da Castrignano del Capo
- Età: 25-55 anni
- Interessi:
  - Ristoranti
  - Ristoranti gourmet
  - Food & Wine
  - San Valentino

**Lookalike Audience** (se hai dati):
- 1% lookalike dei clienti esistenti

#### 3. Creatività Consigliata:
**Immagine/Video:**
- Piatto elegante del menu
- Tavolo apparecchiato elegante
- Vista panoramica ristorante

**Copy:**
```
💕 San Valentino 2026 - Una Serata Indimenticabile

🍷 Menu Degustazione Esclusivo
📍 Torri dell'Acqua - Castrignano del Capo
💰 60€ a persona
⏰ Sabato 14 Febbraio

⚡ Ultimi posti disponibili!
👉 Prenota ora il tuo tavolo
```

**CTA:** "Prenota ora" → `/prenota`

#### 4. Budget Allocazione:
- **Fase 1** (3 settimane prima): 300€ - Test creatività
- **Fase 2** (2 settimane prima): 500€ - Scale winning creative
- **Fase 3** (1 settimana prima): 400€ - Last minute push

### Google Ads (Opzionale)

**Search Campaign:**
- Keywords:
  - "ristorante san valentino salento"
  - "cena di San Valentino lecce"
  - "ristorante castrignano del capo"
- Budget: 300-500€
- CTA: "Prenota la tua cena di San Valentino"

## 📊 Monitoraggio Performance

### KPI da Tracciare:

1. **Conversion Rate**:
   - Target: 5-10% (visite → prenotazioni)
   - Formula: (Prenotazioni / Visite) × 100

2. **Cost Per Acquisition (CPA)**:
   - Target: 15-25€ per prenotazione
   - Formula: Spesa ADV / Prenotazioni

3. **Return on Ad Spend (ROAS)**:
   - Target: 5-10x
   - Formula: (Revenue / Spesa ADV)
   - Revenue = Prenotazioni × 60€ × 2 persone media

### Dashboard Consigliata:

**Controlla Ogni Giorno:**
- [ ] Numero prenotazioni (Meta Events Manager)
- [ ] CPA attuale (Meta Ads Manager)
- [ ] Click-through rate (CTR)
- [ ] Budget spend rate

**Controlla Ogni Settimana:**
- [ ] Creative performance
- [ ] Audience insights
- [ ] Landing page bounce rate (GA4)
- [ ] Form abandonment rate

## 🔄 Ottimizzazione Continua

### Test A/B Consigliati:

1. **Headline:**
   - A: "San Valentino 2026 - La Cena" (attuale)
   - B: "Una Serata che Ricorderai per Sempre"
   - C: "L'Amore ha un Sapore Speciale"

2. **CTA Button:**
   - A: "Prenota" (attuale)
   - B: "Riserva il Tuo Tavolo"
   - C: "Prenota Ora - Posti Limitati"

3. **Scarcity Message:**
   - A: Badge statico "Posti limitati"
   - B: Counter dinamico "37/50 prenotati"
   - C: "Solo 13 posti disponibili"

### Azioni in Base a Performance:

**Se CPA > 30€:**
- 🔴 Stringi targeting geografico
- 🔴 Testa nuove creatività
- 🔴 Riduci età range
- 🔴 Controlla frequency (max 3)

**Se CTR < 1%:**
- 🟡 Cambia immagine
- 🟡 Testa copy più emozionale
- 🟡 Aggiungi urgency nel copy

**Se Conversion Rate < 3%:**
- 🟠 Verifica form funzioni
- 🟠 Testa rimozione campi opzionali
- 🟠 Aggiungi trust signals
- 🟠 Verifica velocità pagina

## 📱 Retargeting Strategy

### Pubblico 1: View Content (Non Convertiti)
- Chi ha visitato `/prenota` ma non ha prenotato
- Budget: 20% del totale
- Messaggio: "Hai dimenticato qualcosa? Ultimi posti!"
- Durata: 14 giorni

### Pubblico 2: InitiateCheckout (Form Abbandonato)
- Chi ha iniziato il form ma non ha completato
- Budget: 30% del totale
- Messaggio: "Completa la tua prenotazione - Ti aspettiamo! 💕"
- Durata: 7 giorni
- **ALTO VALORE** - Conversion rate atteso: 20-30%

### Pubblico 3: Clienti Passati
- Database clienti esistenti
- Custom Audience upload
- Messaggio: "Bentornato! San Valentino ti aspetta"
- **ALTISSIMO VALORE** - Conversion rate atteso: 30-40%

## 🎁 Bonus: Email Automation

Dopo ogni prenotazione completata:

**Email 1: Conferma Immediata**
- Oggetto: "✅ Prenotazione confermata - San Valentino 2026"
- Include: Data, ora, numero ospiti, menu link

**Email 2: Reminder 3 giorni prima**
- Oggetto: "💕 La tua cena di San Valentino è vicina!"
- Include: Dettagli prenotazione, indicazioni stradali, suggerimenti cosa portare

**Email 3: Follow-up post-evento**
- Oggetto: "Come è andata la serata? ⭐"
- Include: Richiesta recensione, foto da condividere, prossimi eventi

## 🚨 Checklist Pre-Lancio

### Tecnico:
- [ ] `.env.local` configurato con Pixel ID e GA ID
- [ ] Testato tracking su browser (Pixel Helper)
- [ ] Verificato GA4 riceve eventi
- [ ] Meta tags validati (Facebook Debugger)
- [ ] Immagine OG (1200x630px) caricata
- [ ] Mobile responsive verificato
- [ ] Form funzionante (test prenotazione)
- [ ] WhatsApp button funziona
- [ ] Countdown timer mostra data corretta

### Marketing:
- [ ] Creatività ADV approvate (3-5 varianti)
- [ ] Copy ADV scritto e revisionato
- [ ] Budget allocato su Meta Ads
- [ ] Pixel configurato in Events Manager
- [ ] Conversioni impostate (Lead event)
- [ ] Audience create (Lookalike se disponibile)
- [ ] UTM parameters definiti
- [ ] Retargeting pixel installato

### Contenuti:
- [ ] Menu San Valentino caricato
- [ ] Foto ristorante di qualità
- [ ] Descrizione menu aggiornata
- [ ] Email conferma template pronto
- [ ] Privacy policy aggiornata

## 💡 Quick Wins Immediati

Fai SUBITO (30 minuti):
1. ✅ Configura Meta Pixel
2. ✅ Crea campagna Facebook Ads (obiettivo Conversioni)
3. ✅ Imposta budget 20€/giorno iniziale
4. ✅ Test prenotazione completa
5. ✅ Condividi pagina su Instagram Story

## 📞 Supporto

**Problemi Tracking?**
- Verifica `.env.local` sia configurato
- Controlla browser console (F12) per errori
- Usa Pixel Helper per debug

**Problemi Campagne?**
- Controlla frequenza annunci (max 3)
- Verifica pubblico non troppo piccolo (min 50K)
- Testa creatività diverse

**ROI non performante?**
- Riduci CPA ottimizzando targeting
- Testa copy più emozionale
- Aggiungi social proof alla landing

---

**Ultima revisione**: 2026-02-06
**Obiettivo**: 40+ prenotazioni con budget 1000-1500€
**CPA Target**: 20-25€
**ROAS Target**: 5-8x

**Buona fortuna con la campagna! 🚀💕**
