const STATIC_CACHE_NAME = 'manhwaverse-static-v1.1.0';
const API_CACHE_NAME = 'manhwaverse-api-v1.1.0';
const IMAGE_CACHE_NAME = 'manhwaverse-images-v1.1.0';

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
      console.log('[Service Worker] Pre-caching App Shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Event Activate: Bersihkan cache versi usang
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
      fetch(event.request).catch(async () => {
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
    // Jangan cache endpoint autentikasi (login, register, me, refresh)
    if (url.pathname.includes('/auth/')) {
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
          // Cari respons yang sudah pernah di-cache sebelumnya
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // Fallback respons JSON jika belum pernah dibuka dan sedang offline
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

  // 4. Tangani Gambar (Cover komik, foto karakter, icon, Unsplash, Supabase storage)
  const isImageRequest =
    event.request.destination === 'image' ||
    /\.(png|jpg|jpeg|svg|webp|gif|avif)(\?.*)?$/i.test(url.pathname) ||
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('supabase.co');

  if (isImageRequest) {
    // Strategi Cache-First dengan Network Fallback
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
            // Jika gambar gagal dimuat saat offline, fallback ke favicon lokal
            return caches.match('/favicon.svg');
          });
      })
    );
    return;
  }

  // 5. Tangani Aset Statis Lainnya (JS, CSS, Font Web): Cache-First dengan Network Fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
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
      });
    })
  );
});
