import { Router } from "express";
import { createAlert, listAlerts, getAlert, updateAlert, deleteAlert, toggleAlert } from "../controllers/alertController.js";

const router = Router();

router.post("/", createAlert);
router.get("/", listAlerts);
router.get("/:id", getAlert);
router.patch("/:id", updateAlert);
router.delete("/:id", deleteAlert);
router.post("/toggle/:id", toggleAlert);

export default router;
