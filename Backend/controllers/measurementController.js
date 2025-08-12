import Measurement from '../models/Measurement.js';

// Helper function: Calculate quality score
const calculateQualityScore = ({ temperature, pH, weight, volume }) => {
  let score = 100;
  
  // Temperature scoring (ideal range: 30–35°C)
  if (temperature > 35 || temperature < 30) {
    score -= Math.abs(32.5 - temperature) * 2;
  }
  
  // pH scoring (ideal range: 6.5–7.0)
  if (pH > 7.0 || pH < 6.5) {
    score -= Math.abs(6.75 - pH) * 10;
  }
  
  // Weight consideration (light weight might indicate spoilage)
  if (weight < 2) {
    score -= 10;
  }

  // Volume consideration (low volume might indicate product loss)
  if (volume < 1) {
    score -= 5;
  }
  
  return Math.max(0, Math.min(100, score));
};

// Helper function: Calculate average
const calculateAverage = (measurements, field) => {
  if (measurements.length === 0) return 0;
  const sum = measurements.reduce((acc, m) => acc + (m[field] || 0), 0);
  return parseFloat((sum / measurements.length).toFixed(2));
};

// Get all measurements
export const getAllMeasurements = async (req, res) => {
  try {
    const { limit = 100, offset = 0, sortBy = 'timestamp', order = 'desc' } = req.query;
    
    const measurements = await Measurement.find()
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    res.json({
      success: true,
      data: measurements,
      count: measurements.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new measurement
export const createMeasurement = async (req, res) => {
  try {
    const { temperature, pH, weight, volume } = req.body;
    
    console.log('📥 Received measurement data:', { temperature, pH, weight, volume });
    
    // Calculate quality score
    const qualityScore = calculateQualityScore({ temperature, pH, weight, volume });
    
    const measurement = new Measurement({
      temperature,
      pH,
      weight,
      volume,
      qualityScore
    });

    await measurement.save();
    
    console.log('✅ Measurement saved with quality score:', qualityScore);
    
    res.status(201).json({
      success: true,
      data: measurement
    });
  } catch (error) {
    console.error('❌ Error creating measurement:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get latest measurement
export const getLatestMeasurement = async (req, res) => {
  try {
    const measurement = await Measurement.findOne().sort({ _id: -1 }); // Sort by _id descending
    
    if (!measurement) {
      return res.status(404).json({
        success: false,
        error: 'No measurements found'
      });
    }
    
    res.json({
      success: true,
      data: measurement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get analytics
export const getAnalytics = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const measurements = await Measurement.find({
      timestamp: { $gte: startDate }
    });
    
    const analytics = {
      totalMeasurements: measurements.length,
      averageTemperature: calculateAverage(measurements, 'temperature'),
      averagePh: calculateAverage(measurements, 'pH'),
      averageWeight: calculateAverage(measurements, 'weight'),
      averageVolume: calculateAverage(measurements, 'volume'),
      averageQualityScore: calculateAverage(measurements, 'qualityScore')
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
