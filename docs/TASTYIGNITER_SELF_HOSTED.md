# TastyIgniter self-hosted: guida e integrazione

Guida per hostare TastyIgniter in autonomia e collegarlo al sito prenotazioni (Next.js) tramite API.

---

## 1. Cos’è TastyIgniter

- **Stack**: PHP (Laravel), MySQL/MariaDB. Licenza MIT.
- **Funzioni**: ordini (sala, asporto, delivery), **prenotazioni tavoli**, multi-location, menu, gestione clienti, report. Estensioni per prenotazioni e API REST.
- **Repo**: [github.com/tastyigniter/TastyIgniter](https://github.com/tastyigniter/TastyIgniter)

---

## 2. Requisiti server (self-hosted)

- **PHP**: 8.2+ (TastyIgniter 3.x), **8.3+** (TastyIgniter 4.x). Estensioni PHP tipiche: pdo_mysql, mbstring, openssl, json, curl, gd, ecc.
- **Database**: MySQL 5.7+ o **MariaDB 10.3+**
- **Web server**: Nginx o Apache con mod_rewrite
- **Opzionale**: Redis per cache (consigliato in produzione)

Per un singolo ristorante bastano **1 CPU, 1–2 GB RAM, 10–20 GB disco**. VPS da 5–10 €/mese (es. Hetzner, DigitalOcean, Contabo) sono sufficienti.

---

## 2b. Dove hostare gratis (free tier)

Opzioni realistiche per tenere TastyIgniter senza costi mensili (con limiti e compromessi).

| Opzione | Tipo | Pro | Contro |
|--------|------|-----|--------|
| **Oracle Cloud Always Free** | VPS (VM reale) | 1–2 VM sempre attive (AMD micro o Ampere), 200 GB storage, niente scadenza. Puoi installare Docker e TastyIgniter come in sez. 3. | Richiede registrazione (carta per verifica; non addebitano se resti nel free tier). Setup iniziale più tecnico (firewall, SSH, dominio). |
| **Free PHP hosting** (InfinityFree, 000webhost, free-hosting.org, my-php.net) | Shared hosting | Gratis, pannello tipo cPanel, PHP + MySQL. Alcuni hanno installer per Laravel. | PHP può essere 7.x o 8.0; TastyIgniter vuole **8.2+**. Spesso niente SSH/Composer da riga di comando, limiti di esecuzione e storage. Installazione manuale di TastyIgniter (upload, dipendenze) può essere fragile. Adatto più a prove che a uso “sempre on” per un ristorante. |
| **Render / Railway (free tier)** | PaaS con container | Puoi deployare un’app in container (es. PHP). | Free tier di solito **sospende** il servizio dopo inattività (cold start). Il gestionale deve essere sempre raggiungibile; non ideale. In più servirebbe un DB esterno (MySQL gestito), che spesso non è incluso gratis. |

**Raccomandazione per “free” serio**

- **Oracle Cloud Always Free** è l’unica opzione davvero “hosting free” adatta a TastyIgniter: è un VPS vero, sempre acceso, dove installi Docker (o PHP+MySQL) e segui la guida della sez. 3. Dopo la registrazione crei una VM (es. Ubuntu), apri porte 80/443, installi Docker e il docker-compose di TastyIgniter. Puoi puntare un dominio (anche gratuito tipo DuckDNS o un sottodominio) e usare Let’s Encrypt per HTTPS.
- **Free PHP hosting**: usabile solo per **prove** se il provider offre PHP 8.2+ e abbastanza controllo (es. Composer, cartelle scrivibili). Controlla sempre la versione PHP nel pannello prima di provarci.
- Per un ristorante in produzione, se il free tier non basta (limiti, instabilità), un VPS a 4–6 €/mese (Hetzner, Contabo, ecc.) resta la scelta più semplice e affidabile.

**Link rapidi**

- Oracle Cloud Free Tier: [oracle.com/cloud/free](https://www.oracle.com/cloud/free/)
- Esempi free PHP: [InfinityFree](https://infinityfree.net), [000webhost](https://www.000webhost.com), [my-php.net](https://my-php.net)

---

## 3. Installazione

### Opzione A: Docker (consigliata)

Docker evita di configurare PHP/MySQL a mano e funziona uguale su qualsiasi VPS.

1. **Clonare uno starter Docker** (es.):
   ```bash
   git clone https://github.com/GrantBartlett/tastyigniter-docker-starter.git
   cd tastyigniter-docker-starter
   ```

2. **Configurare ambiente**:
   ```bash
   cp .env-example .env
   # Modificare .env: nome DB, user, password (devono coincidere con quelli usati sotto)
   ```

3. **Avviare i container** (produzione):
   ```bash
   docker-compose build app
   docker-compose up -d
   ```

4. **Installare TastyIgniter** (prima volta):
   ```bash
   docker-compose exec app ./install.sh
   ```
   Quando chiede:
   - **Database host**: `mysql` (nome del servizio nel docker-compose)
   - **Database name / user / password**: come in `.env`

5. Aprire nel browser l’URL del server (es. `http://tuo-ip` o il dominio puntato al VPS). Completare la wizard di setup (admin, sito, ecc.).

**Nota**: altri template Docker esistono (es. [zscontributor/tastyigniter-docker-main](https://github.com/zscontributor/tastyigniter-docker-main)); la logica è analoga (docker-compose con PHP + MySQL/MariaDB).

### Opzione B: installazione manuale (VPS con PHP/MySQL già presenti)

1. Requisiti: PHP 8.2+ (o 8.3+ per TI 4.x), MySQL/MariaDB, Composer.
2. Clonare o scaricare TastyIgniter dalla [documentazione ufficiale](https://tastyigniter.com/docs/installation) (o da GitHub).
3. Configurare virtual host (Nginx/Apache) con document root sulla cartella `public` di TastyIgniter.
4. Creare il database e l’utente MySQL; lanciare l’installer web o da riga di comando come da docs.

---

## 4. Estensioni necessarie per prenotazioni + integrazione

Dopo l’installazione base:

1. **Reservation** ([ti-ext-reservation](https://github.com/tastyigniter/ti-ext-reservation))  
   - Aggiunge la gestione prenotazioni tavoli (date, orari, numero ospiti, tavoli, location).  
   - Si installa dal backend TastyIgniter (Extensions) o da marketplace.

2. **API** ([ti-ext-api](https://github.com/tastyigniter/ti-ext-api))  
   - Espone API REST (incluso l’endpoint prenotazioni).  
   - Autenticazione con **Laravel Sanctum** (token).  
   - Si installa come sopra; in seguito si crea un token con permessi `reservations:write` (e se serve `reservations:read`).

In TastyIgniter:

- Creare almeno una **Location** (il ristorante).
- Configurare **Tables** (tavoli) per quella location (opzionale ma utile).
- Creare uno **staff** o un utente da usare per l’API, generare un **token API** con capacità di scrittura prenotazioni.

Documentazione API (reservations): [ti-ext-api/docs/reservations.md](https://github.com/tastyigniter/ti-ext-api/blob/master/docs/reservations.md).

---

## 5. API prenotazioni (riepilogo per l’integrazione)

- **Base URL**: `https://tuo-dominio-tastyigniter.it` (senza trailing slash).
- **Autenticazione**: header `Authorization: Bearer <token>` (token Sanctum generato nel backend TastyIgniter).
- **Creare una prenotazione**: `POST /api/reservations`

**Campi utili per il payload** (allineati al nostro form):

| Campo API TastyIgniter | Obbligatorio | Mappatura dal nostro Booking |
|------------------------|-------------|------------------------------|
| `location_id`          | Sì          | ID della location (es. 1). Va configurato una volta in TastyIgniter. |
| `table_id`             | No          | 0 se non assegnate tavoli, altrimenti ID tavolo. |
| `guest_num`            | Sì          | `guests` (numero ospiti) |
| `first_name`          | Sì (2–32 caratteri) | Prima parola di `customerName` o nome intero se un solo token. |
| `last_name`            | Sì (2–32 caratteri) | Resto di `customerName` o ripeti nome se un solo token. |
| `email`                | Sì          | `customerEmail` |
| `telephone`            | No          | `customerPhone` |
| `reserve_date`         | Sì          | `date` in formato **Y-m-d** (es. 2026-02-14) |
| `reserve_time`         | Sì          | `time` in formato **H:i** (es. 20:00) |
| `comment`              | No          | `notes` |

**Esempio body** (JSON):

```json
{
  "location_id": 1,
  "table_id": 0,
  "guest_num": 2,
  "first_name": "Mario",
  "last_name": "Rossi",
  "email": "mario@esempio.it",
  "telephone": "+39 333 1234567",
  "reserve_date": "2026-02-14",
  "reserve_time": "20:00",
  "comment": "Tavolo in veranda se possibile"
}
```

**Risposta 201**: oggetto con `data[].attributes` (reservation_id, reserve_date_time, status_id, hash, ecc.). In caso di errore (4xx/5xx) la risposta contiene il messaggio di validazione o errore.

---

## 6. Integrazione con questo progetto (Next.js)

Obiettivo: quando un utente invia una prenotazione dal sito (POST a `/api/bookings`), creare anche la prenotazione su TastyIgniter in modo che sala/tavoli siano gestiti lì.

### 6.1 Variabili d’ambiente

Aggiungere in `.env` (e in `.env.example` come documentazione):

```env
# TastyIgniter (opzionale - se vuoto l'integrazione è disattivata)
TASTYIGNITER_BASE_URL="https://gestionale.tuodominio.it"
TASTYIGNITER_API_TOKEN="il-token-sanctum-generato-dal-backend-tastyigniter"
TASTYIGNITER_LOCATION_ID=1
```

- `TASTYIGNITER_BASE_URL`: URL pubblico dell’installazione TastyIgniter (senza trailing slash).
- `TASTYIGNITER_API_TOKEN`: token con permesso `reservations:write`.
- `TASTYIGNITER_LOCATION_ID`: ID della location (ristorante) in TastyIgniter.

### 6.2 Logica nel backend Next.js

In `src/app/api/bookings/route.ts`, **dopo** aver creato la prenotazione in Prisma e (opzionalmente) dopo aver inviato le email:

1. Se `TASTYIGNITER_BASE_URL` e `TASTYIGNITER_API_TOKEN` sono impostati:
2. Costruire nome/cognome da `customerName` (es. split su primo spazio: `first_name` = prima parte, `last_name` = resto; se una sola parola usare quella per entrambi e accorciare/adeguare per rispettare 2–32 caratteri).
3. Formattare `date` in Y-m-d e `time` in H:i.
4. Fare `POST ${TASTYIGNITER_BASE_URL}/api/reservations` con header `Authorization: Bearer ${TASTYIGNITER_API_TOKEN}` e body JSON come sopra.
5. Non bloccare la risposta al cliente in caso di errore TastyIgniter: loggare l’errore e restituire comunque 201 (la prenotazione è già salvata nel DB). Opzionale: salvare in un campo o in una tabella di log l’eventuale `reservation_id` restituito da TastyIgniter per riferimento.

### 6.3 Mapping nome/cognome

Il nostro form ha un unico campo `customerName`. Esempio di split:

```ts
const parts = (data.customerName || '').trim().split(/\s+/);
const firstName = parts[0]?.slice(0, 32) || 'Cliente';
const lastName = (parts.length > 1 ? parts.slice(1).join(' ') : parts[0] || 'Cliente').slice(0, 32);
```

In questo modo si rispettano i vincoli first_name/last_name (2–32 caratteri) richiesti dall’API.

---

## 7. Flusso operativo consigliato

1. **Hosting**: VPS con Docker; dominio (o sottodominio) che punta al server, SSL (Let’s Encrypt).
2. **TastyIgniter**: installazione via Docker; una Location “Torri dell’Acqua”; tavoli definiti se serve; estensioni Reservation + API; token API creato e copiato in `.env`.
3. **Sito prenotazioni**: form e DB restano la fonte “ufficiale” per il cliente (email di conferma, pagina /prenotazioni). L’integrazione invia una copia della prenotazione a TastyIgniter per uso sala/tavoli/comande.
4. **Sala**: usa TastyIgniter per vedere prenotazioni, assegnare tavoli, gestire comande; il sito continua a raccogliere le richieste e a inviare le email.

---

## 7b. Scontrini, cassa e fiscale (Italia)

**Cosa offre TastyIgniter (stampanti / cassa)**

- **Stampanti termiche (cucina / ricevuta)**: sì, tramite estensioni a pagamento.
  - **Thoughtco Printer** (~75 €/anno): stampanti ESC/POS (USB, rete IP) o Epson ePOS; più stampanti per location; stampa comande in cucina e ricevute. Richiede WebUSB (HTTPS) per USB oppure un proxy per stampanti di rete.
  - **Star CloudPRNT** (~50 €/anno): stampanti Star Micronics con CloudPRNT (es. TSP654II, TSP743II, ecc.).
- **Cassa (cash drawer)**: non c’è un’estensione dedicata documentata. Molte stampanti ESC/POS hanno un’uscita per cassetto; l’apertura del cassetto di solito si fa inviando un comando ESC/POS. In teoria si può integrare se l’estensione printer espone comandi raw o se si sviluppa un’estensione custom; non è “chiavi in mano”.
- **Scontrino fiscale italiano (invio all’Agenzia / RT)**: TastyIgniter **non** gestisce la normativa italiana (registratore telematico, lotteria scontrini, invio documenti all’Agenzia). È un software generico; la parte fiscale va gestita a parte.

**Come avere scontrini fiscali e cassa in Italia**

Puoi affiancare a TastyIgniter (o al tuo flusso prenotazioni/comande) una di queste strade:

| Soluzione | Ruolo | Come si integra |
|-----------|--------|------------------|
| **API scontrino elettronico** | Invio scontrini all’Agenzia senza RT fisico | Il tuo software (o un middleware) invia i dati di vendita a un servizio via API; loro trasmettono all’Agenzia. Esempi: **OpenAPI** (openapi.it – scontrini elettronici), **Apiscontrino** (apiscontrino.com). Costi per documento (es. 0,01–0,05 €/scontrino). Non sostituiscono TastyIgniter: quando in cassa “chiudi scontrino”, chiami l’API con importo e dati; lo scontrino viene registrato a norma. |
| **Registratore telematico (RT) / POS fiscale** | Hardware o app che emette scontrino e invia all’Agenzia | Es. **Epson RT**, **DropPOS**, **Do Your Order** + stampante fiscale Epson. Alcuni sono “tutto in uno” (touch + stampante + invio fiscale). Si usano in cassa per l’incasso; le comande possono restare su TastyIgniter e a fine servizio si “battono” gli importi sul RT. Nessuna integrazione diretta TastyIgniter ↔ RT: flusso operativo separato (sala su TI, cassa su RT). |
| **Software gestionale italiano con fiscale incluso** | Comande + scontrini + (opz.) prenotazioni in un solo prodotto | Es. **ShoppiX2**, **Fatturapertutti** (kit ristorante), **DropPOS**: gestiscono comande, stampanti (anche fiscali) e invio documenti. In questo caso TastyIgniter non è necessario per la cassa; lo useresti solo se ti serve ordini online / prenotazioni avanzate e li colleghi via API o export. |

**Sintesi pratica**

- **Solo stampante cucina / ricevuta non fiscale**: TastyIgniter + estensione Printer (Thoughtco o Star) va bene.
- **Scontrino fiscale in Italia**: serve un canale verso l’Agenzia (RT o API). TastyIgniter non lo fa; usi in parallelo:
  - un **servizio API** (OpenAPI, Apiscontrino, ecc.) e fai un piccolo sviluppo (es. “bottone chiudi scontrino” che chiama l’API con totale e dati), oppure  
  - un **RT / POS fiscale** in cassa e tieni TastyIgniter per comande/prenotazioni (senza integrazione automatica scontrino).
- **Cassa (cassetto portamonete)**: con stampante ESC/POS spesso il cassetto si comanda dalla stessa stampante; va verificato se l’estensione Thoughtco espone un’azione “apri cassetto” o se serve sviluppo custom.

Link utili: [Thoughtco Printer](https://tastyigniter.com/marketplace/item/thoughtco-printer), [Star CloudPRNT](https://tastyigniter.com/marketplace/item/cupnoodles-starcloudprnt), [OpenAPI Scontrini](https://openapi.it/prodotti/scontrini-elettronici-italia), [Apiscontrino](https://apiscontrino.com).

---

## 7c. Traduzioni interfaccia admin (italiano)

Se l’admin resta in inglese dopo aver aggiunto la lingua Italiano (it_IT) e aver copiato i file, di solito il motivo è il **path sbagliato**.

### Path corretto (v3)

TastyIgniter carica le override delle lingue dalla **root dell’installazione** (dove si trova `artisan`), non dalla cartella del modulo admin. La struttura deve essere:

```
<root TastyIgniter>/
  language/
    it_IT/
      admin/
        lang.php
```

Quindi il file italiano per l’admin va in: **`language/it_IT/admin/lang.php`**.

- **Sbagliato**: mettere i file in `app/admin/language/it_IT/` o in `v3-admin/app/admin/language/it_IT/` (quel path è interno al modulo e non viene usato per le override).
- **Sbagliato**: usare la cartella `lang/` (senza “uage”) per le override v3; in v3 si usa `language/`.

### Cosa fare sul server

1. **Individua la root TastyIgniter** (dove ci sono `artisan`, `composer.json`). In Docker può essere tipo `/home/www-user/site/tastyigniter` o il path del volume montato per l’app.

2. **Crea la struttura e copia il file**:
   ```bash
   mkdir -p /path/alla/root/tastyigniter/language/it_IT/admin
   # Copia qui il tuo lang.php italiano (es. da uno zip o da language/it_IT/ se già presente altrove)
   cp /percorso/del/tuo/lang.php /path/alla/root/tastyigniter/language/it_IT/admin/lang.php
   ```

3. **Imposta proprietario e permessi** (come utente web, es. www-data):
   ```bash
   chown -R www-data:www-data /path/alla/root/tastyigniter/language
   ```

4. **Pulisci la cache**:
   ```bash
   cd /path/alla/root/tastyigniter && php artisan cache:clear && php artisan config:clear
   ```

5. **Imposta la lingua admin**: in admin vai su **Admin (icona) > Edit Details > Languages** e seleziona **Italiano (it_IT)**. Salva.

### Compatibilità v3 / v4

- I **language pack** scaricati da [translate.tastyigniter.com](https://translate.tastyigniter.com) per la **v4** hanno struttura diversa (es. `v4-admin/.../admin.php`) e path di destinazione `lang/vendor/igniter/<locale>/`. Quella struttura è per la v4.
- Per la **v3** serve un file che riproduca le **stesse chiavi** di `language/en/lang.php` del modulo admin (namespace `admin::lang`). Se usi uno zip pensato per v4, le chiavi o i nomi file potrebbero non coincidere; in quel caso o si cerca un pack per v3, o si adatta il contenuto copiando la struttura delle chiavi da [ti-module-admin/language/en/lang.php](https://github.com/tastyigniter/ti-module-admin/blob/3.x/language/en/lang.php) e traducendo i valori in italiano in `language/it_IT/admin/lang.php`.

### Pagina Translations “0% translated”

La pagina **Localization > Languages > Translations** può mostrare 0% perché legge le stringhe dal database (locale strings) o da altri moduli. Anche se lì vedi 0%, l’admin può comunque passare in italiano se il file `language/it_IT/admin/lang.php` è nel path corretto e la lingua è selezionata in Edit Details > Languages.

### Se ancora non funziona: diagnostica e path alternativi

**1. Trova la root reale** (nel container come root):

```bash
docker-compose exec -u root app sh -c 'ARTISAN=$(find /home /var -name artisan -type f 2>/dev/null | head -1); TI_ROOT=$(dirname "$ARTISAN"); echo "TI_ROOT=$TI_ROOT"; ls -la "$TI_ROOT/language/it_IT/admin/" 2>/dev/null; ls -la "$TI_ROOT/lang/" 2>/dev/null'
```

Usa il `TI_ROOT` stampato nei comandi sotto se è diverso da `/home/www-user/site/tastyigniter`.

**2. Copia in entrambi i path (language/ e lang/) e pulisci cache**

```bash
docker-compose exec -u root app sh -c '
TI_ROOT="/home/www-user/site/tastyigniter"
mkdir -p "$TI_ROOT/language/it_IT/admin" "$TI_ROOT/lang/it_IT/admin"
SRC="$TI_ROOT/language/it_IT/admin/lang.php"
[ -f "$SRC" ] || SRC=$(find /tmp -maxdepth 3 -name "lang.php" -path "*it_IT*" 2>/dev/null | head -1)
if [ -f "$SRC" ]; then cp -f "$SRC" "$TI_ROOT/language/it_IT/admin/lang.php"; cp -f "$SRC" "$TI_ROOT/lang/it_IT/admin/lang.php"; fi
chown -R www-data:www-data "$TI_ROOT/language" "$TI_ROOT/lang"
cd "$TI_ROOT" && php artisan cache:clear && php artisan config:clear
echo "Fatto."
'
```

**3. Imposta la lingua per l'utente admin**

In admin: icona in alto a destra > Edit Details > Languages: seleziona Italiano (it_IT), salva. Poi logout e login (o prova in incognito).

**4. Se lo zip è per v4**

I pack da translate.tastyigniter.com per v4 hanno file tipo `admin.php` e path `lang/vendor/igniter/it_IT/`. In v3 servono le stesse chiavi del file inglese del modulo admin; altrimenti le voci restano in inglese. Riferimento: [ti-module-admin language/en/lang.php](https://github.com/tastyigniter/ti-module-admin/blob/3.x/language/en/lang.php).

---

## 8. Link utili

- TastyIgniter: [tastyigniter.com](https://tastyigniter.com), [GitHub](https://github.com/tastyigniter/TastyIgniter)
- Documentazione: [tastyigniter.com/docs](https://tastyigniter.com/docs)
- Reservation: [ti-ext-reservation](https://github.com/tastyigniter/ti-ext-reservation)
- API (reservations): [ti-ext-api/docs/reservations.md](https://github.com/tastyigniter/ti-ext-api/blob/master/docs/reservations.md)
- Docker starter: [GrantBartlett/tastyigniter-docker-starter](https://github.com/GrantBartlett/tastyigniter-docker-starter)

Se vuoi, il passo successivo è implementare nel codice l’invio a TastyIgniter in `src/app/api/bookings/route.ts` (con le env e il mapping sopra).
