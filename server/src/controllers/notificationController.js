import { notificationModel } from '../models/notificationModel.js';
import { comicModel } from '../models/comicModel.js';

const ALLOWED_TYPES = ['new_comic', 'chapter_update', 'news'];

export const notificationController = {
  async getAll(req, res, next) {
    try {
      const { type = '', limit = 40 } = req.query;
      const normalizedType = String(type).trim();

      const notifications = await notificationModel.getAll({
        type: ALLOWED_TYPES.includes(normalizedType) ? normalizedType : '',
        limit: Math.max(1, parseInt(limit, 10) || 40)
      });

      return res.json({
        success: true,
        count: notifications.length,
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { type = 'news', title, message, comic_id, cover_url, link_url } = req.body;

      if (!title || !title.trim() || !message || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Judul dan isi pesan notifikasi wajib diisi.'
        });
      }

      const validType = ALLOWED_TYPES.includes(type) ? type : 'news';
      let linkedComic = null;
      if (comic_id) {
        linkedComic = await comicModel.getById(comic_id);
      }

      const created = await notificationModel.create({
        type: validType,
        title: title.trim(),
        message: message.trim(),
        comic_id: linkedComic?.id || comic_id || null,
        comic_title: linkedComic?.title || null,
        cover_url: cover_url ? String(cover_url).trim() : (linkedComic?.cover_url || null),
        link_url: link_url
          ? String(link_url).trim()
          : linkedComic
            ? `/comics/${linkedComic.id}`
            : null
      });

      return res.status(201).json({
        success: true,
        message: 'Notifikasi berhasil dipublikasikan.',
        data: created
      });
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const removed = await notificationModel.remove(id);

      if (!removed) {
        return res.status(404).json({
          success: false,
          message: 'Notifikasi tidak ditemukan atau merupakan notifikasi otomatis dari katalog.'
        });
      }

      return res.json({
        success: true,
        message: 'Notifikasi berhasil dihapus.'
      });
    } catch (error) {
      next(error);
    }
  }
};
