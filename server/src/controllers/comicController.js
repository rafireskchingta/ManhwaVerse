import { comicModel } from '../models/comicModel.js';
import { komikuService } from '../services/komikuService.js';

export const comicController = {
  async getAll(req, res, next) {
    try {
      const { search, genre, status, limit, offset } = req.query;

      const comics = await comicModel.getAll({
        search: search ? String(search).trim() : '',
        genre: genre ? String(genre).trim() : '',
        status: status ? String(status).trim() : '',
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0
      });

      return res.json({
        success: true,
        count: comics.length,
        data: comics
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const comic = await comicModel.getById(id);

      if (!comic) {
        return res.status(404).json({
          success: false,
          message: 'Komik tidak ditemukan.'
        });
      }

      return res.json({
        success: true,
        data: comic
      });
    } catch (error) {
      next(error);
    }
  },

  async getReadLink(req, res, next) {
    try {
      const { id } = req.params;
      const chapter = parseInt(req.query.chapter, 10) || 0;
      const comic = await comicModel.getById(id);

      if (!comic) {
        return res.status(404).json({
          success: false,
          message: 'Komik tidak ditemukan.'
        });
      }

      const linkInfo = await komikuService.resolveReadLink({
        title: comic.title,
        alternative_title: comic.alternative_title,
        chapter
      });

      return res.json({
        success: true,
        data: linkInfo
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const {
        title,
        alternative_title,
        synopsis,
        cover_url,
        author,
        status,
        total_chapters,
        genre_ids
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Judul komik wajib diisi.'
        });
      }

      const newComic = await comicModel.create({
        title: title.trim(),
        alternative_title: alternative_title ? alternative_title.trim() : '',
        synopsis: synopsis ? synopsis.trim() : '',
        cover_url: cover_url ? cover_url.trim() : '',
        author: author ? author.trim() : '',
        status: status || 'Ongoing',
        total_chapters: parseInt(total_chapters, 10) || 0,
        genre_ids: Array.isArray(genre_ids) ? genre_ids : []
      });

      return res.status(201).json({
        success: true,
        message: 'Komik berhasil ditambahkan.',
        data: newComic
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const {
        title,
        alternative_title,
        synopsis,
        cover_url,
        author,
        status,
        total_chapters,
        genre_ids
      } = req.body;

      const existing = await comicModel.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Komik yang akan diperbarui tidak ditemukan.'
        });
      }

      const updatedComic = await comicModel.update(id, {
        title: title !== undefined ? title.trim() : undefined,
        alternative_title: alternative_title !== undefined ? alternative_title.trim() : undefined,
        synopsis: synopsis !== undefined ? synopsis.trim() : undefined,
        cover_url: cover_url !== undefined ? cover_url.trim() : undefined,
        author: author !== undefined ? author.trim() : undefined,
        status,
        total_chapters: total_chapters !== undefined ? parseInt(total_chapters, 10) : undefined,
        genre_ids
      });

      return res.json({
        success: true,
        message: 'Data komik berhasil diperbarui.',
        data: updatedComic
      });
    } catch (error) {
      next(error);
    }
  },

  async getTrash(req, res, next) {
    try {
      const comics = await comicModel.getAll({ isDeleted: true, limit: 100 });
      return res.json({
        success: true,
        count: comics.length,
        data: comics
      });
    } catch (error) {
      next(error);
    }
  },

  async restore(req, res, next) {
    try {
      const { id } = req.params;
      await comicModel.restore(id);
      return res.json({
        success: true,
        message: 'Komik berhasil dipulihkan ke katalog utama.'
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const isHard = req.query.hard === 'true' || req.query.permanent === 'true';

      const existing = await comicModel.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Komik tidak ditemukan.'
        });
      }

      await comicModel.delete(id, { hard: isHard });

      return res.json({
        success: true,
        message: isHard
          ? 'Komik berhasil dihapus secara permanen dari database.'
          : 'Komik berhasil dipindahkan ke kotak sampah.'
      });
    } catch (error) {
      next(error);
    }
  }
};
