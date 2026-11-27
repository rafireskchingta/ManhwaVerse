import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Endpoint publik untuk menampilkan notifikasi manhwa baru, update chapter, dan berita terbaru
router.get('/', notificationController.getAll);

// Endpoint khusus Admin untuk menerbitkan atau menghapus berita/notifikasi manual
router.post('/', verifyToken, requireAdmin, notificationController.create);
router.delete('/:id', verifyToken, requireAdmin, notificationController.remove);

export default router;
