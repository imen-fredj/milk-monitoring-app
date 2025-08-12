import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  pH: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  volume: {
    type: Number,
    min: 0,
    max: 20
  }
});

export default mongoose.model('Measurement', measurementSchema);