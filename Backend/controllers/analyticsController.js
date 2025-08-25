import Measurement from "../models/Measurement.js";
import { 
  calculateAnalytics, 
  generateQualityInsights, 
  formatDate 
} from "../utils/analyticsHelpers";

///////////////////////////////////////////// Get analytics for a specific container /////////////////////////////////////////
export const getContainerAnalytics = async (req, res) => {
  try {
    const { containerId } = req.params;
    const { days = 7 } = req.query; // Default to last 7 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const measurements = await Measurement.find({
      containerId,
      timestamp: { $gte: startDate },
    }).sort({ timestamp: 1 });


    if (measurements.length === 0) {
      return res.status(404).json({ message: "No measurements found" });
    }

    const analytics = calculateAnalytics(measurements);
    
    res.json({
      containerId,
      containerName: measurements[0].containerName,
      period: `${days} days`,
      totalMeasurements: measurements.length,
      ...analytics,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

///////////////////////////////////////////////////// Get analytics for all containers //////////////////////////////////////
export const getAllContainersAnalytics = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get all unique containers
    const containers = await Measurement.distinct("containerId", {
      timestamp: { $gte: startDate },
    });

    const allAnalytics = [];

    for (const containerId of containers) {
      const measurements = await Measurement.find({
        containerId,
        timestamp: { $gte: startDate },
      }).sort({ timestamp: 1 });

      if (measurements.length > 0) {
        const analytics = calculateAnalytics(measurements);
        allAnalytics.push({
          containerId,
          containerName: measurements[0].containerName,
          totalMeasurements: measurements.length,
          ...analytics,
        });
      }
    }

    res.json({
      period: `${days} days`,
      totalContainers: allAnalytics.length,
      containers: allAnalytics,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//////////////////////////////////////////////// Get trend data for charts /////////////////////////////////////////////
export const getTrendData = async (req, res) => {
  try {
    const { containerId } = req.params;
    const { days = 7, interval = 'daily' } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    let groupBy;

    // Set grouping based on interval
    switch (interval) {
      case 'hourly':
        groupBy = {
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" },
          day: { $dayOfMonth: "$timestamp" },
          hour: { $hour: "$timestamp" }
        };
        break;
      case 'daily':
      default:
        groupBy = {
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" },
          day: { $dayOfMonth: "$timestamp" }
        };
        break;
    }

    const trendData = await Measurement.aggregate([
      {
        $match: {
          containerId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          avgWeight: { $avg: "$weight" },
          avgVolume: { $avg: "$volume" },
          maxWeight: { $max: "$weight" },
          minWeight: { $min: "$weight" },
          maxVolume: { $max: "$volume" },
          minVolume: { $min: "$volume" },
          count: { $sum: 1 },
          timestamp: { $first: "$timestamp" }
        }
      },
      {
        $sort: { timestamp: 1 }
      }
    ]);

    res.json({
      containerId,
      interval,
      period: `${days} days`,
      data: trendData.map(item => ({
        date: formatDate(item._id),
        avgWeight: Math.round(item.avgWeight * 100) / 100,
        avgVolume: Math.round(item.avgVolume * 100) / 100,
        maxWeight: item.maxWeight,
        minWeight: item.minWeight,
        maxVolume: item.maxVolume,
        minVolume: item.minVolume,
        measurementCount: item.count
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/////////////////////////////////// Get quality insights (based on weight/volume ratio and trends) /////////////////////////////////
export const getQualityInsights = async (req, res) => {
  try {
    const { containerId } = req.params;
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const measurements = await Measurement.find({
      containerId,
      timestamp: { $gte: startDate },
    }).sort({ timestamp: 1 });

    if (measurements.length === 0) {
      return res.status(404).json({ message: "No measurements found" });
    }

    const insights = generateQualityInsights(measurements);
    
    res.json({
      containerId,
      containerName: measurements[0].containerName,
      period: `${days} days`,
      insights,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};