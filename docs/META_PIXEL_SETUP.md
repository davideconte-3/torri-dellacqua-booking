# Setup Meta Pixel (Facebook Pixel) per Tracking Conversioni

## Panoramica

Il Meta Pixel è integrato nella piattaforma per tracciare le conversioni dalle campagne ADV Meta (Facebook/Instagram). Ogni prenotazione completata viene registrata come evento di conversione.

Per dati di marketing più completi e migliore ROI puoi attivare il **Conversions API Gateway** (configurazione rapida e senza codice da Events Manager). Guida: [CONVERSIONS_API_GATEWAY.md](./CONVERSIONS_API_GATEWAY.md).

---

## Eventi Tracciati

### 1. PageView
**Quando**: Utente visita qualsiasi pagina
**Scopo**: Traffico generale, retargeting

### 2. ViewContent
**Quando**: Utente arriva sulla landing San Valentino
**Dati tracciati**:
```javascript
{
  content_name: "San Valentino 2026",
  content_category: "Event",
  value: 80,
  currency: "EUR"
}
```
**Scopo**: Pubblico che ha visto l'evento, retargeting

### 3. InitiateCheckout
**Quando**: Utente inizia a compilare il form di prenotazione
**Dati tracciati**:
```javascript
{
  content_name: "San Valentino 2026",
  content_category: "Event",
  num_items: 2, // numero ospiti
  value: 160, // 80 * numero ospiti
  currency: "EUR"
}
```
**Scopo**: Pubblico che ha iniziato prenotazione ma non completato, retargeting carrello abbandonato

### 4. Lead/Purchase
**Quando**: Prenotazione completata con successo
**Dati tracciati**:
```javascript
{
  content_name: "San Valentino 2026",
  content_category: "Event",
  value: 60, // deposito 30€ * 2 persone
  currency: "EUR",
  predicted_ltv: 180, // lifetime value stimato
  num_items: 2,
  status: "pending"
}
```
**Scopo**: **CONVERSIONE PRINCIPALE** - ottimizzazione campagne

### 5. BookingSubmitted (Custom Event)
**Quando**: Prenotazione completata
**Dati tracciati**:
```javascript
{
  event_name: "San Valentino 2026",
  event_date: "2026-02-14",
  guests: 2
}
```
**Scopo**: Evento custom per segmentazione avanzata

---

## Setup Passo-Passo

### 1. Crea Meta Pixel

