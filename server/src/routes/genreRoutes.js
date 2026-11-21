import { Router } from 'express';
import { genreController } from '../controllers/genreController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Endpoint publik
router.get('/', genreController.getAll);
router.get('/:id', genreController.getById);

// Endpoint manajemen khusus Admin
router.post('/', verifyToken, requireAdmin, genreController.create);
router.put('/:id', verifyToken, requireAdmin, genreController.update);
router.delete('/:id', verifyToken, requireAdmin, genreController.delete);

export default router;
