const CACHE_NAME = `MOVIES_V1.0`;

const addToCache = (evt, response) => {
  caches.open(CACHE_NAME)
    .then((cache) => cache.put(evt.request, response));
};

self.addEventListener(`install`, (evt) => {
  const openCache = caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `./`,
        `./index.html`,
        `./bundle.js`,
        `./css/`,
        `./images/`,
      ]);
    });

  evt.waitUntil(openCache);
});


self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
      fetch(evt.request)
      .then((response) => {
        addToCache(evt, response.clone());

        return response.clone();
      })
      .catch(() => {
        return caches.match(evt.request)
          .then((response) => {
            return response;
          })
          .catch((err) => {
            throw err;
          });
      })
  );
});
