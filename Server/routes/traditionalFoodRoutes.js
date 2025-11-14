import express from 'express';
import {
  getTraditionalFoods,
  getTraditionalFoodById,
  createTraditionalFood,
} from '../controllers/traditionalFoodController.js';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

router.route('/').get(getTraditionalFoods).post(protect, admin, createTraditionalFood);
router.route('/:id').get(getTraditionalFoodById);

export default router;

