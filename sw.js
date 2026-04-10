// Load the engine from a stable CDN
importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.codecs.js');
importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.worker.js');

// Define the config inside the worker so it never loses its "prefix"
const scramjet = new ScramjetServiceWorker({
    prefix: '/service/',
    codec: 'xor',
    bare: 'https://bare.duckdns.org/'
});

self.addEventListener('fetch', (event) => {
    // Only intercept requests for our proxy service
    if (event.request.url.includes('/service/')) {
        event.respondWith(scramjet.fetch(event));
    }
});
