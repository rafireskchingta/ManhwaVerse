import api from './api';
import { offlineStorage } from './offlineStorage';

const READ_STORAGE_KEY = 'mv_read_notifications';
export const NOTIFICATIONS_EVENT = 'mv-notifications-updated';

const emitUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_EVENT));
  }
};

export const notificationService = {
  async getAll(type = '') {
    try {
      const params = type && type !== 'all' ? `?type=${encodeURIComponent(type)}` : '';
      const res = await api.get(`/notifications${params}`);
      const data = res.data || [];

      if (!type || type === 'all') {
        await offlineStorage.saveNotifications(data);
      }

      return data;
    } catch (err) {
      console.warn('[notificationService] Gagal memuat notifikasi online, mencoba cache offline:', err.message);
      let cached = await offlineStorage.getNotifications();
      if (type && type !== 'all') {
        cached = cached.filter((item) => item.type === type);
      }
      if (cached && cached.length > 0) {
        return cached;
      }
      throw err;
    }
  },

  async create(payload) {
    const res = await api.post('/notifications', payload);
    emitUpdate();
    return res.data;
  },

  async remove(id) {
    const res = await api.delete(`/notifications/${id}`);
    emitUpdate();
    return res;
  },

  getReadIds() {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = localStorage.getItem(READ_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  },

  markAsRead(id) {
    if (!id || typeof window === 'undefined') return;
    const readSet = this.getReadIds();
    if (!readSet.has(id)) {
      readSet.add(id);
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...readSet]));
      emitUpdate();
    }
  },

  markAllAsRead(ids = []) {
    if (typeof window === 'undefined') return;
    const readSet = this.getReadIds();
    let changed = false;
    for (const id of ids) {
      if (id && !readSet.has(id)) {
        readSet.add(id);
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...readSet]));
      emitUpdate();
    }
  }
};
