/* eslint-disable*/
/* eslint-disable no-console*/
const CACHE_NAME = `MOVIES_V1.0`;

self.addEventListener(`install`, (evt) => {
  console.log(`sw, install`, {evt});
  evt.waitUntil(
      caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `/`,
          `/index.html`,
          `/bundle.js`
        ]);
      })
  );
});

self.addEventListener(`activate`, (evt) => {
  console.log(`sw`, `activate`, {evt});
});

self.addEventListener(`fetch`, (evt) => {
  console.log(`fetch`, {evt, request: evt.request});
  evt.respondWith(
      caches.match(evt.request)
      .then((response) => {
        console.log(`Find in cache`, {response});
        if (response) {
          return response;
        } else {
          return fetch(evt.request)
            .then(function (response) {
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(evt.request, response.clone()));

              return response.clone();
            });
        }
      })
      .catch((err) => console.error({err}))
  );
});
