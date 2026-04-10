importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.codecs.js');
importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.worker.js');

const scramjet = new ScramjetServiceWorker({
    prefix: '/service/',
    codec: 'xor',
    bare: 'https://bare.duckdns.org/'
});

self.addEventListener('fetch', (event) => {
    // Only handle requests that go through our /service/ prefix
    if (event.request.url.includes('/service/')) {
        event.respondWith(
            (async () => {
                try {
                    // We let the engine handle the fetch directly
                    return await scramjet.fetch(event);
                } catch (err) {
                    console.error("Proxy error:", err);
                    return fetch(event.request);
                }
            })()
        );
    }
});
