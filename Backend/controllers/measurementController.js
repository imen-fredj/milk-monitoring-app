import Measurement from '../models/Measurement.js';
import dns from 'dns/promises';


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

////////////////////////////////////////////// Get all measurements ////////////////////////////////////////////
export const getAllMeasurements = async (req, res) => {
  try {
    const { containerId, limit = 1000, offset = 0, sortBy = 'timestamp', order = 'desc' } = req.query;

    const query = containerId ? { containerId: parseInt(containerId) } : {};

    const measurements = await Measurement.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    res.json({
      success: true,
      data: measurements,
      count: measurements.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


////////////////////////////////////////////// Create new measurement ////////////////////////////////////////////
export const createMeasurement = async (req, res) => {
  try {
    const { containerId, containerName, temperature, pH, weight, volume } = req.body;

    console.log('📥 Received measurement data:', { containerId, containerName, temperature, pH, weight, volume });

    const qualityScore = calculateQualityScore({ temperature, pH, weight, volume });

    const measurement = new Measurement({
      containerId,
      containerName,
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

////////////////////////////////////////////////////// Get latest measurement ////////////////////////////////////////////
export const getLatestMeasurement = async (req, res) => {
  try {
    const { containerId } = req.query;
    
    const query = containerId ? { containerId } : {};
    
    const measurement = await Measurement.findOne(query).sort({ timestamp: -1 }); 

    if (!measurement) {
      return res.status(404).json({
        success: false,
        error: containerId ? `No measurements found for container: ${containerId}` : 'No measurements found'
      });
    }
    
    res.json({
      success: true,
      data: measurement
    });
  } catch (error) {
    console.error('Error fetching latest measurement:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

////////////////////////////////////////////// Get analytics ////////////////////////////////////////////
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

/////////////////////////////////////////////////////// System Overview ////////////////////////////////////////////
const SENSOR_LIST = ['temperature', 'pH', 'weight', 'volume'];

export const getSystemStatus = async (req, res) => {
  try {
    // Create sensors array from SENSOR_LIST
    const sensors = SENSOR_LIST.map(sensorType => ({
      id: sensorType,
      type: sensorType,
      name: `${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Sensor`,
      status: "active", // we can implement actual sensor status checking here
      lastUpdated: new Date().toISOString()
    }));

    // Network connectivity check (ping Google DNS)
    let networkOnline = false;
    try {
      await dns.lookup('8.8.8.8');
      networkOnline = true;
    } catch {
      networkOnline = false;
    }

    // Measurements count
    const measurementsStored = await Measurement.countDocuments();

    res.json({
      success: true,
      data: {
        sensors, 
        network: {
          online: networkOnline,
          latencyMs: networkOnline ? 42 : null // Placeholder latency
        },
        measurementsStored
      }
    });
  } catch (error) {
    console.error('Error in getSystemStatus:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

//////////////////////////////////////////// getContainerSystemStatus  /////////////////////////////////////
export const getContainerSystemStatus = async (req, res) => {
  try {
    const { containerId } = req.params;
    
    if (!containerId) {
      return res.status(400).json({
        success: false,
        error: 'Container ID is required'
      });
    }

    console.log('Looking for measurements with containerId:', containerId, 'type:', typeof containerId);

    // Get the most recent measurement for this container
    const latestMeasurement = await Measurement.findOne({ containerId: containerId })
      .sort({ timestamp: -1 });

    console.log('Latest measurement found:', latestMeasurement ? 'Yes' : 'No');

    // Check for recent measurements (last 5 minutes) to determine data flow
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentMeasurements = await Measurement.find({ 
      containerId: containerId, 
      timestamp: { $gte: fiveMinutesAgo } 
    });

    console.log('Recent measurements count:', recentMeasurements.length);

    // Get measurement count for this specific container
    const containerMeasurementCount = await Measurement.countDocuments({ containerId: containerId });
    
    console.log('Total measurements for container:', containerMeasurementCount);

    // For debugging - let's also check what containerIds exist in the database
    const allContainerIds = await Measurement.distinct('containerId');
    console.log('All containerIds in database:', allContainerIds);

    // Network status (this is still global)
    let networkOnline = false;
    let networkLatency = null;
    try {
      const start = Date.now();
      await dns.lookup('8.8.8.8');
      networkLatency = Date.now() - start;
      networkOnline = true;
    } catch (error) {
      networkOnline = false;
    }

    res.json({
      success: true,
      data: {
        containerId,
        network: {
          online: networkOnline,
          latencyMs: networkLatency
        },
        measurementsStored: containerMeasurementCount,
        lastUpdate: latestMeasurement?.timestamp,
        dataQuality: {
          hasRecentData: recentMeasurements.length > 0,
          lastMeasurementAge: latestMeasurement ? 
            Math.round((Date.now() - new Date(latestMeasurement.timestamp).getTime()) / 1000) : null
        }
      }
    });
  } catch (error) {
    console.error('Error in getContainerSystemStatus:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
