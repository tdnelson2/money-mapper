const cacheVersion = {{ cacheVersion }};


const appName = 'money-mapper';
const staticCacheName = `${appName}-v${cacheVersion}`;

const contentImgsCache = 'mm-content-imgs';

const allCaches = [
  staticCacheName,
  contentImgsCache
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        'https://picsum.photos/list',
    {{#each cachePaths}}
        '{{this}}',
    {{/each}}
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith(appName) &&
                 !allCaches.includes(cacheName);
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin && requestUrl.pathname === '/') {
    event.respondWith(caches.match('index.html'));
    return;
  }

  if (requestUrl.href.startsWith('https://picsum.photos/') && requestUrl.href !== 'https://picsum.photos/list') {
    event.respondWith(servePhoto(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

const servePhoto = request => {
  const storageUrl = request.url.replace(/\d+\/\d+\//, '');

  return caches.open(contentImgsCache).then(cache => {
    return cache.match(storageUrl).then(response => {
      if (response) return response;

      return fetch(request).then(networkResponse => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});