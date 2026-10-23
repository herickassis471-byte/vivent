
const CACHE = "vivent-v2";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg"
];

self.addEventListener("install", evento => {
  evento.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys().then(chaves =>
      Promise.all(
        chaves
          .filter(chave => chave !== CACHE)
          .map(chave => caches.delete(chave))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", evento => {
  if (evento.request.method !== "GET") return;

  evento.respondWith(
    caches.match(evento.request).then(guardado => {
      if (guardado) return guardado;

      return fetch(evento.request).catch(() => {
        if (evento.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
