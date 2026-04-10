// Load all necessary parts of the engine
importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.codecs.js');
importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.worker.js');

// Hardcode the config to prevent "prefix undefined" errors
const scramjet = new ScramjetServiceWorker({
    prefix: '/service/',
    codec: 'xor',
    bare: 'https://bare.duckdns.org/'
});

self.addEventListener('fetch', (event) => {
    // Check if the request is for the proxy
    if (event.request.url.includes('/service/')) {
        event.respondWith(
            (async () => {
                try {
                    // Ensure config is loaded before fetching
                    await scramjet.loadConfig();
                    return await scramjet.fetch(event);
                } catch (err) {
                    console.error("Proxy Fetch Error:", err);
                    return fetch(event.request);
                }
            })()
        );
    }
});
