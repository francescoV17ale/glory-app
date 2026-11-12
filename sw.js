/* Glory · Attività tecniche — service worker (funzionamento offline)
   Quando pubblichi una nuova versione: aumenta il numero qui sotto, VER in index.html e "ver" in version.json (tutti uguali). */
const CACHE = "glory-v41";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

/* Risponde subito dalla copia salvata e intanto scarica l'eventuale versione nuova. */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (e.request.cache === "no-store" || u.pathname.endsWith("version.json")) return; // controllo aggiornamenti: sempre dalla rete
  e.respondWith(
    caches.open(CACHE).then(c =>
      c.match(e.request, { ignoreSearch: true }).then(hit => {
        const net = fetch(e.request)
          .then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; })
          .catch(() => hit || (e.request.mode === "navigate" ? c.match("index.html") : undefined));
        return hit || net;
      })
    )
  );
});
