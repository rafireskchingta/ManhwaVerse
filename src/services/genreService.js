import api from './api';

export const genreService = {
  async getAll() {
    const res = await api.get('/genres');
    return res.data || [];
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
