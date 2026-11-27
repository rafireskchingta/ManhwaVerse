const STATIC_CACHE_NAME = 'manhwaverse-static-v1.8.0';
const API_CACHE_NAME = 'manhwaverse-api-v1.8.0';
const IMAGE_CACHE_NAME = 'manhwaverse-images-v1.8.0';

// Aset inti antarmuka (App Shell) untuk fungsi offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Event Install: Cache aset dasar App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching App Shell v1.8.0');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Event Activate: Bersihkan seluruh cache versi lama
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE_NAME, API_CACHE_NAME, IMAGE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (!currentCaches.includes(key)) {
            console.log('[Service Worker] Menghapus cache lama:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Event Fetch: Strategi caching cerdas multi-tier
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Tangani Navigasi Halaman (HTML): Network-first dengan fallback App Shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedIndex = await caches.match('/index.html');
          if (cachedIndex) return cachedIndex;
          return caches.match('/');
        })
    );
    return;
  }

  // 2. Hanya proses GET request untuk caching
  if (event.request.method !== 'GET') {
    return;
  }

  // 3. Tangani API GET Requests (Katalog komik, detail komik, karakter, genre, tracker)
  if (url.pathname.startsWith('/api/')) {
    // Jangan cache endpoint autentikasi (login, register, me, refresh) atau read-link dinamis
    if (url.pathname.includes('/auth/') || url.pathname.includes('/read-link')) {
      return;
    }

    // Strategi Network-First dengan Cache Fallback untuk data yang pernah diakses
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          return new Response(
            JSON.stringify({
              success: false,
              offline: true,
              data: null,
              message: 'Data ini belum pernah diakses sebelumnya dan tidak tersedia di cache offline.'
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // 4. Tangani Gambar (Cover komik, foto karakter, icon, Unsplash, Supabase, Shinigami CDN)
  const isImageRequest =
    event.request.destination === 'image' ||
    /\.(png|jpg|jpeg|svg|webp|gif|avif)(\?.*)?$/i.test(url.pathname) ||
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('shinigami.gg') ||
    url.hostname.includes('shinigami.mx');

  if (isImageRequest) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              (networkResponse.status === 200 || networkResponse.type === 'opaque')
            ) {
              const responseToCache = networkResponse.clone();
              caches.open(IMAGE_CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            return caches.match('/favicon.svg');
          });
      })
    );
    return;
  }

  // 5. Tangani Kode JS/CSS/Vite/Font: NETWORK-FIRST dengan Cache Fallback
  // Memastikan perubahan kode terbaru selalu dimuat saat online, namun tetap bisa jalan saat offline!
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === 'basic' || url.hostname.includes('fonts.gstatic.com'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
