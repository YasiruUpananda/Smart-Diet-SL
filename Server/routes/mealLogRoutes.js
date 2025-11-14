import express from 'express';
import {
  createMealLog,
  getUserMealLogs,
  getMealLogStats,
} from '../controllers/mealLogController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/').post(protect, upload.single('image'), createMealLog).get(protect, getUserMealLogs);
router.route('/stats').get(protect, getMealLogStats);

export default router;

