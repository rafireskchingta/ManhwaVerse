import { profileModel } from '../models/profileModel.js';

export const profileController = {
  async getProfile(req, res, next) {
    try {
      const targetId = req.params.id || req.user?.id;
      if (!targetId) {
        return res.status(400).json({ success: false, message: 'ID pengguna tidak valid.' });
      }

      const profile = await profileModel.getById(targetId);
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Profil pengguna tidak ditemukan.' });
      }

      return res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { name, avatar_url } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Nama tidak boleh kosong.' });
      }

      const updated = await profileModel.update(userId, {
        name: name.trim(),
        avatar_url: avatar_url || null
      });

      return res.json({
        success: true,
        message: 'Profil berhasil diperbarui.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllProfiles(req, res, next) {
    try {
      const profiles = await profileModel.getAll();
      return res.json({ success: true, data: profiles });
    } catch (error) {
      next(error);
    }
  },

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['reader', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role harus bernilai 'reader' atau 'admin'."
        });
      }

      const updated = await profileModel.updateRole(id, role);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      }

      return res.json({
        success: true,
        message: `Role pengguna berhasil diubah menjadi ${role}.`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
};
