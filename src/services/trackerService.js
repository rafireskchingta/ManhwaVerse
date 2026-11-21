import api from './api';

export const trackerService = {
  async getUserTracker(status = '') {
    const params = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await api.get(`/tracker${params}`);
    return res.data || [];
  },

  async getStats() {
    const res = await api.get('/tracker/stats');
    return res.data || { total: 0, reading: 0, completed: 0 };
  },

  async checkComicStatus(comicId) {
    try {
      const res = await api.get(`/tracker/check/${comicId}`);
      return res.data;
    } catch (e) {
      return null;
    }
  },

  async addToTracker({ comic_id, reading_status = 'Sedang Dibaca', current_chapter = 0 }) {
    const res = await api.post('/tracker', {
      comic_id,
      reading_status,
      current_chapter
    });
    return res.data;
  },

  async updateProgress(id, { reading_status, current_chapter }) {
    const res = await api.put(`/tracker/${id}`, {
      reading_status,
      current_chapter
    });
    return res.data;
  },

  async deleteFromTracker(id) {
    const res = await api.delete(`/tracker/${id}`);
    return res;
  }
};
