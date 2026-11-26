import { Router } from 'express';
import { comicController } from '../controllers/comicController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Endpoint manajemen Sampah / Trash khusus Admin (Harus sebelum :id)
router.get('/trash', verifyToken, requireAdmin, comicController.getTrash);
router.post('/:id/restore', verifyToken, requireAdmin, comicController.restore);

// Endpoint publik (katalog & detail komik dapat dilihat tanpa login)
router.get('/', comicController.getAll);

// Endpoint baca komik membutuhkan pengguna sudah login
router.get('/:id/read-link', verifyToken, comicController.getReadLink);

router.get('/:id', comicController.getById);

// Endpoint manajemen khusus Admin
router.post('/', verifyToken, requireAdmin, comicController.create);
router.put('/:id', verifyToken, requireAdmin, comicController.update);
router.delete('/:id', verifyToken, requireAdmin, comicController.delete);

export default router;
