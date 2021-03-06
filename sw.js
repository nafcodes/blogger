const precacheVersion = 2;
const precacheName = 'precache-v' + precacheVersion;
const precacheFiles = [
  "https://cdn.nafcodes.com/assets/icons/favicon-194x194.png",
  "https://cdn.nafcodes.com/assets/icons/favicon-194x194.png",
  "https://cdn.nafcodes.com/assets/built/offline.css",
  "https://www.nafcodes.com/p/offline.html"
];

self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Installed');
  self.skipWaiting();

  e.waitUntil(
    caches.open(precacheName).then((cache) => {
      console.log('[ServiceWorker] Precaching files');
      return cache.addAll(precacheFiles);
    }) // end caches.open()
  ); // end e.waitUntil
});

self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] Activated');

  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((thisCacheName) => {

        if (thisCacheName.includes("precache") && thisCacheName !== precacheName) {
          console.log('[ServiceWorker] Removing cached files from old cache - ', thisCacheName);
          return caches.delete(thisCacheName);
        }

      }));
    }) // end caches.keys()
  ); // end e.waitUntil
});

self.addEventListener('fetch', (e) => {

  const requestURL = new URL(e.request.url);
  if (!e.request.referrer.includes(requestURL.hostname)) {
    return e.respondWith(fetch(e.request));
  }

  e.respondWith(
    caches.match(e.request)
      .then((response) => {

        if (response) {
          console.log("[ServiceWorker] Found in cache", e.request.url);
          return response;
        }

        return fetch(e.request)
          .then((fetchResponse) => fetchResponse)
          .catch((err) => {
            // If offline
            const isHTMLPage = e.request.method === "GET" && e.request.headers.get("accept").includes("text/html");
            if (isHTMLPage) return caches.match("/offline/");
          });

    }) // end caches.match(e.request)
  ); // end e.respondWith
});