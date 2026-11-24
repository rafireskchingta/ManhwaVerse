import api from './api';
import { offlineStorage } from './offlineStorage';

export const characterService = {
  async getAll({ search = '', role = '', comic_id = '', limit = 50, offset = 0 } = {}) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      if (comic_id) params.append('comic_id', comic_id);
      if (limit) params.append('limit', limit);
      if (offset) params.append('offset', offset);

      const res = await api.get(`/characters?${params.toString()}`);
      const data = res.data || [];

      if (!search && !role && !comic_id) {
        await offlineStorage.saveCharactersList(data);
      }

      return data;
    } catch (err) {
      console.warn('[characterService] Gagal memuat karakter online, mencoba cache offline:', err.message);

      let cached = await offlineStorage.getCharactersList();
      if (cached && cached.length > 0) {
        if (search) {
          const q = search.toLowerCase();
          cached = cached.filter(
            (c) =>
              c.name?.toLowerCase().includes(q) ||
              c.comic_title?.toLowerCase().includes(q) ||
              c.description?.toLowerCase().includes(q)
          );
        }
        if (role) {
          cached = cached.filter((c) => c.role?.toLowerCase() === role.toLowerCase());
        }
        if (comic_id) {
          cached = cached.filter((c) => c.comic_id === comic_id);
        }
        return cached;
      }

      throw err;
    }
  },

  async getById(id) {
    try {
      const res = await api.get(`/characters/${id}`);
      const data = res.data;
      if (data) {
        await offlineStorage.saveCharacter(data);
      }
      return data;
    } catch (err) {
      console.warn(`[characterService] Gagal memuat karakter ${id} online, mencoba cache offline:`, err.message);
      const cached = await offlineStorage.getCharacter(id);
      if (cached) {
        return cached;
      }
      throw err;
    }
  },

  async create(payload) {
    const res = await api.post('/characters', payload);
    return res.data;
  },

  async update(id, payload) {
    const res = await api.put(`/characters/${id}`, payload);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/characters/${id}`);
    return res;
  },

  async softDelete(id) {
    const res = await api.delete(`/characters/${id}`);
    return res;
  },

  async hardDelete(id) {
    const res = await api.delete(`/characters/${id}?hard=true`);
    return res;
  },

  async getTrash() {
    const res = await api.get('/characters/trash');
    return res.data || [];
  },

  async restore(id) {
    const res = await api.post(`/characters/${id}/restore`);
    return res;
  }
};
