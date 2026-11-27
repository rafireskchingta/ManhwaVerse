// Layanan penyimpanan offline lokal berbasis IndexedDB dengan fallback LocalStorage
// Menyimpan data komik, karakter, genre, dan tracker yang pernah diakses pengguna agar bisa dibuka saat offline.

const DB_NAME = 'manhwaverse_offline_db';
const DB_VERSION = 3;

const STORES = {
  COMICS: 'comics',
  CHARACTERS: 'characters',
  GENRES: 'genres',
  COLLECTIONS: 'collections'
};

class OfflineStorage {
  constructor() {
    this.db = null;
    this.initPromise = this.initDB();
  }

  async initDB() {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[OfflineStorage] IndexedDB tidak didukung, menggunakan LocalStorage fallback.');
      return null;
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const tx = event.target.transaction;

          if (!db.objectStoreNames.contains(STORES.COMICS)) {
            db.createObjectStore(STORES.COMICS, { keyPath: 'id' });
          } else if (event.oldVersion < 3) {
            tx.objectStore(STORES.COMICS).clear();
          }

          if (!db.objectStoreNames.contains(STORES.CHARACTERS)) {
            db.createObjectStore(STORES.CHARACTERS, { keyPath: 'id' });
          } else if (event.oldVersion < 3) {
            tx.objectStore(STORES.CHARACTERS).clear();
          }

          if (!db.objectStoreNames.contains(STORES.GENRES)) {
            db.createObjectStore(STORES.GENRES, { keyPath: 'id' });
          }

          if (!db.objectStoreNames.contains(STORES.COLLECTIONS)) {
            db.createObjectStore(STORES.COLLECTIONS, { keyPath: 'key' });
          } else if (event.oldVersion < 3) {
            tx.objectStore(STORES.COLLECTIONS).clear();
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onerror = (err) => {
          console.warn('[OfflineStorage] Gagal membuka IndexedDB:', err);
          resolve(null);
        };
      } catch (e) {
        console.warn('[OfflineStorage] Exception saat inisialisasi IndexedDB:', e);
        resolve(null);
      }
    });
  }

  async getDB() {
    if (!this.db) {
      await this.initPromise;
    }
    return this.db;
  }

  // Helper generik untuk menyimpan item ke IndexedDB
  async setItem(storeName, item) {
    const db = await this.getDB();
    if (!db) {
      try {
        localStorage.setItem(`mv_${storeName}_${item.id || item.key}`, JSON.stringify(item));
      } catch (e) {
        console.warn('[OfflineStorage] LocalStorage setItem error:', e);
      }
      return item;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put(item);
        tx.oncomplete = () => resolve(item);
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Helper generik untuk mengambil item dari IndexedDB
  async getItem(storeName, key) {
    const db = await this.getDB();
    if (!db) {
      try {
        const raw = localStorage.getItem(`mv_${storeName}_${key}`);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  // Helper generik untuk mengambil semua item dari store
  async getAllItems(storeName) {
    const db = await this.getDB();
    if (!db) {
      try {
        const results = [];
        const prefix = `mv_${storeName}_`;
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) {
            results.push(JSON.parse(localStorage.getItem(k)));
          }
        }
        return results;
      } catch (e) {
        return [];
      }
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  // ===================== COMICS =====================

  // Simpan satu komik (lengkap beserta relasi karakter jika ada)
  async saveComic(comic) {
    if (!comic || !comic.id) return null;
    const enriched = {
      ...comic,
      cached_at: new Date().toISOString()
    };
    await this.setItem(STORES.COMICS, enriched);

    // Jika komik menyertakan daftar karakter, simpan juga karakternya
    if (Array.isArray(comic.characters) && comic.characters.length > 0) {
      for (const char of comic.characters) {
        if (char && char.id) {
          await this.saveCharacter({
            ...char,
            comic_id: comic.id,
            comic_title: comic.title
          });
        }
      }
    }

    return enriched;
  }

  // Ambil komik berdasarkan ID
  async getComic(id) {
    if (!id) return null;
    return await this.getItem(STORES.COMICS, id);
  }

  // Simpan daftar komik (misalnya dari halaman Beranda / Katalog)
  async saveComicsList(comics) {
    if (!Array.isArray(comics)) return;
    // Simpan koleksi utama
    await this.setItem(STORES.COLLECTIONS, {
      key: 'all_comics',
      data: comics,
      cached_at: new Date().toISOString()
    });

    // Simpan juga setiap komik secara individual agar bisa diakses langsung via /comics/:id
    for (const c of comics) {
      if (c && c.id) {
        // Ambil data komik lama jika sudah ada detail lebih lengkap (misalnya characters)
        const existing = await this.getComic(c.id);
        await this.setItem(STORES.COMICS, {
          ...(existing || {}),
          ...c,
          characters: existing?.characters || c.characters || [],
          cached_at: new Date().toISOString()
        });
      }
    }
  }

  // Ambil daftar komik yang tersimpan
  async getComicsList() {
    const collection = await this.getItem(STORES.COLLECTIONS, 'all_comics');
    if (collection && Array.isArray(collection.data) && collection.data.length > 0) {
      return collection.data;
    }
    // Jika tidak ada di collection, ambil semua dari store comics
    return await this.getAllItems(STORES.COMICS);
  }

  // Simpan komik berdasarkan genre (Halaman Discover)
  async saveGenreComics(genreName, comics) {
    if (!genreName || !Array.isArray(comics)) return;
    await this.setItem(STORES.COLLECTIONS, {
      key: `genre_${genreName.toLowerCase()}`,
      data: comics,
      cached_at: new Date().toISOString()
    });
    // Simpan juga individual komik
    for (const c of comics) {
      if (c && c.id) {
        const existing = await this.getComic(c.id);
        await this.setItem(STORES.COMICS, {
          ...(existing || {}),
          ...c,
          cached_at: new Date().toISOString()
        });
      }
    }
  }

  async getGenreComics(genreName) {
    if (!genreName) return [];
    const collection = await this.getItem(STORES.COLLECTIONS, `genre_${genreName.toLowerCase()}`);
    if (collection && Array.isArray(collection.data)) {
      return collection.data;
    }
    // Fallback: Filter dari semua komik yang tersimpan
    const all = await this.getComicsList();
    return all.filter((c) =>
      c.genres?.some((g) => g.name?.toLowerCase() === genreName.toLowerCase())
    );
  }

  // ===================== CHARACTERS =====================

  async saveCharacter(character) {
    if (!character || !character.id) return null;
    const enriched = {
      ...character,
      cached_at: new Date().toISOString()
    };
    await this.setItem(STORES.CHARACTERS, enriched);
    return enriched;
  }

  async getCharacter(id) {
    if (!id) return null;
    return await this.getItem(STORES.CHARACTERS, id);
  }

  async saveCharactersList(characters) {
    if (!Array.isArray(characters)) return;
    await this.setItem(STORES.COLLECTIONS, {
      key: 'all_characters',
      data: characters,
      cached_at: new Date().toISOString()
    });

    for (const char of characters) {
      if (char && char.id) {
        await this.saveCharacter(char);
      }
    }
  }

  async getCharactersList() {
    const collection = await this.getItem(STORES.COLLECTIONS, 'all_characters');
    if (collection && Array.isArray(collection.data) && collection.data.length > 0) {
      return collection.data;
    }
    return await this.getAllItems(STORES.CHARACTERS);
  }

  // ===================== GENRES =====================

  async saveGenres(genres) {
    if (!Array.isArray(genres)) return;
    await this.setItem(STORES.COLLECTIONS, {
      key: 'all_genres',
      data: genres,
      cached_at: new Date().toISOString()
    });
    for (const g of genres) {
      if (g && (g.id || g.name)) {
        await this.setItem(STORES.GENRES, { id: g.id || g.name, ...g });
      }
    }
  }

  async getGenres() {
    const collection = await this.getItem(STORES.COLLECTIONS, 'all_genres');
    if (collection && Array.isArray(collection.data)) {
      return collection.data;
    }
    return await this.getAllItems(STORES.GENRES);
  }

  // ===================== TRACKER =====================

  async saveTracker(items, stats) {
    if (Array.isArray(items)) {
      await this.setItem(STORES.COLLECTIONS, {
        key: 'user_tracker',
        data: items,
        cached_at: new Date().toISOString()
      });
    }
    if (stats) {
      await this.setItem(STORES.COLLECTIONS, {
        key: 'tracker_stats',
        data: stats,
        cached_at: new Date().toISOString()
      });
    }
  }

  async getTracker() {
    const collection = await this.getItem(STORES.COLLECTIONS, 'user_tracker');
    return collection?.data || [];
  }

  async getTrackerStats() {
    const collection = await this.getItem(STORES.COLLECTIONS, 'tracker_stats');
    return collection?.data || { total: 0, reading: 0, completed: 0 };
  }

  // Periksa apakah sebuah komik ada di tracker offline
  async checkComicInTracker(comicId) {
    const list = await this.getTracker();
    return list.find((item) => item.comic_id === comicId || item.comic?.id === comicId) || null;
  }

  // ===================== NOTIFICATIONS =====================

  async saveNotifications(notifications) {
    if (!Array.isArray(notifications)) return;
    await this.setItem(STORES.COLLECTIONS, {
      key: 'notifications_list',
      data: notifications,
      cached_at: new Date().toISOString()
    });
  }

  async getNotifications() {
    const collection = await this.getItem(STORES.COLLECTIONS, 'notifications_list');
    return collection?.data || [];
  }
}

export const offlineStorage = new OfflineStorage();
