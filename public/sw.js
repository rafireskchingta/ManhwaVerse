const CACHE_NAME = 'manhwaverse-v1.0.0';

// Aset inti kerangka antarmuka (App Shell) untuk fungsi offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Event Install: Cache aset dasar
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching App Shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Event Activate: Bersihkan cache versi lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Menghapus cache lama:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Event Fetch: Strategi caching cerdas
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // PENTING: Jangan cache request API dan endpoint autentikasi
  if (url.pathname.startsWith('/api/')) {
    return; // Biarkan browser menangani network biasa
  }

  // Hanya proses GET request
  if (event.request.method !== 'GET') {
    return;
  }

  // Untuk navigasi halaman (HTML), gunakan Network-first dengan fallback App Shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Untuk aset statis (CSS, JS, gambar aset lokal): Cache First dengan Network Fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Hanya cache response yang valid dari domain sendiri
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic' &&
            !url.pathname.startsWith('/api/')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback offline jika gagal memuat
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
    })
  );
});
