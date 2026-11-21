import { genreModel } from '../models/genreModel.js';

export const genreController = {
  async getAll(req, res, next) {
    try {
      const genres = await genreModel.getAll();
      return res.json({
        success: true,
        count: genres.length,
        data: genres
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const genre = await genreModel.getById(id);

      if (!genre) {
        return res.status(404).json({
          success: false,
          message: 'Genre tidak ditemukan.'
        });
      }

      return res.json({
        success: true,
        data: genre
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { name } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Nama genre wajib diisi.'
        });
      }

      const newGenre = await genreModel.create({ name });

      return res.status(201).json({
        success: true,
        message: 'Genre berhasil ditambahkan.',
        data: newGenre
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Nama genre wajib diisi.'
        });
      }

      const updated = await genreModel.update(id, { name });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Genre tidak ditemukan.'
        });
      }

      return res.json({
        success: true,
        message: 'Genre berhasil diperbarui.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await genreModel.getById(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Genre tidak ditemukan.'
        });
      }

      await genreModel.delete(id);

      return res.json({
        success: true,
        message: 'Genre berhasil dihapus.'
      });
    } catch (error) {
      next(error);
    }
  }
};
