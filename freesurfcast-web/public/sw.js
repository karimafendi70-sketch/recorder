/* ── FreeSurfCast Service Worker ──────────────── *
 *  Lightweight: caches shell + offline fallback.
 *  Network-first for everything else.
 * ─────────────────────────────────────────────── */

const CACHE_NAME = "freesurfcast-v1";
const OFFLINE_URL = "/offline.html";

/* Pre-cache the offline fallback on install */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        OFFLINE_URL,
        "/icons/icon-192.png",
        "/icons/icon-512.png",
      ])
    )
  );
  self.skipWaiting();
});

/* Clean old caches on activate */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* Network-first with offline fallback for navigations */
self.addEventListener("fetch", (event) => {
  /* Only handle GET requests */
  if (event.request.method !== "GET") return;

  /* Navigation requests → network-first, fallback to offline page */
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(OFFLINE_URL)
      )
    );
    return;
  }

  /* Static assets: cache-first for icons/fonts, network-first otherwise */
  if (
    event.request.url.includes("/icons/") ||
    event.request.url.includes("/manifest")
  ) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) => cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
      )
    );
    return;
  }

  /* Everything else: network only (no unnecessary caching) */
});
