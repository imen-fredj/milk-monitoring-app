import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  alertId: { type: mongoose.Schema.Types.ObjectId, ref: "Alert", required: true },
  containerId: { type: String },
  metric: { type: String, required: true },
  value: { type: Number, required: true },
  operator: { type: String, required: true },
  threshold: { type: Number, required: true },
  message: { type: String, required: true },
  at: { type: Date, default: Date.now }
});

notificationSchema.index({ alertId: 1, at: -1 });

export default mongoose.model("Notification", notificationSchema);
