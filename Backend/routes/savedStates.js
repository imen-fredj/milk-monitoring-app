// routes/savedstates.js
import express from "express";
import {
  saveMeasurementState,
  getAllSavedstates,
  deleteSavedState,
  exportSavedStatePdf,
} from "../controllers/savedStateController.js";

const router = express.Router();

router.post("/", saveMeasurementState); // Save new state
router.get("/", getAllSavedstates); // Get all states
router.delete("/:id", deleteSavedState); // Delete a state by ID
router.get("/pdf/:id", exportSavedStatePdf); // Export a state



export default router;
