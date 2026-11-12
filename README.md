# Glory · Attività tecniche — app installabile (PWA)

## File
- `index.html` — l'app (schede, note rapportino, PDF, foto, backup, **archivio lavori**)
- `manifest.webmanifest` — nome, icona e colori dell'app installata
- `sw.js` — fa funzionare l'app anche offline
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` — icone

## Pubblicazione su GitHub Pages (una volta sola)
1. Su github.com crea un nuovo repository **pubblico**, es. `glory-app`.
2. "Add file" → "Upload files": carica tutti i file di questa cartella (non serve LEGGIMI.md). "Commit changes".
3. Settings → Pages → Source: "Deploy from a branch", Branch: `main`, cartella `/ (root)` → Save.
4. Dopo 1–2 minuti l'app è su `https://TUONOME.github.io/glory-app/`.

## Installazione sul telefono
Apri il link con Chrome → tasto "Installa l'app su questo dispositivo" nel menù (oppure ⋮ → "Installa app").

## Aggiornare l'app
1. Carica il nuovo `index.html` sul repository.
2. Aumenta lo stesso numero in tre punti: `VER` in `index.html`, `"ver"` in `version.json`, `CACHE` in `sw.js` (es. 38 / `glory-v38`).
3. Nell'app compare "È disponibile un aggiornamento"; in ogni caso il tasto "Cerca aggiornamenti" in fondo al menù lo controlla subito.

## Dove stanno i dati
Tutto resta sul dispositivo (schede in corso, archivio e foto). Il backup completo dal menù comprende schede e archivio: salvalo ogni tanto.

## APK (più avanti)
Con l'app online: pwabuilder.com → incolla il link → "Package for stores" → Android.
