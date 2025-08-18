import express from "express";
import { getAllMeasurements, createMeasurement, getLatestMeasurement, getAnalytics, getSystemStatus, getContainerSystemStatus } from '../controllers/measurementController.js';
import { validateMeasurement } from '../middleware/validation.js';
import { clearAllMeasurements, deleteMeasurement, deleteMultipleMeasurements, deletePeriodMeasurements, exportMeasurements, generatePeriodPDF, getContainers, getFilteredMeasurements, getHistoricalStatistics, getPeriodSummaries } from "../controllers/historicController.js";

const router = express.Router();

router.get('/', getAllMeasurements);
router.post('/', validateMeasurement, createMeasurement);
router.get('/latest', getLatestMeasurement);
router.get('/analytics', getAnalytics);
router.get('/system-status', getSystemStatus);
router.get('/containers/:containerId/status', getContainerSystemStatus);

// routes for Historic Screen
router.get('/filtered', getFilteredMeasurements);
router.get('/statistics', getHistoricalStatistics);
router.get('/containers', getContainers);
router.get('/export', exportMeasurements);

// Period Summary routes
router.get('/period-summaries', getPeriodSummaries);
router.get('/generate-pdf', generatePeriodPDF);
router.delete('/delete-period', deletePeriodMeasurements);

// DELETE routes
router.delete('/:id', deleteMeasurement);
router.delete('/', deleteMultipleMeasurements); // For bulk delete
router.delete('/clear/all', clearAllMeasurements);



export default router;