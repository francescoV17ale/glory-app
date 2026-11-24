/* Glory Archivio (PC): funzionamento offline. Aumenta il numero quando pubblichi una nuova versione. */
const CACHE = "glory-archivio-v13";
const FILES = ["./", "index.html", "manifest.webmanifest", "../index.html", "../icon-192.png", "../icon-512.png", "../icon-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith("glory-archivio-") && x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url); if (u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { if (r && r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(h => h || caches.match("index.html"))));
});
