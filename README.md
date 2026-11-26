# Glory 2.0 · rapportini tecnici Glory CI-5 / CI-10 / CI-10X

App per i tecnici (telefono) e programma **Glory Archivio** (PC e telefono) per raccogliere e consultare i lavori della squadra, con una cartella Google Drive condivisa come punto comune.
Tutto è statico (HTML + JavaScript, nessun server): pubblicato con GitHub Pages su `https://francescov17ale.github.io/glory-app/`.

## File
| Percorso | Cosa contiene |
|---|---|
| `index.html` | L'app Glory 2.0: schede (installazione, preparazione, riparazione, in loco, altre attività, ritiro), note per il rapportino, PDF, foto (fotocamera e galleria), DDT, archivio lavori, invio a Drive, In arrivo, etichette. JavaScript ES5 senza librerie. Con `?edit=1` si apre in modalità modifica (usata dal programma PC: niente salvataggi locali, `window.edOpen(r)` / `window.edGet()`). |
| `shared.js` | Funzioni comuni ad app e programma: accesso a Google Drive (OAuth a reindirizzamento, token, caricamento file), codice cliente CRM (`crm`), codice RMA (`rmaGen`), Mail con Outlook sul web. |
| `sw.js`, `version.json`, `manifest.webmanifest` | Funzionamento offline, controllo aggiornamenti, installazione. |
| `pdf.min.mjs`, `pdf.worker.min.mjs` | pdf.js (legacy 6.2.108): lettura dei DDT in PDF e anteprima PDF nel programma. |
| `archivio/` | Programma Glory Archivio (`index.html`, `sw.js`, `manifest.webmanifest`). Per PDF, Mail al magazzino e Modifica usa l'app in una finestra (iframe). |
| `note/` | Pagina «Note rapportino» (tasti che copiano le note standard). |
| `Glory.apk` | App Android (TWA creata con PWABuilder) che apre il sito e si aggiorna con esso. |

## Pubblicare un aggiornamento
- App: aumentare insieme `VER` in `index.html`, `"ver"` in `version.json` e `CACHE` (`glory-vNN`) in `sw.js`.
- Programma: aumentare `CACHE` (`glory-archivio-vNN`) in `archivio/sw.js`.
- Se cambia `shared.js`, aumentare entrambi.
- Il push su `main` pubblica il sito; app e programma si aggiornano alla riapertura.

## Dati
- **Telefono**: schede in corso in `localStorage` (chiavi `gla_*`); archivio lavori e foto in IndexedDB `glory_archivio`. Ogni lavoro ha un codice unico `u` (`<dispositivo>-<id>`, o quello ricevuto). Eliminare sposta nel cestino (`del` = data): dopo 30 giorni il lavoro viene cancellato. Indice della squadra in `gla_ix`; nome scelto dalla squadra in `gla_me` (id) e `gla_tec`.
- **Programma**: IndexedDB `glory_pc` versione 2: store `lav` (lavori senza foto, `nph` = numero foto, `src` = id del file Drive da cui arriva), store `ph` (foto per codice `u`, caricate solo quando servono: dettaglio, PDF, Modifica, Rimetti, Riprendi, Salva tutto), store `cfg`. Unione dei lavori per `u`: vince la data `d` più recente.
- Su GitHub non passa nessun dato dei lavori.

## Cartella Google Drive condivisa
| Posizione | Chi scrive | Contenuto |
|---|---|---|
| radice | app (Invia al PC) | `Archivio Glory - <tecnico> - N lavori - <data>.txt`: `{glory:2, pc:1, dev, saved, tec, arc:[lavori]}` |
| `_archivio/` | programma e app | `_team-<pc>.json` / `_team-app-<dispositivo>.json`: dati di squadra `{defs, tg, cm, hid, sp, al, pr, sq, sqc}` (etichette, assegnazioni etichette, commenti, eliminati, stato spedizione, allegati, «preso da», nomi della squadra, nome scelto da quale telefono). Unione per voce con `ts` più recente. Il «PC principale» scrive anche `_indice.json` (`{ix:1, l:[{u,v,n,d,st,t,c,m,e,f,p}]}`): indice leggero per lo storico nell'app, `f` = file Drive da cui scaricare il lavoro completo. |
| `_rma/` | programma (Genera RMA, Rimetti in arrivo) e app (Passa a un collega) | `<u>.json`: lavori «in arrivo» (`arr:{a, ts, pass?}`), mostrati nell'app in «In arrivo»; chi lo prende scrive `pr[u]`. |
| `_modifiche/` | programma (Modifica) | `<u>.json`: versione corretta (`mod:[{a, ts}]`), letta da tutti i PC e dal telefono del tecnico. |
| `_allegati/` | programma | file allegati, elencati in `al`. |
| `_importati/` | «PC principale» | file dei tecnici già importati da più di 30 giorni. |
| `_backup/` | «PC principale» | `Glory backup - <data>.json` una volta a settimana (lavori senza foto, etichette, commenti, squadra); si tengono gli ultimi 4. Le foto restano nei file dei tecnici. Si ripristina con Importa file. |

- Client OAuth web e ID della cartella nelle costanti `GD` di `shared.js`. Ambito `https://www.googleapis.com/auth/drive`; app in modalità prova (utenti di prova su Google Cloud, progetto `bustling-joy-515709-g0`).
- URI di reindirizzamento autorizzati: `…/glory-app/` e `…/glory-app/archivio/`.
- Token di 1 ora in `localStorage` (`gla_gtok`), condiviso tra app e programma; rinnovo automatico con `prompt=none` e `login_hint` (al massimo ogni 10 minuti).
- Senza Drive il programma importa i file a mano (Importa file); l'app condivide schede e lavori come file.

## Accesso all'app
Password comune per la squadra (hash `PWH` in `index.html`): è solo un filtro, non una protezione. Per un login vero (per esempio con il CRM aziendale) va sostituita la schermata di accesso in `index.html`.

## Spostare su un dominio aziendale
- Pubblicare gli stessi file su un altro hosting statico; aggiornare origine e URI di reindirizzamento del client Google, oppure sostituire Drive con lo spazio aziendale: tutte le chiamate passano da `shared.js` (`gFetch`, `gUp`) e dalle funzioni `gSync`, `gTeam`, `gPulisci`, `cloudPut`, `corrOut` (programma) e `tSync`, `passTo`, `pcBox` (app).
- L'APK è legato al dominio: va rigenerato (PWABuilder › Android, stesso Package ID `io.github.francescov17ale.glory` e stessa chiave di firma per aggiornare quello installato). I lavori si portano con Backup › Carica backup.
