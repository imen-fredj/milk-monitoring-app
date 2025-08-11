import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  ph: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  freshness: {
    type: String,
    enum: ['Fresh', 'Spoiled', 'Unknown'],
    default: 'Unknown'
  },
  qualityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Measurement', measurementSchema);