import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // Scope
  containerId: { type: String, required: false }, // if omitted => applies to all containers
  metric: {
    type: String,
    enum: ["temperature", "pH", "weight", "volume", "qualityScore"],
    required: true
  },

  // Threshold logic
  operator: { type: String, enum: [">", ">=", "<", "<="], required: true },
  threshold: { type: Number, required: true },

  // Persistence options
  // durationSec: { type: Number, default: 0 },     // must be violated continuously for this long
  // cooldownSec: { type: Number, default: 300 },    // suppress duplicates for N seconds after trigger

  // Lifecycle
  status: { type: String, enum: ["active", "paused"], default: "active" },
  lastTriggeredAt: { type: Date, default: null },

  // // Delivery
  // channels: {
  //   type: [String],
  //   enum: ["inapp", "webhook"],
  //   default: ["inapp"]
  // },
  // webhookUrl: { type: String }, // used if channels includes "webhook"

  // Housekeeping
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

alertSchema.index({ status: 1, metric: 1, containerId: 1 }); // fast filtering

alertSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Alert", alertSchema);
