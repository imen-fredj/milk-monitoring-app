// routes/statisticsRoutes.js
import express from 'express';
import { 
  getContainerAnalytics, 
  getAllContainersAnalytics, 
  getTrendData,
  getQualityInsights 
} from '../controllers/analyticsController.js';

const router = express.Router();


router.get('/:containerId', getContainerAnalytics);

router.get('/', getAllContainersAnalytics);

router.get('/trends/:containerId', getTrendData);

router.get("/insights/:containerId", getQualityInsights);


export default router;

