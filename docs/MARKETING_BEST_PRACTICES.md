# Marketing Best Practices - San Valentino Campaign

## 📊 Overview
Guida completa per ottimizzare la landing page di San Valentino per campagne ADV con tracciamento conversioni.

## 🎯 Obiettivi
- Massimizzare il tasso di conversione (prenotazioni)
- Tracciare accuratamente il ROI delle campagne ADV
- Ridurre il costo per acquisizione (CPA)
- Migliorare la user experience mobile-first

## 1. 📈 Tracking & Analytics

### Meta Pixel (Facebook/Instagram Ads)
```javascript
// Eventi da tracciare:
- PageView (automatico)
- ViewContent (arrivo sulla pagina)
- InitiateCheckout (focus sul form)
- AddToCart (compilazione email)
- Lead (prenotazione completata - CONVERSIONE PRINCIPALE)
```

**Setup**:
1. Crea pixel su Meta Business Suite
2. Aggiungi pixel ID in `.env.local`: `NEXT_PUBLIC_META_PIXEL_ID`
3. Eventi custom per micro-conversioni

### Google Analytics 4
```javascript
// Eventi GA4:
- page_view
- view_item (visualizzazione menu)
- begin_checkout (inizio compilazione)
- generate_lead (prenotazione confermata)
```

**Metriche chiave da monitorare**:
- Conversion Rate
- Average Time on Page
- Bounce Rate
- Form Abandonment Rate

### Google Tag Manager (GTM)
- Container per gestire tutti i tag
- Data Layer events
- Variable tracking (form fields, scroll depth)

## 2. 🔍 SEO & Meta Tags

### Open Graph (Facebook/Instagram/WhatsApp)
```html
<meta property="og:title" content="San Valentino 2026 - Cena San Valentino | Torri dell'Acqua" />
<meta property="og:description" content="Prenota la tua cena di San Valentino. Menu degustazione €60/persona. Sabato 14 Febbraio a Castrignano del Capo." />
<meta property="og:image" content="/og-sanvalentino.jpg" />
<meta property="og:type" content="event" />
```

### Twitter Cards
Per condivisioni ottimizzate su X/Twitter

### Schema.org Markup
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Cena di San Valentino 2026",
  "startDate": "2026-02-14T19:00",
  "endDate": "2026-02-14T23:00",
  "eventAttendanceMode": "OfflineEventAttendanceMode",
  "eventStatus": "EventScheduled",
  "location": {
    "@type": "Restaurant",
    "name": "Torri dell'Acqua",
    "address": "Via Dante Alighieri 8, Castrignano del Capo (LE)"
  },
  "offers": {
    "@type": "Offer",
    "price": "60",
    "priceCurrency": "EUR",
    "availability": "LimitedAvailability"
  }
}
```

## 3. 🎨 CRO (Conversion Rate Optimization)

### A. Urgency & Scarcity
✅ **Implementato**:
- Countdown timer fino a San Valentino
- Badge "Ultimi posti disponibili"
- Progress bar prenotazioni (es. "87% prenotato")

### B. Social Proof
✅ **Da implementare**:
- Recensioni Google (stelle + numero review)
- "X persone hanno prenotato oggi"
- Testimonianze clienti precedenti
- Instagram feed recente

### C. Trust Signals
✅ **Da implementare**:
- Badge "Certificato COVID Safe"
- Logo Tripadvisor/The Fork rating
- Icone pagamento sicuro
- "Cancellazione gratuita fino a 48h prima"

### D. Value Proposition
✅ **Ottimizzato**:
- Headline chiara e emozionale
- Menu visibile con 1 click
- Prezzo trasparente
- Location ben evidenziata

### E. Form Optimization
✅ **Implementato**:
- Auto-save (localStorage recovery)
- Progress indicator
- Inline validation
- Mobile-optimized inputs
- Default a 2 persone

## 4. 📱 Mobile-First Enhancements

### WhatsApp Integration
✅ **Implementato**:
- Quick booking via WhatsApp
- Share button "Condividi con partner"
- Pre-filled message template

### Touch Optimization
- Pulsanti min 48x48px
- Swipe gesture per menu
- Haptic feedback (vibrazione)
- Bottom sticky CTA su scroll

### Performance
- Lazy loading immagini
- Critical CSS inline
- Preconnect analytics domains
- Service Worker per offline

## 5. 🧪 A/B Testing Strategy

### Varianti da testare:
1. **Headline**:
   - A: "San Valentino 2026 - La Cena"
   - B: "Una Serata Indimenticabile"
   - C: "L'Amore ha un Sapore"

2. **CTA Button**:
   - A: "Prenota" (attuale)
   - B: "Prenota il Tuo Tavolo"
   - C: "Riserva Ora"

3. **Prezzo Display**:
   - A: "60€ a persona"
   - B: "Menu degustazione - 60€"
   - C: "Da 60€ per una serata magica"

4. **Social Proof**:
   - A: Con reviews
   - B: Senza reviews
   - C: Con counter prenotazioni

### Strumenti:
- Google Optimize
- Meta A/B testing nativo
- Hotjar/Microsoft Clarity (heatmaps)

## 6. 🎯 Funnel di Conversione

```
1. AD CLICK (Facebook/Instagram/Google)
   ↓
