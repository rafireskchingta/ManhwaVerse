import { Router } from 'express';
import { trackerController } from '../controllers/trackerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// Seluruh rute pelacak bacaan membutuhkan token login
router.use(verifyToken);

router.get('/', trackerController.getUserTracker);
router.get('/stats', trackerController.getUserStats);
router.get('/check/:comicId', trackerController.getTrackerItem);
router.post('/', trackerController.addToTracker);
router.put('/:id', trackerController.updateProgress);
router.delete('/:id', trackerController.deleteFromTracker);

export default router;
