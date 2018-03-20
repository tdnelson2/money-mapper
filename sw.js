const cacheVersion = {{ cacheVersion }};


const appName = 'money-mapper';
const staticCacheName = `${appName}-v${cacheVersion}`;

const contentImgsCache = 'mm-content-imgs';

const allCaches = [
  staticCacheName,
  contentImgsCache
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
    {{#each cachePaths}}
        '{{this}}',
    {{/each}}
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith(appName) &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin && requestUrl.pathname === '/') {
    event.respondWith(caches.match('index.html'));
    return;
  }

  if (requestUrl.startsWith('https://picsum.photos/')) {
    event.resondWith(servePhoto(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

const servePhoto = request => {
  return caches.open(contentImgsCache).then(cache => {
    return cache.match(request.url).then(response => {
      if (response) return response;
      return fetch(request).then(networkResponse => {
        cache.put(request.url, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});