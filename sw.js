const CACHE_NAME = "directorio-emergencias-v2.4.2";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",

  "./favicon.png",
  "./preview.jpg",
  "./herocubarral.jpg",

  "./logobomberos.png",
  "./logopolicia.png",
  "./logohospital.png",
  "./logodefensacivil.png",
  "./logobiter7.png",
  "./logollanogas.png",
  "./logoemsa.png",

  "./icon-192.png",
  "./icon-512.png",

  "./qr-directorio.png",

  "./app.js",

  
];

// INSTALACIÓN

self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {

        console.log("Guardando archivos para uso offline");

        return cache.addAll(urlsToCache);

      })

  );

});

// ACTIVACIÓN

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if (key !== CACHE_NAME) {

            return caches.delete(key);

          }

        })

      );

    })

  );

  self.clients.claim();

});

// FETCH

self.addEventListener("fetch", event => {

  // Navegación principal

  if (event.request.mode === "navigate") {

  event.respondWith(

    caches.match(event.request)

      .then(response => {

        return response || caches.match("./index.html");

      })

      .then(response => {

        return response || fetch(event.request);

      })

  );

  return;

}

  // Demás recursos

  event.respondWith(

    caches.match(event.request)

      .then(cachedResponse => {

        if (cachedResponse) {

          return cachedResponse;

        }

        return fetch(event.request)

          .then(networkResponse => {

            const responseClone =
              networkResponse.clone();

            caches.open(CACHE_NAME)

              .then(cache => {

                cache.put(
                  event.request,
                  responseClone
                );

              });

            return networkResponse;

          })

          .catch(() => {

            return caches.match(event.request);

          });

      })

  );

});
