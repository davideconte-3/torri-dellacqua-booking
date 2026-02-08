# Conversions API Gateway – Configurazione rapida (senza codice)

L’uso del **Conversions API Gateway** di Meta permette di inviare gli stessi eventi del Pixel anche tramite una connessione server-to-server (Conversions API). In questo modo Meta riceve dati di marketing più completi, migliora l’attribuzione e la targetizzazione delle inserzioni e può aumentare il ROI delle campagne.

Non serve scrivere codice: la configurazione si fa da **Events Manager** e, se scegli il Gateway gestito, Meta si occupa dell’infrastruttura.

---

## Perché usarlo

- **Dati più completi**: eventi sia dal browser (Pixel) sia dal server (CAPI), con migliore attribuzione.
- **Meno perdite**: ad blocker e restrizioni cookie impattano meno sugli eventi server.
- **Migliore targetizzazione**: Meta ottimizza meglio le campagne con più segnali.
- **Setup senza codice**: nessuna modifica al codice della booking-platform; il Pixel che usi già resta invariato.

---

## Prerequisiti

- **Meta Pixel** già installato e funzionante sul sito (es. `NEXT_PUBLIC_META_PIXEL_ID` in `.env`).
- Accesso a **Meta Business Suite** / **Events Manager** con permessi di amministrazione sul Pixel.
- (Solo se scegli l’hosting cloud) Account **AWS** o **GCP** per il deployment del Gateway (Meta guida il setup con template precompilati).

Se il Pixel non è ancora configurato, segui prima [META_PIXEL_SETUP.md](./META_PIXEL_SETUP.md).

---

## Configurazione rapida (Events Manager)

### Passo 1: Avvio da Events Manager

1. Vai su [Meta Business Suite](https://business.facebook.com) e apri **Events Manager**.
2. Seleziona il **Pixel** usato dalla booking-platform.
3. Apri la scheda **Impostazioni** (Settings).
4. Nella sezione **"Set up with Conversions API Gateway"** clicca **Get started** (Inizia).

### Passo 2: Prerequisiti e preferenze

1. Controlla i prerequisiti mostrati e clicca **Next**.
2. **Preferenze** (consigliato):
   - **Enhance events**: attiva per migliorare attribuzione e qualità degli eventi.
   - **Health monitoring**: attiva per permettere a Meta di monitorare il Gateway.
3. Scegli il **cloud** (AWS o GCP) e la **regione** di hosting.
4. Clicca **Next** (oppure **Copy URL** se un altro utente deve completare il deployment su AWS/GCP).

### Passo 3: Deployment su AWS (esempio)

Se hai scelto AWS:

1. Si apre la console **CloudFormation** (o il flusso equivalente per GCP) con i campi già compilati.
2. **Non modificare** il campo `ProvisioningData`.
3. Clicca **Create stack**.
4. Attendi il completamento (circa 30–40 minuti). Lo stato diventerà **CREATE_COMPLETE**.
5. Nella scheda **Outputs** dello stack copia il valore di **CapigSetupURL**: serve per l’Admin UI del Gateway.

### Passo 4: Verifica raccolta dati

1. Apri **CapigSetupURL** (dall’Outputs o da Events Manager).
2. Al primo accesso crea un account admin per la **Conversions API Gateway Admin UI**.
3. Dopo il login vedrai l’interfaccia del Gateway. All’inizio server e browser possono essere a 0; i dati possono impiegare da 5 minuti a 2 ore a popolarsi.
4. Visita il sito della booking-platform e genera qualche evento (pagina, prenotazione, ecc.); ricarica la pagina se serve.
5. In **Events Manager**, nella vista del Pixel, puoi controllare il volume eventi: la **linea verde** = eventi server (CAPI), la **linea blu** = eventi browser (Pixel).

A questo punto non serve nessuna modifica al codice: gli eventi che il Pixel invia già (PageView, Lead, InitiateCheckout, ecc.) vengono usati anche dal Gateway per inviare gli stessi eventi via Conversions API.

---

## (Opzionale) Dominio personalizzato

Per ottimizzare routing e costi, in **Conversions API Gateway Admin UI** puoi impostare un dominio personalizzato:

1. Login alla Admin UI → **Settings** → **Domain management**.
2. Scegli tra **AWS Certificate Manager (ACM)** o **Cloudflare** e segui le istruzioni Meta per DNS e certificati.

Riferimento: [Conversions API Gateway - Setup Guide](https://developers.facebook.com/docs/marketing-api/gateway-products/conversions-api-gateway/setup/).

---

## Monitoraggio

- **Events Manager** → Pixel → grafici eventi: confronta eventi browser (blu) e server (verde).
- **Admin UI** del Gateway: stato, volumi e configurazioni.
- In caso di problemi: [Conversions API Gateway - Troubleshooting](https://developers.facebook.com/docs/marketing-api/gateway-products/troubleshooting-guide).

---

## Riepilogo

| Cosa | Dove |
|------|------|
| Avvio setup | Events Manager → Pixel → Impostazioni → "Set up with Conversions API Gateway" → Get started |
| Deployment | AWS o GCP (template Meta, nessun codice custom) |
| Verifica | CapigSetupURL → Admin UI; Events Manager → volume eventi (verde = CAPI) |
| Codice booking-platform | Nessuna modifica richiesta; il Pixel esistente è sufficiente |

Dopo questa configurazione, la booking-platform continua a usare solo il Pixel lato client; il Gateway aggiunge in automatico l’invio degli stessi eventi via Conversions API per dati di marketing più completi e un migliore ROI.
