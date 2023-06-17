var CACHE_NAME = 'pwa-task-manager';
var urlsToCache = [
  '/',
  '/completed'
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  var cacheWhitelist = ['pwa-task-manager'];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

//to be considered
// let cacheData = "pwa-task-manager";
// this.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(cacheData). then((cache) => {
//       cache.addAll([
//         '/static/js/main.chunk.js',
//         '/static/js/0. chunk.js',
//         '/static/js/0.bundle.js',
//         '/index.html',
//       ])
//     })
//   )
// })

// this.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request). then(resp => {
//       if (resp) return resp;
//     })
//   )
// })