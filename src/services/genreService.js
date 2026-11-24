import api from './api';
import { offlineStorage } from './offlineStorage';

export const genreService = {
  async getAll() {
    try {
      const res = await api.get('/genres');
      const data = res.data || [];
      if (data.length > 0) {
        await offlineStorage.saveGenres(data);
      }
      return data;
    } catch (err) {
      console.warn('[genreService] Gagal memuat genre online, mencoba cache offline:', err.message);
      const cached = await offlineStorage.getGenres();
      if (cached && cached.length > 0) {
        return cached;
      }
      throw err;
    }
  },

  async getById(id) {
    const res = await api.get(`/genres/${id}`);
    return res.data;
  },

  async create(payload) {
    const res = await api.post('/genres', payload);
    return res.data;
  },

  async update(id, payload) {
    const res = await api.put(`/genres/${id}`, payload);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/genres/${id}`);
    return res;
  }
};
