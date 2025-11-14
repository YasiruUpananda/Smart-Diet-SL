import express from 'express';
import {
  generatePlate,
  getPlates,
  createPlate,
} from '../controllers/sriLankanPlateController.js';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

router.route('/generate').get(generatePlate);
router.route('/').get(getPlates).post(protect, admin, createPlate);

export default router;

