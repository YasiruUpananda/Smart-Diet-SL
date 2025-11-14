import express from 'express';
import {
  getTodayTip,
  getDailyTips,
  createDailyTip,
} from '../controllers/dailyTipController.js';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

router.route('/today').get(getTodayTip);
router.route('/').get(getDailyTips).post(protect, admin, createDailyTip);

export default router;

