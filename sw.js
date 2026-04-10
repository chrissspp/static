importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.codecs.js');
importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.worker.js');

const scramjet = new ScramjetServiceWorker({
    prefix: '/service/',
    codec: 'xor',
    bare: 'https://bare.duckdns.org/'
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/service/')) {
        event.respondWith(
            (async () => {
                try {
                    // Bypass broken loadConfig calls
                    return await scramjet.fetch(event);
                } catch (err) {
                    console.error("Worker fetch failed:", err);
                    return fetch(event.request);
                }
            })()
        );
    }
});
