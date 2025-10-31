import Measurement from "../models/Measurement.js";
import dns from "dns/promises";
import { evaluateAlertsForMeasurement } from "../lib/alertEngine.js";

////////////////////////////////////////////// Get all measurements ////////////////////////////////////////////
export const getAllMeasurements = async (req, res) => {
  try {
    const {
      containerId,
      limit = 1000,
      offset = 0,
      sortBy = "timestamp",
      order = "desc",
    } = req.query;

    const query = containerId ? { containerId: parseInt(containerId) } : {};

    const measurements = await Measurement.find(query)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    res.json({
      success: true,
      data: measurements,
      count: measurements.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

////////////////////////////////////////////// Create new measurement ////////////////////////////////////////////
export const createMeasurement = async (req, res) => {
  try {
    const {
      containerId,
      containerName,
      temperature,
      pH,
      weight,
      volume
    } = req.body;

    console.log("📥 Received measurement data:", {
      containerId,
      containerName,
      temperature,
      pH,
      weight,
      volume,
    });

    // Calculate density if we have both weight and volume
    let density = null;
    if (weight && volume && volume > 0) {
      // Density = mass / volume
      // weight is in kg, volume is in L
      // 1 L = 1000 cm³, so density in kg/L = g/cm³
      density = parseFloat((weight / volume).toFixed(3));
      
      // Validate calculated density is within reasonable milk range
      if (density < 1.025 || density > 1.040) {
        console.warn(`⚠️ Calculated density ${density} g/cm³ is outside normal milk range (1.025-1.040)`);
      }
    }

    const measurement = new Measurement({
      containerId,
      containerName,
      temperature,
      pH,
      weight,
      volume,
      density,
    });

    await measurement.save();

    // 🔔 Evaluate alerts and get triggered notifications
    const triggeredAlerts = await evaluateAlertsForMeasurement(
      { Measurement },
      measurement
    );

    // If there are triggered alerts, broadcast notifications to connected clients
    if (triggeredAlerts && triggeredAlerts.length > 0) {
      console.log(`🚨 Broadcasting ${triggeredAlerts.length} notifications`);

      // Broadcast each notification to SSE clients
      for (const notification of triggeredAlerts) {
        if (global.__SSE_BROADCAST__) {
          global.__SSE_BROADCAST__(notification);
        }
      }
    }
    res.status(201).json({
      success: true,
      data: measurement,
      alertsTriggered: triggeredAlerts,
    });
  } catch (error) {
    console.error("❌ Error creating measurement:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

////////////////////////////////////////////////////// Get latest measurement ////////////////////////////////////////////
export const getLatestMeasurement = async (req, res) => {
  try {
    const { containerId } = req.query;

    const query = containerId ? { containerId } : {};

    const measurement = await Measurement.findOne(query).sort({
      timestamp: -1,
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        error: containerId
          ? `No measurements found for container: ${containerId}`
          : "No measurements found",
      });
    }

    res.json({
      success: true,
      data: measurement,
    });
  } catch (error) {
    console.error("Error fetching latest measurement:", error);
    res.status(500).json({
      success: false,
      error: error.message,
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
        error: "Container ID is required",
      });
    }

    console.log(
      "Looking for measurements with containerId:",
      containerId,
      "type:",
      typeof containerId
    );

    // Get the most recent measurement for this container
    const latestMeasurement = await Measurement.findOne({
      containerId: containerId,
    }).sort({ timestamp: -1 });

    console.log("Latest measurement found:", latestMeasurement ? "Yes" : "No");

    // Check for recent measurements (last 5 minutes) to determine data flow
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentMeasurements = await Measurement.find({
      containerId: containerId,
      timestamp: { $gte: fiveMinutesAgo },
    });

    console.log("Recent measurements count:", recentMeasurements.length);

    // Get measurement count for this specific container
    const containerMeasurementCount = await Measurement.countDocuments({
      containerId: containerId,
    });

    console.log("Total measurements for container:", containerMeasurementCount);

    // For debugging - let's also check what containerIds exist in the database
    const allContainerIds = await Measurement.distinct("containerId");
    console.log("All containerIds in database:", allContainerIds);

    // Network status (this is still global)
    let networkOnline = false;
    let networkLatency = null;
    try {
      const start = Date.now();
      await dns.lookup("8.8.8.8");
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
          latencyMs: networkLatency,
        },
        measurementsStored: containerMeasurementCount,
        lastUpdate: latestMeasurement?.timestamp,
        dataQuality: {
          hasRecentData: recentMeasurements.length > 0,
          lastMeasurementAge: latestMeasurement
            ? Math.round(
                (Date.now() - new Date(latestMeasurement.timestamp).getTime()) /
                  1000
              )
            : null,
        },
      },
    });
  } catch (error) {
    console.error("Error in getContainerSystemStatus:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
