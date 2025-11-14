import express from 'express';
import {
  getDietPlans,
  getDietPlanById,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan,
} from '../controllers/dietPlanController.js';
import { protect, admin } from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/').get(getDietPlans).post(protect, admin, upload.single('image'), createDietPlan);
router
  .route('/:id')
  .get(getDietPlanById)
  .put(protect, admin, upload.single('image'), updateDietPlan)
  .delete(protect, admin, deleteDietPlan);

export default router;

