import api from './api';
import { offlineStorage } from './offlineStorage';

export const trackerService = {
  async getUserTracker(status = '') {
    try {
      const params = status ? `?status=${encodeURIComponent(status)}` : '';
      const res = await api.get(`/tracker${params}`);
      const data = res.data || [];
      if (!status) {
        await offlineStorage.saveTracker(data);
      }
      return data;
    } catch (err) {
      console.warn('[trackerService] Gagal memuat tracker online, mencoba cache offline:', err.message);
      let cached = await offlineStorage.getTracker();
      if (status) {
        cached = cached.filter((item) => item.reading_status === status);
      }
      return cached || [];
    }
  },

  async getStats() {
    try {
      const res = await api.get('/tracker/stats');
      const data = res.data || { total: 0, reading: 0, completed: 0 };
      await offlineStorage.saveTracker(null, data);
      return data;
    } catch (err) {
      console.warn('[trackerService] Gagal memuat statistik tracker online, mencoba cache offline:', err.message);
      return await offlineStorage.getTrackerStats();
    }
  },

  async checkComicStatus(comicId) {
    try {
      const res = await api.get(`/tracker/check/${comicId}`);
      return res.data;
    } catch (e) {
      return await offlineStorage.checkComicInTracker(comicId);
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
