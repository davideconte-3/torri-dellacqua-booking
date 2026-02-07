# 🚀 Checklist Lancio Piattaforma Prenotazione San Valentino

## ✅ Stato Attuale: SERVER LOCALE ATTIVO

**URL Locale**: http://localhost:3000

**Pagine Disponibili**:
- ✅ `/` - Homepage (404 temporaneo - normale)
- ✅ `/eventi/san-valentino` - Landing page evento San Valentino
- ✅ `/prenota` - Form prenotazione
- ✅ `/prenota/successo` - Pagina conferma

---

## 🎯 Per ADV Meta (Facebook/Instagram)

### URL per Campagne Pubblicitarie

**Landing Page Principale**:
```
http://localhost:3000/eventi/san-valentino
```

**Con UTM Parameters** (consigliato):
```
http://localhost:3000/eventi/san-valentino?utm_source=meta&utm_medium=cpc&utm_campaign=sanvalentino2026
```

### Eventi Pixel Tracciati

1. **PageView** - Automatico su ogni pagina
2. **ViewContent** - Quando l'utente arriva su `/eventi/san-valentino`
3. **InitiateCheckout** - Quando inizia a compilare il form
4. **Lead** - Quando completa la prenotazione ✅ CONVERSIONE

---

## 📋 Setup Produzione - TODO List

### 1. Configurazione Meta Pixel

- [ ] Crea Meta Pixel in Business Manager
- [ ] Copia Pixel ID
- [ ] Aggiungi in `.env.local`:
  ```bash
  NEXT_PUBLIC_FB_PIXEL_ID="TUO_PIXEL_ID_QUI"
  ```
- [ ] Verifica con Meta Pixel Helper extension

### 2. Deploy Vercel

```bash
# Opzione A: Via GitHub (consigliato)
git init
git add .
git commit -m "Initial commit - Piattaforma prenotazione San Valentino"
git remote add origin <your-repo>
git push -u origin main

# Poi su vercel.com: Import repository

# Opzione B: Via CLI
npm i -g vercel
vercel login
vercel --prod
```

**Environment Variables da aggiungere su Vercel**:
- `NEXT_PUBLIC_FB_PIXEL_ID` - Il tuo Meta Pixel ID

### 3. Dominio

Opzioni:
1. **Dominio custom**: `prenotazioni.torridellacqua.it`
2. **Vercel subdomain**: `torri-dellacqua.vercel.app`

### 4. Testing Pre-Launch

- [ ] Test form prenotazione completo
- [ ] Verifica email funzionanti (da implementare)
- [ ] Test responsive mobile/tablet
- [ ] Test su Safari, Chrome, Firefox
- [ ] Verifica eventi pixel con Test Events
- [ ] Test velocità con Lighthouse (target: >90)

### 5. Contenuti Finali

- [ ] Sostituisci immagini placeholder con foto reali
- [ ] Aggiorna contatti (email, telefono, indirizzo)
- [ ] Verifica menu e prezzi corretti
- [ ] Privacy Policy page
- [ ] Cookie consent banner (per GDPR)

---

## 🎨 Personalizzazioni Possibili

### Colori & Branding

File: `src/styles/globals.css`

```css
:root {
  --brand-primary: 139 0 0;        /* Rosso principale */
  --brand-primary-light: 196 30 58; /* Rosso chiaro */
  /* Modifica questi valori se necessario */
}
```

### Testi Landing Page

File: `src/app/eventi/san-valentino/page.tsx`

Modifica:
- Titolo evento
- Descrizione menu
- Prezzi
- Orari
- Cosa include

### Form Prenotazione

File: `src/components/booking/BookingForm.tsx`

Attualmente: **Solo raccolta dati (no pagamenti)**

Quando sarà attivo:
- Utente compila form
- Pixel traccia conversione
- Email di conferma (da implementare)
- Admin riceve notifica (da implementare)

---

## 📊 Campagne ADV Consigliate

### Setup Iniziale

**Budget Test**: €20-30/giorno per 7 giorni  
**Obiettivo**: Lead (conversioni)  
**Pubblico**: 
- Località: Italia (raggio 50km dal ristorante)
- Età: 25-55 anni
- Interessi: Ristoranti, San Valentino, Ristoranti gourmet

### Creative Suggerito

**Immagine**: Piatto principale o coppia al ristorante  
**Headline**: "🌹 San Valentino 2026 al Torri dell'Acqua"  
**Text**: 
```
Celebra l'amore con una serata indimenticabile 💕

✨ Menu degustazione 5 portate
🍾 Calice di benvenuto
🕯️ Atmosfera elegante
🎵 Musica live

€80 a persona | Posti limitati
```

**Call-to-Action**: "Prenota ora"  
**Link**: Landing page `/eventi/san-valentino`

---

## 🔧 Comandi Utili

### Development
```bash
cd booking-platform
npm run dev          # Avvia server locale
npm run build        # Test build produzione
npm run type-check   # Verifica TypeScript
```

### Deploy
```bash
vercel              # Deploy preview
vercel --prod       # Deploy produzione
```

### Monitoring
- Vercel Dashboard: Analytics traffico
- Meta Ads Manager: Performance campagne
- Meta Pixel Events: Test events in real-time

---

## 🆘 Troubleshooting

### Il Pixel non traccia

1. Verifica `NEXT_PUBLIC_FB_PIXEL_ID` in `.env.local`
2. Rebuild: `npm run build && npm run dev`
3. Verifica console browser (F12)
4. Usa Meta Pixel Helper extension

### Form non funziona

1. Verifica console errori (F12)
2. Check validazione campi
3. Test su browser diverso

### Pagina bianca

1. Check console errori
2. Verifica build: `npm run build`
3. Clear cache browser

---

## 📈 KPI da Monitorare

### Durante Campagna

- **Impressioni**: Quante persone vedono l'annuncio
- **Click**: Quanti cliccano
- **CTR**: Click/Impressioni (target: >2%)
- **CPC**: Costo per click (benchmark: €0.50-1.50)
- **Landing Page Views**: Visite alla pagina
- **Conversioni (Lead)**: Prenotazioni completate
- **CPL**: Costo per prenotazione (target: <€10)
- **Conversion Rate**: Conversioni/Click (target: >10%)

### Post-Campagna

- Prenotazioni totali ricevute
- Tasso di conferma (quante si presentano)
- Revenue totale
- ROAS (Return on Ad Spend)
- Feedback clienti

---

## 📞 Support

**Developer**: Davide Conte  
**Email**: me@davideconte.me  
**Website**: davideconte.me

**Documentazione**:
- [ANALISI_PROGETTO.md](./ANALISI_PROGETTO.md) - Overview completo
- [TECH_STACK.md](./TECH_STACK.md) - Dettagli tecnici
- [META_PIXEL_SETUP.md](./META_PIXEL_SETUP.md) - Guida pixel
- [QUICK_START.md](./QUICK_START.md) - Setup veloce

---

## ✨ Next Steps Immediate

1. **Configura Meta Pixel** - Ottieni ID e aggiungi in `.env.local`
2. **Test Completo** - Naviga tutte le pagine, prova il form
3. **Deploy Vercel** - Metti online
4. **Setup DNS** - Collega dominio custom (opzionale)
5. **Crea Campagne** - Lancia ADV su Meta
6. **Monitor** - Controlla conversioni in tempo reale

---

**Stato Progetto: 🟢 PRONTO PER TEST E DEPLOY**

Data: 6 Febbraio 2026  
Versione: 1.0.0-mvp
