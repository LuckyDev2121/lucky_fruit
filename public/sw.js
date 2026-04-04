const CACHE_VERSION = "v1";
const STATIC_CACHE = `game-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `game-runtime-${CACHE_VERSION}`;
const API_CACHE = `game-api-${CACHE_VERSION}`;

const BACKEND_ORIGIN = "https://funint.site";
const GAME_ASSET_FILES = [
  "bet-amount-1M.svg",
  "bet-amount-10k.svg",
  "bet-amount-100.svg",
  "bet-amount-100k.svg",
  "bet-amount-1000.svg",
  "fruit-avocado.svg",
  "fruit-bg-frame.svg",
  "fruit-cheri.svg",
  "fruit-container-frame.svg",
  "fruit-game-name.svg",
  "fruit-graps.svg",
  "fruit-lemon.svg",
  "fruit-orange.svg",
  "fruit-stroberry.svg",
  "fruit-tomato.svg",
  "fruit-watermalon.svg",
  "time-Counting-board.svg",
  "diamond-icon.svg",
];

const PRECACHE_URLS = [
  "/",
  "/index.html",
  ...GAME_ASSET_FILES.map(
    (fileName) => `${BACKEND_ORIGIN}/core/storage/app/public/${fileName}`,
  ),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              ![STATIC_CACHE, RUNTIME_CACHE, API_CACHE].includes(key),
          )
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

function isStaticAsset(requestUrl) {
  return (
    requestUrl.origin === self.location.origin &&
    [".js", ".css", ".png", ".jpg", ".jpeg", ".svg", ".woff", ".woff2"].some(
      (extension) => requestUrl.pathname.endsWith(extension),
    )
  );
}

function isBackendAsset(requestUrl) {
  return (
    requestUrl.origin === BACKEND_ORIGIN &&
    requestUrl.pathname.startsWith("/core/storage/app/public/")
  );
}

function isApiGet(request) {
  const requestUrl = new URL(request.url);
  return request.method === "GET" && requestUrl.pathname.includes("/api/");
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkPromise;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    throw new Error("Network request failed and no cache entry exists.");
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (isStaticAsset(requestUrl) || isBackendAsset(requestUrl)) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  if (isApiGet(request)) {
    event.respondWith(networkFirst(request, API_CACHE));
  }
});
