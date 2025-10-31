import mongoose from "mongoose";

const sensorSnapshotSchema = new mongoose.Schema(
  {
    temperature: Number,
    pH: Number,
    weight: Number,
    height: Number,
    volume: Number,
    density: Number,
    qualityScore: Number,
    status: {
      temperature: { type: String, enum: ["online", "offline", "error"] },
      pH: { type: String, enum: ["online", "offline", "error"] },
      weight: { type: String, enum: ["online", "offline", "error"] },
      volume: { type: String, enum: ["online", "offline", "error"] },
    },
    networkStatus: { type: String, enum: ["online", "offline"] },
    timestamp: Date,
  },
  { _id: false }
);

const savedstateschema = new mongoose.Schema(
  {
    containerId: { type: String, required: true },
    containerName: { type: String, required: true },
    stateName: { type: String, required: true },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },

    // Embedded snapshot (frozen copy of the measurement at save time)
    sensorData: sensorSnapshotSchema,

    // Optional reference to the original measurement
    measurementRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Measurement",
    },

    // Anything else you want to capture (device info, app version, etc.)
    systemSnapshot: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model("SavedState", savedstateschema);
