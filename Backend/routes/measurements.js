import express from "express";
import { getAllMeasurements, createMeasurement, getLatestMeasurement, getAnalytics } from '../controllers/measurementController.js';
import { validateMeasurement } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllMeasurements);
router.post('/', validateMeasurement, createMeasurement);
router.get('/latest', getLatestMeasurement);
router.get('/analytics', getAnalytics);

export default router;