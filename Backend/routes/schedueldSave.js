// routes/savedstates.js
import express from "express";

import { disableSchedule, getSchedules, setScheduledSave } from "../controllers/scheduledSaveController.js";

const router = express.Router();

router.post("/", setScheduledSave);
router.patch("/disable/:id", disableSchedule);
router.get("/", getSchedules);



export default router;
