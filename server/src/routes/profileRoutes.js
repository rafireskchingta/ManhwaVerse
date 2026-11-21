import { Router } from 'express';
import { profileController } from '../controllers/profileController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/me', verifyToken, profileController.getProfile);
router.put('/me', verifyToken, profileController.updateProfile);
router.get('/', verifyToken, requireAdmin, profileController.getAllProfiles);
router.put('/:id/role', verifyToken, requireAdmin, profileController.updateUserRole);
router.get('/:id', profileController.getProfile);

export default router;
