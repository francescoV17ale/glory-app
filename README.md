# Glory 2.0 · rapportini tecnici Glory CI-5 / CI-10 / CI-10X

App per i tecnici (telefono) e programma **Glory Archivio** (PC e telefono) per raccogliere e consultare i lavori della squadra.
Tutto è statico (HTML + JavaScript, nessun server): pubblicato con GitHub Pages su `https://francescov17ale.github.io/glory-app/`.

## File
| Percorso | Cosa contiene |
|---|---|
| `index.html` | L'app Glory 2.0: schede (installazione, preparazione, riparazione, in loco, altre attività, ritiro), note per il rapportino, PDF, foto, DDT, archivio lavori, invio al PC. Un unico file, JavaScript ES5 senza librerie. |
| `sw.js`, `version.json`, `manifest.webmanifest` | Funzionamento offline, controllo aggiornamenti, installazione. |
| `pdf.min.mjs`, `pdf.worker.min.mjs` | pdf.js (legacy 6.2.108), usato solo per leggere i DDT in PDF e per l'anteprima PDF nel programma. |
| `archivio/` | Programma Glory Archivio (`index.html`, `sw.js`, `manifest.webmanifest`). Per PDF e Mail al magazzino carica l'app in una finestra nascosta e ne usa le funzioni. |
| `note/` | Pagina «Note rapportino» (tasti che copiano le note standard). |
| `Glory.apk` | App Android (TWA creata con PWABuilder) che apre `https://francescov17ale.github.io/glory-app/` e si aggiorna con il sito. |

## Pubblicare un aggiornamento
- App: aumentare insieme `VER` in `index.html`, `"ver"` in `version.json` e `CACHE` (`glory-vNN`) in `sw.js`.
- Programma: aumentare `CACHE` (`glory-archivio-vNN`) in `archivio/sw.js`.
- Il push su `main` pubblica il sito; app e programma si aggiornano da soli alla riapertura.

## Dove stanno i dati
- **Telefono**: scheda in corso in `localStorage` (chiavi `gla_*`), archivio lavori e foto in IndexedDB `glory_archivio`.
- **Invio al PC**: l'app crea un file JSON `Archivio Glory - <tecnico> - N lavori - <data>.txt` con i lavori nuovi o aggiornati (`{glory:2, pc:1, dev, saved, tec, arc:[…]}`; ogni lavoro ha un codice unico `u`). Il file va direttamente nella cartella Google Drive condivisa, oppure si condivide a mano.
- **Programma**: IndexedDB `glory_pc` (store `lav` per codice `u`, store `cfg`). Etichette, commenti e lavori eliminati della squadra stanno in `_archivio/_team-<pc>.json` nella cartella condivisa (unione per voce, vince la data più recente).
- Su GitHub non passa nessun dato dei lavori.

## Google Drive
- Progetto Google Cloud con client OAuth web (ID nelle costanti `GD` in entrambe le pagine) e cartella condivisa (ID in `GD.fid`). Ambito `https://www.googleapis.com/auth/drive`; app in modalità prova (utenti di prova).
- Accesso con reindirizzamento OAuth (`response_type=token`, funziona anche nell'APK). Token di 1 ora in `localStorage` (`gla_gtok`), condiviso tra app e programma; rinnovo automatico con `prompt=none` e `login_hint`.
- URI di reindirizzamento autorizzati: `…/glory-app/` e `…/glory-app/archivio/`.
- Struttura della cartella: file dei tecnici · `_archivio/` (file di squadra) · `_importati/` (file vecchi spostati dal «PC principale»).
- In alternativa il programma legge una cartella del PC (File System Access API), con la stessa struttura.

## Accesso all'app
Password comune per la squadra (hash `PWH` in `index.html`): è solo un filtro, non una protezione. Per un login vero (per esempio con il CRM aziendale) va sostituita la schermata di accesso in `index.html`.

## Spostare su un dominio aziendale
- Pubblicare gli stessi file su un altro hosting statico; aggiornare origine e URI di reindirizzamento del client Google (o sostituire Drive con lo spazio aziendale: le funzioni da cambiare sono `gUp` nell'app e `gSync`/`gTeam`/`gPulisci` nel programma).
- L'APK è legato al dominio: va rigenerato (PWABuilder › Android, stesso Package ID `io.github.francescov17ale.glory` e stessa chiave di firma se si vuole aggiornare quello installato). I lavori si portano con Backup › Carica backup.
