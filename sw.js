/* Glory · Attività tecniche — service worker (funzionamento offline)
   Quando pubblichi una nuova versione: aumenta il numero qui sotto, VER in index.html e "ver" in version.json (tutti uguali). */
const CACHE = "glory-v64";
const SHARE = "glory-share";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(x => x !== CACHE && x !== SHARE).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

/* Risponde subito dalla copia salvata e intanto scarica l'eventuale versione nuova. */
/* "Condividi" › Glory: riceve il file della scheda, lo mette da parte e apre l'app che lo carica */
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method === "POST" && u.pathname.endsWith("/share-target")) {
    e.respondWith((async () => {
      let t = "";
      try {
        const fd = await e.request.formData();
        const f = fd.get("file");
        t = f && typeof f.text === "function" ? await f.text() : String(fd.get("text") || "");
      } catch (err) {}
      const c = await caches.open(SHARE);
      await c.put("pending", new Response(t));
      return Response.redirect(new URL("./?condivisa=1", self.registration.scope).href, 303);
    })());
    return;
  }
  if (e.request.method !== "GET") return;
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
