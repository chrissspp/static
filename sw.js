importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.codecs.js');
importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.worker.js');

// We define the config directly inside the worker to avoid the 'undefined' error
const scramjet = new ScramjetServiceWorker({
    prefix: '/service/',
    codec: 'xor',
    bare: 'https://bare.duckdns.org/'
});

self.addEventListener('fetch', (event) => {
    // Check if the request is trying to go through our proxy prefix
    if (event.request.url.includes('/service/')) {
        event.respondWith(scramjet.fetch(event));
    }
});
