import api from './api';

export const characterService = {
  async getAll({ search = '', role = '', comic_id = '', limit = 50, offset = 0 } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    if (comic_id) params.append('comic_id', comic_id);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);

    const res = await api.get(`/characters?${params.toString()}`);
    return res.data || [];
  },

  async getById(id) {
    const res = await api.get(`/characters/${id}`);
    return res.data;
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
