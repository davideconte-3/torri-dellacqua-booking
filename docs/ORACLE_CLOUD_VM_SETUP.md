# Creare una VM su Oracle Cloud (Always Free)

Guida passo-passo per creare una VM gratuita su Oracle Cloud e usarla (es. per TastyIgniter o altri servizi self-hosted).

---

## 1. Registrazione account Oracle Cloud

1. Vai su **[oracle.com/cloud/free](https://www.oracle.com/cloud/free/)** e clicca **Start for free**.
2. Compila il form (email, paese, nome). Scegli una **Home Region** (es. Frankfurt, Milan, Phoenix). La regione non si può cambiare dopo.
3. Inserisci **carta di credito** per la verifica. Oracle non addebita nulla se resti nel limite “Always Free”; evita di superare i limiti o di attivare risorse a pagamento.
4. Verifica email e telefono. Al termine hai un **tenancy** (account) e accedi alla console: **[cloud.oracle.com](https://cloud.oracle.com)**.

---

## 2. Creare una rete (VCN) con accesso internet

Serve una Virtual Cloud Network con un gateway verso internet (per SSH e per il sito).

1. Dalla **Console** (menu ≡ in alto a sinistra) vai in **Networking** → **Virtual cloud networks**.
2. Assicurati di essere nel **compartment** corretto (es. root o uno che hai creato). Clicca **Start VCN Wizard**.
3. Scegli **Create VCN with Internet Connectivity** → **Next**.
4. Imposta:
   - **VCN name**: es. `vcn-main`
   - **Compartment**: il tuo
   - **IPv4 CIDR Blocks**: lascia il default **10.0.0.0/16** (rete privata 10.0.0.0–10.0.255.255; non è l’IP pubblico della VM). Se chiede CIDR per le subnet, di solito sono già compilati (es. 10.0.0.0/24 per la subnet pubblica).
   - Lascia le altre opzioni di default (anche i nomi delle subnet)
5. Clicca **Next** → **Create**. Verranno creati: VCN, subnet pubbliche/private, Internet Gateway, route table, ecc.

### 2b. Se la VCN esiste ma non ha subnet (creare la subnet a mano)

Se hai già la VCN (es. `vcn-main`) e nella pagina **Subnets** vedi “No items to display”:

1. Nella VCN clicca **Create Subnet**.
2. Compila così:
   - **Name**: `subnet-public` (o un nome a piacere).
   - **Create In Compartment**: lascia il tuo compartment (es. davideconte01 root).
   - **Subnet Type**: **Regional (Recommended)**.
   - **IPv4 CIDR Block**: **`10.0.0.0/24`** (deve essere dentro il CIDR della VCN, es. 10.0.0.0/16).
   - **Route Table**: **Default Route Table for vcn-main** (o quella della tua VCN).
   - **Subnet Access**: **Public Subnet** (Allow public IP addresses for Instances in this Subnet). Così le VM in questa subnet possono avere IP pubblico.
   - **Security List**: scegli **Default Security List for vcn-main** (poi aggiungerai le regole per porte 22, 80, 443 nella sez. 3).
   - Lascia **Private Subnet** deselezionato.
   - DNS / DHCP: puoi lasciare i default.
3. Clicca **Create Subnet**. Dopo la creazione, quando crei l’istanza (Compute → Instances) seleziona “Select existing subnet” e scegli questa subnet.

---

## 3. Aprire le porte nel firewall (Security List)

Per SSH e per un sito web (HTTP/HTTPS) devi permettere il traffico in ingresso.

1. Sempre in **Networking** → **Virtual cloud networks**, apri la VCN che hai creato.
2. Nel menu a sinistra clicca **Security Lists**. Apri la security list della **subnet pubblica** (es. `Default Security List for vcn-main`).
3. Clicca **Add Ingress Rules** e aggiungi **tre regole** (se non ci sono già):

| Stateless | Source CIDR   | IP Protocol | Destination Port Range | Descrizione |
|-----------|---------------|-------------|-------------------------|-------------|
| No        | 0.0.0.0/0     | TCP         | 22                      | SSH         |
| No        | 0.0.0.0/0     | TCP         | 80                      | HTTP        |
| No        | 0.0.0.0/0     | TCP         | 443                     | HTTPS       |

- **Source CIDR**: `0.0.0.0/0`
- **Destination port range**: `22` (poi `80`, poi `443`)
- Clicca **Add Ingress Rules** per ogni regola se le aggiungi una alla volta.

Salva. La subnet pubblica ora accetta SSH (22) e web (80, 443).

---

## 4. Creare la VM (Compute Instance)

1. Menu ≡ → **Compute** → **Instances**.
2. Clicca **Create instance**.

Compila così:

- **Name**: es. `tastyigniter` o `gestionale`.
- **Placement**: **Availability Domain**: se vedi “Out of capacity for shape VM.Standard.E2.1.Micro” in AD-1, cambia in **AD-2** (o **AD-3** se presente). Le VM Always Free vanno create nella **home region**; puoi solo cambiare l’availability domain. Se non specifichi un fault domain, lascialo su “No preference”.
- **Image and shape**:
  - **Image**: **Change**. Cerca **Ubuntu** (es. Ubuntu 22.04) e selezionalo.
  - **Shape**: **Change**. Seleziona **VM.Standard.E2.1.Micro** (AMD, Always Free). Se non lo vedi, in “Shape” filtra per “AMD” e cerca “VM.Standard.E2.1.Micro”.  
    Se compare “Out of host capacity”, prova un altro Availability Domain o riprova più tardi.
- **Networking**:
  - **Primary VNIC**: scegli **Create new virtual cloud network** (così Oracle crea VCN + subnet in un colpo) oppure seleziona la VCN creata prima.
  - **Subnet**: se vedi “Select existing subnet” e **No matches found**, passa al radio **Create new public subnet** (crea una nuova subnet pubblica per questa VM). Se hai già una VCN con subnet pubblica, seleziona quella.
  - **Public IPv4 address**: **Assign a public IPv4 address** (deve essere assegnato).
- **Add SSH keys**:
  - **Generate a key pair for me**: Oracle genera e scarica una chiave. Salva la chiave **privata** (`.key`) in un posto sicuro; ti serve per connetterti.  
  - Oppure **Upload public key**: incolla la tua chiave pubblica (contenuto di `~/.ssh/id_rsa.pub` o simile).

3. Clicca **Create**. Attendi che lo **State** diventi **Running** (1–2 minuti).

4. Annota:
   - **Public IP address** (nella pagina dell’istanza).
   - **Username** per SSH: per Ubuntu è `ubuntu` (Oracle lo mostra nella pagina dell’istanza sotto “Access”).

---

## 5. Connettersi in SSH

Dal tuo PC (terminale):

```bash
ssh -i /percorso/alla/chiave.privacy.key ubuntu@<PUBLIC_IP>
```

Esempio se la chiave si chiama `ssh-key-2025-01-15.key` e l’IP è `123.45.67.89`:

```bash
chmod 600 ssh-key-2025-01-15.key
ssh -i ssh-key-2025-01-15.key ubuntu@123.45.67.89
```

Alla prima connessione accetta il fingerprint (scrivi `yes`). Se tutto ok sei dentro la VM come utente `ubuntu`.

---

## 6. (Opzionale) Aggiornare il sistema e installare Docker

Utile se vuoi usare la VM per TastyIgniter con Docker.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${VERSION_CODENAME:-$VERSION_ID}") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker ubuntu
```

Esci e rientra in SSH (o fai `newgrp docker`) così il gruppo `docker` sia attivo. Poi puoi usare `docker` e `docker compose` senza `sudo`.

Per TastyIgniter segui poi la guida in `docs/TASTYIGNITER_SELF_HOSTED.md` (Docker + docker-compose).

---

## 7. Dominio e HTTPS (opzionale)

- **Solo IP**: puoi accedere al servizio con `http://<PUBLIC_IP>` (es. `http://123.45.67.89`). Per HTTPS servirebbe un dominio e un certificato.
- **Con dominio**: punta un dominio (o sottodominio) all’IP pubblico della VM (record A). Sulla VM installa Nginx (o il reverse proxy che usi) e **Certbot** per Let’s Encrypt:
  ```bash
  sudo apt install -y nginx certbot python3-certbot-nginx
  sudo certbot --nginx -d tuodominio.it
  ```

---

## Riepilogo rapido

| Passo | Dove | Cosa fare |
|-------|------|-----------|
| 1 | oracle.com/cloud/free | Registrati, verifica carta, scegli home region |
| 2 | Networking → VCN | Create VCN with Internet Connectivity |
| 3 | VCN → Security List (subnet pubblica) | Ingress rules per TCP 22, 80, 443 da 0.0.0.0/0 |
| 4 | Compute → Instances | Create instance: Ubuntu, shape VM.Standard.E2.1.Micro, subnet pubblica, IP pubblico, chiave SSH |
| 5 | Terminale | `ssh -i chiave.key ubuntu@<IP>` |
| 6 | In VM | `apt update && apt upgrade`, install Docker se serve |
| 7 | Opzionale | Dominio + Certbot per HTTPS |

**Limitazioni Always Free**: 2 VM AMD (1 vCPU, 1 GB RAM ciascuna), 200 GB block storage. La VM resta free finché non la elimini e non superi i limiti del tier.

**“Out of capacity” per VM.Standard.E2.1.Micro**: Oracle spesso non ha posto in un solo availability domain. Cosa fare:
1. **Cambia Availability Domain**: nella schermata Create instance, in **Placement** seleziona **AD-2** (o **AD-3** se la region ne ha tre) invece di AD-1, poi riprova Create.
2. **Fault domain**: se c’è il campo, imposta “No preference” (non forzare un fault domain specifico).
3. **Riprova più tardi**: se in tutti gli AD dà errore, riprova dopo qualche ora o il giorno dopo; i posti free si liberano quando altri utenti eliminano le istanze.
