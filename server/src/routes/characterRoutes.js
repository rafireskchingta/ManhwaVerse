import { Router } from 'express';
import { characterController } from '../controllers/characterController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Endpoint manajemen Sampah / Trash khusus Admin (Harus sebelum :id)
router.get('/trash', verifyToken, requireAdmin, characterController.getTrash);
router.post('/:id/restore', verifyToken, requireAdmin, characterController.restore);

// Endpoint publik
router.get('/', characterController.getAll);
router.get('/:id', characterController.getById);

// Endpoint manajemen khusus Admin
router.post('/', verifyToken, requireAdmin, characterController.create);
router.put('/:id', verifyToken, requireAdmin, characterController.update);
router.delete('/:id', verifyToken, requireAdmin, characterController.delete);

export default router;
