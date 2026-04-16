importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.codecs.js');
importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.worker.js');

// This initializes the proxy engine and prevents the 'rewriters' undefined error
const scramjet = new ScramjetServiceWorker();

self.addEventListener('fetch', (event) => {
    // This captures the request and runs it through the unblocker
    if (event.request.url.includes('/service/')) {
        event.respondWith(scramjet.fetch(event));
    }
});
