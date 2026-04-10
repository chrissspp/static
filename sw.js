importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.codecs.js');
importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.worker.js');

const scramjet = new ScramjetServiceWorker();

self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin + '/service/')) {
        event.respondWith(scramjet.fetch(event));
    }
});
