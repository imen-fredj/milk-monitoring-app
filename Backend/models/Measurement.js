import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema({
  containerId: { type: String, required: true },
  containerName: { type: String, required: true },
  temperature: { type: Number, required: true, min: 0, max: 50 },
  pH: { type: Number, required: true, min: 0, max: 14 },
  weight: { type: Number, required: true, min: 0, max: 60 },
  height: { type: Number,  min: 5 },
  volume: { type: Number, min: 0, max: 6000 },

  qualityScore: { type: Number },

  status: {
    temperature: {
      type: String,
      enum: ["online", "offline", "error"],
      default: "online",
    },
    pH: {
      type: String,
      enum: ["online", "offline", "error"],
      default: "online",
    },
    weight: {
      type: String,
      enum: ["online", "offline", "error"],
      default: "online",
    },
    volume: {
      type: String,
      enum: ["online", "offline", "error"],
      default: "online",
    },
  },

  // Network connectivity
  networkStatus: {
    type: String,
    enum: ["online", "offline"],
    default: "online",
  },

  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Measurement", measurementSchema);
