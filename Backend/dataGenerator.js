// dataGenerator.js
import fetch from "node-fetch"; 
import mongoose from "mongoose";
import HeightVolume from "./models/heightVolumes.js";

// === DB connection ===
await mongoose.connect("mongodb://localhost:27017/laitDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const containers = [
  { id: "milk1", name: "Milk Container 1" },
  { id: "milk2", name: "Milk Container 2" },
];

// Utility: pick a random float in range
const randomFloat = (min, max, decimals = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Generate one mock record
const generateMockData = async (container) => {
  // Generate random height (simulate sensor)
  const height = randomFloat(5, 141.8, 1);

  // Find the closest volume in your collection
  const heightVolumeDoc = await HeightVolume.findOne({ hauteur_cm: height });

  let volume = null;
  if (heightVolumeDoc) {
    volume = heightVolumeDoc.volume_L;
  } else {
    // If exact height not found, pick the nearest one
    const nearest = await HeightVolume.findOne({
      hauteur_cm: { $gte: height },
    }).sort({ hauteur_cm: 1 });

    if (nearest) {
      volume = nearest.volume_L;
    }
  }

  return {
    containerId: container.id,
    containerName: container.name,
    temperature: randomFloat(30, 40, 1), // 30–40°C
    pH: randomFloat(6, 8, 2),           // 6–8
    weight: randomFloat(1, 6, 2),       // 1–6 kg
    height,                             // cm
    volume,                             // from DB
    timestamp: new Date().toISOString(),
  };
};

const sendDataToBackend = async (data) => {
  try {
    const response = await fetch("http://localhost:5000/measurements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(
        `✅ Sent (${data.containerId}) at ${new Date().toLocaleTimeString()}:`,
        data
      );
      return true;
    } else {
      const errorData = await response.json();
      console.error("❌ Failed to send data:", errorData);
      return false;
    }
  } catch (error) {
    console.error("❌ Network error:", error.message);
    return false;
  }
};

const startDataGeneration = () => {
  console.log("🚀 Starting mock data generation...");
  console.log(
    "📡 Sending data to http://localhost:5000/measurements every 5 seconds for each container"
  );
  console.log("Press Ctrl+C to stop\n");

  const sendAllContainersData = async () => {
    for (const container of containers) {
      const mockData = await generateMockData(container);
      await sendDataToBackend(mockData);
    }
  };

  // Initial send
  sendAllContainersData();

  // Every 5 seconds
  const interval = setInterval(sendAllContainersData, 10000);

  process.on("SIGINT", () => {
    console.log("\n🛑 Stopping data generation...");
    clearInterval(interval);
    mongoose.disconnect();
    process.exit(0);
  });
};

// Start
startDataGeneration();
