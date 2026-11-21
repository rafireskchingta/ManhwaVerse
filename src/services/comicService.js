import api from './api';

export const comicService = {
  async getAll({ search = '', genre = '', status = '', limit = 50, offset = 0 } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (genre) params.append('genre', genre);
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);

    const res = await api.get(`/comics?${params.toString()}`);
    return res.data || [];
  },

  async getById(id) {
    const res = await api.get(`/comics/${id}`);
    return res.data;
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
