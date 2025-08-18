import mongoose from "mongoose";

const heightVolumeSchema = new mongoose.Schema({
  hauteur_cm: { type: Number, required: true },
  volume_L: { type: Number, required: true }
});

export default mongoose.model("HeightVolume", heightVolumeSchema);