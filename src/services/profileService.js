import api from './api';

export const profileService = {
  async getMyProfile() {
    const res = await api.get('/profiles/me');
    return res.data;
  },

  async updateProfile(payload) {
    const res = await api.put('/profiles/me', payload);
    return res.data;
  },

  async getAllProfiles() {
    const res = await api.get('/profiles');
    return res.data || [];
  },

  async updateUserRole(id, role) {
    const res = await api.put(`/profiles/${id}/role`, { role });
    return res.data;
  }
};
