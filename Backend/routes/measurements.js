import express from "express";
import { getAllMeasurements, createMeasurement, getLatestMeasurement, getContainerSystemStatus } from '../controllers/measurementController.js';
import { validateMeasurement } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllMeasurements);
router.post('/', validateMeasurement, createMeasurement);
router.get('/latest', getLatestMeasurement);
router.get('/containers/:containerId/status', getContainerSystemStatus);


export default router;