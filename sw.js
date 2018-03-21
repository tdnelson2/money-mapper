const cacheVersion = {{ cacheVersion }};


const appName = 'money-mapper';
const staticCacheName = `${appName}-v${cacheVersion}`;

const contentImgsCache = 'mm-content-imgs';

const allCaches = [
  staticCacheName,
  contentImgsCache
];

let usedBGPhotos = [];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        'https://picsum.photos/list',
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

  if (requestUrl.href.startsWith('https://picsum.photos/') && requestUrl.href !== 'https://picsum.photos/list') {
    event.resondWith(servePhoto(event.request, requestUrl));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

const servePhoto = (request, requestUrl) => {
  console.log('request is: ', request);
  console.log('requestURL is: ', requestUrl);
  console.log('request.url is: ', request.url);
  console.log('requestUrl.search is: ', requestUrl.search);
  return caches.open(contentImgsCache).then(cache => {
    cache.keys().then(keys => {
      for (let key of keys) {
        if (!usedBGPhotos.includes(key.url)) {
          usedBGPhotos.push(key.url);
          return cache.match(key).then(response => {
            return response;
          });
        }
      }
    });
    return fetch(request).then(networkResponse => {
      console.log('networkResponse: ', networkResponse.clone());
      cache.put(request.url, networkResponse.clone());
      return networkResponse;
    });
  });
}

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});