// Service worker — cache l'app pour qu'elle s'ouvre même sans réseau
const CACHE = "hk-carburant-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // On ne met JAMAIS en cache les envois vers Make (POST) : on laisse passer.
  if (e.request.method !== "GET") return;
  // App shell : cache d'abord, réseau ensuite
  if (ASSETS.some((a) => e.request.url.endsWith(a.replace("./", "")))) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
  }
});
