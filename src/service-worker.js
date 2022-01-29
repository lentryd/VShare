// Обновления и всякое такое
workbox.core.skipWaiting();
workbox.core.clientsClaim();

// Кэширование данных
workbox.core.setCacheNameDetails({ prefix: "vshare" });
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Офлайн доступ
workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL("index.html"),
  {
    blacklist: [/\/__\//],
  }
);
