importScripts('./scramjet.config.js');
importScripts('./scramjet.codecs.js');
importScripts('./scramjet.worker.js');

// -----------------------------
// Service Worker lifecycle fix
// -----------------------------
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// -----------------------------
// Scramjet init
// -----------------------------
const scramjet = new ScramjetServiceWorker(self.__scramjet$config);

// -----------------------------
// Fetch handler
// -----------------------------
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    if (url.includes('/service/')) {
        event.respondWith((async () => {
            try {
                return await scramjet.fetch(event);
            } catch (err) {
                console.error("Scramjet error:", err);
                return fetch(event.request);
            }
        })());
    }
});
