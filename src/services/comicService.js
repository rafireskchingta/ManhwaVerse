import api from './api';
import { offlineStorage } from './offlineStorage';

export const comicService = {
  async getAll({ search = '', genre = '', status = '', limit = 50, offset = 0 } = {}) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (genre) params.append('genre', genre);
      if (status) params.append('status', status);
      if (limit) params.append('limit', limit);
      if (offset) params.append('offset', offset);

      const res = await api.get(`/comics?${params.toString()}`);
      const data = res.data || [];

      // Simpan data yang berhasil diambil ke penyimpanan offline
      if (!search && !genre && !status) {
        await offlineStorage.saveComicsList(data);
      } else if (genre && !search && !status) {
        await offlineStorage.saveGenreComics(genre, data);
      }

      return data;
    } catch (err) {
      console.warn('[comicService] Gagal memuat data online, mencoba cache offline:', err.message);

      // Cek apakah ada cache genre spesifik
      if (genre && !search && !status) {
        const cachedGenreComics = await offlineStorage.getGenreComics(genre);
        if (cachedGenreComics && cachedGenreComics.length > 0) {
          return cachedGenreComics;
        }
      }

      // Ambil seluruh komik yang tersimpan di perangkat
      let cached = await offlineStorage.getComicsList();
      if (cached && cached.length > 0) {
        if (search) {
          const q = search.toLowerCase();
          cached = cached.filter(
            (c) =>
              c.title?.toLowerCase().includes(q) ||
              c.alternative_title?.toLowerCase().includes(q) ||
              c.author?.toLowerCase().includes(q)
          );
        }
        if (genre) {
          cached = cached.filter((c) =>
            c.genres?.some(
              (g) => g.name?.toLowerCase() === genre.toLowerCase() || g.id === genre
            )
          );
        }
        if (status) {
          cached = cached.filter((c) => c.status === status);
        }
        return cached;
      }

      throw err;
    }
  },

  async getById(id) {
    try {
      const res = await api.get(`/comics/${id}`);
      const data = res.data;
      if (data) {
        await offlineStorage.saveComic(data);
      }
      return data;
    } catch (err) {
      console.warn(`[comicService] Gagal memuat komik ${id} online, mencoba cache offline:`, err.message);
      const cached = await offlineStorage.getComic(id);
      if (cached) {
        return cached;
      }
      throw err;
    }
  },

  async getReadLink(id, chapter = 0) {
    try {
      const res = await api.get(`/comics/${id}/read-link?chapter=${encodeURIComponent(chapter)}`);
      return res.data || null;
    } catch (err) {
      console.warn('[comicService] Gagal resolve link Shinigami:', err.message);
      return null;
    }
  },

  async create(payload) {
    const res = await api.post('/comics', payload);
    return res.data;
  },

  async update(id, payload) {
    const res = await api.put(`/comics/${id}`, payload);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/comics/${id}`);
    return res;
  },

  async softDelete(id) {
    const res = await api.delete(`/comics/${id}`);
    return res;
  },

  async hardDelete(id) {
    const res = await api.delete(`/comics/${id}?hard=true`);
    return res;
  },

  async getTrash() {
    const res = await api.get('/comics/trash');
    return res.data || [];
  },

  async restore(id) {
    const res = await api.post(`/comics/${id}/restore`);
    return res;
  }
};
