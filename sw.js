// This pulls the engine from the web so you don't need the file
importScripts('https://cdn.jsdelivr.net/gh/MercuryWorkshop/scramjet@main/dist/scramjet.all.js');

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener('fetch', (event) => {
    event.respondWith(
        (async () => {
            if (scramjet.route(event)) {
                return scramjet.fetch(event);
            }
            return fetch(event.request);
        })()
    );
});
