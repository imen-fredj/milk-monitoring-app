// models/ScheduledSave.js
import mongoose from "mongoose";

const scheduledSaveSchema = new mongoose.Schema(
  {
    containerId: { type: String, required: true },
    containerName: { type: String, required: true },
    hour: { type: String, required: true }, // "HH:MM"
    description: { type: String, default: "Auto-scheduled save" },
    active: { type: Boolean, default: true },
    lastRun: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("ScheduledSave", scheduledSaveSchema);