1. Vai su [Meta Business Suite](https://business.facebook.com)
2. Seleziona il Business Manager
3. Menu → **Eventi** → **Pixel**
4. Click **Crea Pixel**
5. Copia l'**ID Pixel** (es: `1234567890123456`)

### 2. Configura nel Progetto

Aggiungi l'ID pixel nel file `.env`:

```bash
# .env
NEXT_PUBLIC_FB_PIXEL_ID="1234567890123456"
```

**IMPORTANTE**: Il prefisso `NEXT_PUBLIC_` è necessario per esporre la variabile al browser.

### 3. Verifica Installazione

#### Metodo 1: Meta Pixel Helper (Chrome Extension)

1. Installa [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper)
2. Visita il tuo sito (localhost o production)
3. Click sull'icona dell'estensione
4. Verifica che il pixel sia **verde** e attivo

#### Metodo 2: Test Events (Meta Business Suite)

1. Meta Business Suite → **Eventi** → **Pixel**
2. Tab **Test Events**
3. Naviga sul sito in modalità test
4. Verifica che gli eventi appaiano in tempo reale

---

## Configurazione Campagne ADV

### 1. Crea Campagna Meta Ads

**Obiettivo**: Conversioni

**Evento di Conversione**: `Lead` o `Purchase`

**Pubblico**: 
- Località: Italia
- Età: 25-55
- Interessi: Ristoranti, San Valentino, Ristoranti gourmet

### 2. URL Campagna

Usa questo URL per le tue ADV:

```
https://tuosito.it/eventi/san-valentino?utm_source=meta&utm_medium=cpc&utm_campaign=sanvalentino2026
```

**Breakdown UTM**:
- `utm_source=meta` - Identifica Meta come sorgente
- `utm_medium=cpc` - Cost-per-click
- `utm_campaign=sanvalentino2026` - Nome campagna specifico

### 3. Testo Annuncio Suggerito

**Headline**:
```
🌹 San Valentino 2026 - Menu Degustazione
```

**Primary Text**:
```
Celebra l'amore con una serata indimenticabile 💕

✨ Menu degustazione 5 portate
🍾 Calice di benvenuto incluso
🕯️ Atmosfera intima con candele
🎵 Musica live

€80 a persona | Posti limitati
Prenota ora il tuo tavolo →
```

**Call-to-Action**: "Prenota ora"

---

## Monitoring & Ottimizzazione

### Dashboard Metriche Chiave

Monitora questi KPI in Meta Ads Manager:

1. **CTR (Click-Through Rate)**: Target > 2%
2. **CPC (Cost Per Click)**: Benchmark €0.50-1.50
3. **CPL (Cost Per Lead)**: Benchmark €5-15
4. **Conversion Rate**: Target > 10%
5. **ROAS (Return on Ad Spend)**: Target > 3x

### Eventi nel Funnel

```
Impressioni ADV
    ↓ (CTR)
PageView Landing
    ↓ (Engagement)
ViewContent Evento
    ↓ (Intent)
InitiateCheckout Form
    ↓ (Conversion)
Lead/Purchase Completata
```

### Pubblici Personalizzati da Creare

1. **Pubblico Caldo**: ViewContent ultimi 14 giorni
2. **Pubblico Carrello Abbandonato**: InitiateCheckout senza Lead (ultimi 3 giorni)
3. **Pubblico Convertito**: Lead completato (escludere da campagne acquisizione)
4. **Lookalike**: Basato su pubblico convertito (1%-2%)

---

## Retargeting Strategy

### Campagna 1: Carrello Abbandonato
**Pubblico**: InitiateCheckout senza conversione (ultimi 3 giorni)  
**Budget**: €10-20/giorno  
**Messaggio**: "Completa la tua prenotazione! Ti aspettiamo ❤️"  
**Incentivo**: "Ultimi tavoli disponibili"

### Campagna 2: Visitatori Landing
**Pubblico**: ViewContent senza InitiateCheckout (ultimi 7 giorni)  
**Budget**: €5-10/giorno  
**Messaggio**: "Non perdere l'occasione! San Valentino al Torri dell'Acqua"

---

## Testing A/B

### Test 1: Creative
- Variante A: Foto piatto principale
- Variante B: Foto coppia al tavolo
- Metrica: CTR

### Test 2: Copy
- Variante A: Focus menu ("5 portate gourmet")
- Variante B: Focus esperienza ("Serata speciale indimenticabile")
- Metrica: Conversion Rate

### Test 3: CTA
- Variante A: "Prenota Ora"
- Variante B: "Riserva il Tuo Tavolo"
- Metrica: Click

---

## Troubleshooting

### Il Pixel non si carica

**Check**:
1. Verifica `NEXT_PUBLIC_FB_PIXEL_ID` in `.env`
2. Rebuild progetto: `npm run build`
3. Clear cache browser
4. Controlla console browser per errori

### Eventi non tracciati

**Check**:
1. Meta Pixel Helper mostra pixel attivo?
2. AdBlocker disabilitato?
3. Cookie consentiti?
4. Console browser per errori `fbq`

### Conversioni non attribuite

**Possibili cause**:
- Tempo tra click e conversione > 7 giorni
- Utente usa browser diverso
- Cookie cancellati
- Privacy settings restrittivi

**Soluzione**: Conversioni Advanced Matching attivato

---

## Privacy & GDPR

### Cookie Consent

La piattaforma traccia automaticamente il pixel, ma per GDPR compliance dovresti:

1. Aggiungere banner cookie consent
2. Bloccare pixel fino a consenso
3. Privacy policy aggiornata

### Implementazione Consent (Futuro)

```javascript
// Esempio con consenso utente
if (userHasConsented) {
  initMetaPixel();
}
```

---

## Budget ADV Consigliato

### Fase 1: Test (Giorni 1-7)
- Budget: €20-30/giorno
- Obiettivo: Testare creatività e pubblici
- KPI: CTR, CPC

### Fase 2: Scaling (Giorni 8-30)
- Budget: €50-100/giorno
- Obiettivo: Massimizzare conversioni
- KPI: CPL, ROAS

### Fase 3: Final Push (Ultimi 7 giorni)
- Budget: €100-150/giorno
- Obiettivo: Riempire ultimi posti
- Focus: Retargeting intensivo

**Budget Totale Stimato**: €1.500-2.500

**ROI Atteso**:
- 50 prenotazioni × €160 (2 persone × €80) = €8.000 revenue
- Budget ADV: €2.000
- ROAS: 4x
- Profitto netto: €6.000

---

## Checklist Go-Live

Prima di lanciare le campagne:

- [ ] Meta Pixel ID configurato in `.env`
- [ ] Pixel verificato con Meta Pixel Helper
- [ ] Test Events funzionanti
- [ ] Landing page `/eventi/san-valentino` live
- [ ] Form prenotazione funzionante
- [ ] Email conferma configurate
- [ ] UTM parameters pronti
- [ ] Conversions API Gateway (opzionale, senza codice): vedi [CONVERSIONS_API_GATEWAY.md](./CONVERSIONS_API_GATEWAY.md)
- [ ] Budget campagna approvato
- [ ] Creative (immagini/video) pronte
- [ ] Testi annunci approvati
- [ ] Pubblici creati in Ads Manager

---

## Support

Per problemi con Meta Pixel:
- [Documentazione Meta](https://developers.facebook.com/docs/meta-pixel)
- [Meta Business Help Center](https://www.facebook.com/business/help)

Per problemi tecnici:
- Email: me@davideconte.me

---

**Buone conversioni! 🚀📈**
