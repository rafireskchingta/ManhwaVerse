import { characterModel } from '../models/characterModel.js';

export const characterController = {
  async getAll(req, res, next) {
    try {
      const { search, role, comic_id, limit, offset } = req.query;

      const characters = await characterModel.getAll({
        search: search ? String(search).trim() : '',
        role: role ? String(role).trim() : '',
        comic_id: comic_id ? String(comic_id).trim() : '',
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0
      });

      return res.json({
        success: true,
        count: characters.length,
        data: characters
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const character = await characterModel.getById(id);

      if (!character) {
        return res.status(404).json({
          success: false,
          message: 'Karakter tidak ditemukan.'
        });
      }

      return res.json({
        success: true,
        data: character
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { comic_id, name, image_url, role, background, description } = req.body;

      if (!comic_id || !name || !role) {
        return res.status(400).json({
          success: false,
          message: 'Komik asal, nama karakter, dan peran (role) wajib diisi.'
        });
      }

      const newChar = await characterModel.create({
        comic_id,
        name: name.trim(),
        image_url: image_url ? image_url.trim() : '',
        role: role.trim(),
        background: background ? background.trim() : '',
        description: description ? description.trim() : ''
      });

      return res.status(201).json({
        success: true,
        message: 'Karakter berhasil ditambahkan.',
        data: newChar
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { comic_id, name, image_url, role, background, description } = req.body;

      const existing = await characterModel.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Karakter tidak ditemukan.'
        });
      }

      const updated = await characterModel.update(id, {
        comic_id,
        name: name ? name.trim() : undefined,
        image_url: image_url ? image_url.trim() : undefined,
        role: role ? role.trim() : undefined,
        background: background !== undefined ? background.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined
      });

      return res.json({
        success: true,
        message: 'Data karakter berhasil diperbarui.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  async getTrash(req, res, next) {
    try {
      const characters = await characterModel.getAll({ isDeleted: true, limit: 100 });
      return res.json({
        success: true,
        count: characters.length,
        data: characters
      });
    } catch (error) {
      next(error);
    }
  },

  async restore(req, res, next) {
    try {
      const { id } = req.params;
      await characterModel.restore(id);
      return res.json({
        success: true,
        message: 'Karakter berhasil dipulihkan ke katalog utama.'
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const isHard = req.query.hard === 'true' || req.query.permanent === 'true';

      const existing = await characterModel.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Karakter tidak ditemukan.'
        });
      }

      await characterModel.delete(id, { hard: isHard });

      return res.json({
        success: true,
        message: isHard
          ? 'Karakter berhasil dihapus secara permanen dari database.'
          : 'Karakter berhasil dipindahkan ke kotak sampah.'
      });
    } catch (error) {
      next(error);
    }
  }
};
