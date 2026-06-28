/* ============================================================
   ANIMA — service worker. Makes the whole cabinet work offline
   and installable. Cache-first, with runtime caching for the rest
   (fonts, images). Bump VERSION to ship updates.
   ============================================================ */
const VERSION = "anima-v3";
const CORE = [
  "./",
  "index.html",
  "codex/index.html",
  "conway/index.html",
  "primordia/index.html",
  "flux/index.html",
  "morphogenesis/index.html",
  "resonance/index.html",
  "mycelia/index.html",
  "folia/index.html",
  "animalcula/index.html",
  "anima-nav.js",
  "favicon.svg",
  "manifest.webmanifest",
  "og-image.png",
  "fonts/anima-fonts.css",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION)
      // ignore individual failures so one missing file can't break install
      .then((c) => Promise.allSettled(CORE.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== location.origin) return; // leave cross-origin alone
  e.respondWith(
    caches.match(req).then((hit) =>
      hit ||
      fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => (req.mode === "navigate" ? caches.match("index.html") : undefined))
    )
  );
});
