// Server/routes/diet.js
import express from 'express';
import { protect } from '../middlewares/auth.js';
import { generateDietPlan, getUserPlans } from '../controllers/dietController.js';

const router = express.Router();

router.post('/plan', protect, generateDietPlan);
router.get('/my-plans', protect, getUserPlans);

export default router;
