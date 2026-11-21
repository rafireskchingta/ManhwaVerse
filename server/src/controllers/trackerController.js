import { trackerModel } from '../models/trackerModel.js';
import { comicModel } from '../models/comicModel.js';

export const trackerController = {
  async getUserTracker(req, res, next) {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      const items = await trackerModel.getUserTracker(userId, {
        status: status ? String(status).trim() : ''
      });

      return res.json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (error) {
      next(error);
    }
  },

  async getTrackerItem(req, res, next) {
    try {
      const userId = req.user.id;
      const { comicId } = req.params;

      const item = await trackerModel.getTrackerItem(userId, comicId);

      return res.json({
        success: true,
        data: item
      });
    } catch (error) {
      next(error);
    }
  },

  async addToTracker(req, res, next) {
    try {
      const userId = req.user.id;
      const { comic_id, reading_status, current_chapter } = req.body;

      if (!comic_id) {
        return res.status(400).json({
          success: false,
          message: 'ID komik (comic_id) wajib disertakan.'
        });
      }

      // Pastikan komik ada
      const comic = await comicModel.getById(comic_id);
      if (!comic) {
        return res.status(404).json({
          success: false,
          message: 'Komik yang ingin dilacak tidak ditemukan.'
        });
      }

      const item = await trackerModel.addOrUpdate(userId, {
        comic_id,
        reading_status: reading_status || 'Sedang Dibaca',
        current_chapter: current_chapter !== undefined ? parseInt(current_chapter, 10) : 0
      });

      return res.status(201).json({
        success: true,
        message: 'Komik berhasil ditambahkan ke daftar bacaan.',
        data: item
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProgress(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { reading_status, current_chapter } = req.body;

      const updated = await trackerModel.updateProgress(userId, id, {
        reading_status,
        current_chapter
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Data pelacak bacaan tidak ditemukan atau bukan milik Anda.'
        });
      }

      return res.json({
        success: true,
        message: 'Progres bacaan berhasil diperbarui.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteFromTracker(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const deleted = await trackerModel.delete(userId, id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Data pelacak bacaan tidak ditemukan atau bukan milik Anda.'
        });
      }

      return res.json({
        success: true,
        message: 'Komik berhasil dihapus dari daftar bacaan Anda.'
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserStats(req, res, next) {
    try {
      const userId = req.user.id;
      const stats = await trackerModel.getUserStats(userId);

      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
};