2. LANDING PAGE VIEW
   └→ Track: PageView, ViewContent
   ↓
3. INTERESSE (Scroll, View Menu)
   └→ Track: Engagement
   ↓
4. INIZIO FORM (Focus su campo)
   └→ Track: InitiateCheckout
   ↓
5. COMPILAZIONE (Email inserita)
   └→ Track: AddToCart
   ↓
6. SUBMIT (Prenotazione inviata)
   └→ Track: Lead ✅ CONVERSIONE
   ↓
7. SUCCESS PAGE
   └→ Social sharing, Upsell menu
```

## 7. 📊 KPI da Monitorare

### Primari:
- **Conversion Rate**: % visite → prenotazioni
- **Cost Per Acquisition (CPA)**: Spesa ADV / Prenotazioni
- **Return on Ad Spend (ROAS)**: Revenue / Spesa ADV

### Secondari:
- Click-Through Rate (CTR) ADV
- Bounce Rate landing page
- Average Session Duration
- Form Abandonment Rate
- Mobile vs Desktop performance

### Micro-conversioni:
- Menu view rate
- Phone click rate
- WhatsApp click rate
- Instagram click rate
- Form start rate

## 8. 🚀 Checklist Pre-Lancio

### Tecnico:
- [ ] Meta Pixel installato e testato
- [ ] GA4 configurato con eventi
- [ ] GTM container attivo
- [ ] Meta tags verificati (debugger Facebook)
- [ ] Schema.org validato
- [ ] Mobile responsive verificato
- [ ] Performance > 90 su PageSpeed
- [ ] HTTPS attivo
- [ ] Cookie consent GDPR

### Contenuti:
- [ ] Copy headline A/B tested
- [ ] Immagini ottimizzate (WebP)
- [ ] Menu PDF scaricabile
- [ ] Email confirmation template
- [ ] Thank you page ottimizzata

### Marketing:
- [ ] UTM parameters configurati
- [ ] Audience retargeting setup
- [ ] Lookalike audiences create
- [ ] Budget ADV allocato
- [ ] Creative ADV approvate
- [ ] Calendario pubblicazione

## 9. 💡 Quick Wins Immediate

### Da fare SUBITO (1-2 ore):
1. ✅ Countdown timer
2. ✅ WhatsApp button
3. ✅ Meta Pixel base
4. ✅ Open Graph tags
5. ✅ Form auto-save

### Da fare QUESTA SETTIMANA:
1. Social proof (reviews)
2. Trust badges
3. A/B testing setup
4. Heatmap tracking
5. Email automation

### Da fare PROSSIMA SETTIMANA:
1. Retargeting campaigns
2. Lookalike audiences
3. Performance optimization
4. Advanced analytics
5. Exit-intent popup

## 10. 🎬 Timeline Consigliata

**4 settimane prima (metà Gennaio)**:
- Launch campagna ADV
- Test A/B headline/CTA
- Ottimizzazione daily

**2 settimane prima**:
- Intensificare ADV spend
- Retargeting aggressivo
- Email reminder a chi ha iniziato form

**1 settimana prima**:
- Scarcity messaging intenso
- Last-minute offers
- WhatsApp proattivo

**Giorno prima**:
- Reminder via email/SMS
- Conferme finali

## 📞 Support & Resources

### Tools Consigliati:
- **Analytics**: Google Analytics 4, Meta Pixel Helper
- **Heatmaps**: Hotjar, Microsoft Clarity (gratis)
- **A/B Testing**: Google Optimize, Optimizely
- **Email**: Mailchimp, SendGrid
- **CRM**: HubSpot Free, Pipedrive

### Budget Indicativo ADV:
- **Micro**: 300-500€ (reach locale)
- **Small**: 800-1200€ (reach provinciale)
- **Medium**: 2000-3000€ (reach regionale)

**ROI atteso**: 5-10x su cena San Valentino (alto valore percepito)

---

**Ultimo aggiornamento**: 2026-02-06
**Owner**: Torri dell'Acqua Marketing Team
