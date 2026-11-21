import api from './api';

export const authService = {
  async register({ email, password, name }) {
    const res = await api.post('/auth/register', { email, password, name });
    return res;
  },

  async login({ email, password }) {
    const res = await api.post('/auth/login', { email, password });
    return res;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Abaikan jika server logout gagal
    } finally {
      localStorage.removeItem('manhwaverse_token');
      localStorage.removeItem('manhwaverse_user');
    }
  }
};
