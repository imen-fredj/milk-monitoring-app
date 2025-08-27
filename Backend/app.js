import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { startScheduledSavesCron } from "./cron/scheduledSaves.js";
import measurements from "./routes/measurements.js";
import analytics from "./routes/analytics.js";
import SavedState from "./routes/savedStates.js";
import ScheduledSave from "./routes/schedueldSave.js";
import alerts from "./routes/alerts.js";
import notifications from "./routes/notifications.js"


// Get current filename and directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MAIN URLs
app.use("/measurements", measurements);
app.use("/analytics", analytics);
app.use("/states", SavedState);
app.use("/scheduled", ScheduledSave);
app.use("/alerts", alerts);
app.use("/notifications", notifications);



mongoose
  .connect("mongodb://localhost/laitDB")
  .then(() => {
    console.log("Connected to database laitDB");
    startScheduledSavesCron();
  })
  .catch((err) => {
    console.error("Won't connect to database laitDB", err);
  });

export default app;
