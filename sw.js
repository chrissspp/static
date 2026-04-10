importScripts('./scramjet.codecs.js');
importScripts('./scramjet.worker.js');

/**
 * Scramjet Service Worker
 * This file intercepts all network requests from the iframe 
 * and rewrites them to bypass "Refused to Connect" errors.
 */

const sw = new ScramjetServiceWorker();

self.addEventListener('fetch', (event) => {
    // Only intercept requests that are meant for the proxy
    if (event.request.url.startsWith(self.location.origin + '/service/')) {
        event.respondWith(sw.fetch(event));
    }
});
