// dataGenerator.js
import fetch from "node-fetch"; 
import mongoose from "mongoose";
import HeightVolume from "./models/heightVolumes.js";

// === DB connection ===
await mongoose.connect("mongodb://localhost:27017/laitDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Containers
const containers = [
  { id: "milk1", name: "Milk Container 1" },
  { id: "milk2", name: "Milk Container 2" },
];

// Utility: pick a random float in range
const randomFloat = (min, max, decimals = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Utility: pick random density in milk range (g/cm³)
const randomDensity = (min = 1.025, max = 1.040, decimals = 3) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Generate one mock record
// Generate one mock record
const generateMockData = async (container) => {
  // Generate random height (simulate sensor)
  const height = randomFloat(5, 141.8, 1);

  // Find the closest volume in your collection
  const heightVolumeDoc = await HeightVolume.findOne({ hauteur_cm: height });

  let volume = null;
  if (heightVolumeDoc) {
    volume = heightVolumeDoc.volume_L; // assuming stored in L
  } else {
    // If exact height not found, pick the nearest one
    const nearest = await HeightVolume.findOne({
      hauteur_cm: { $gte: height },
    }).sort({ hauteur_cm: 1 });

    if (nearest) {
      volume = nearest.volume_L;
    }
  }

  // Generate density ONCE at the beginning
  const densityGperCm3 = randomDensity(); // g/cm³

  // Compute logical weight (kg) if volume found
  let weightKg = null;
  if (volume != null) {
    // Use the SAME density we generated above
    // 1 L = 1000 cm³ → density (g/cm³) * volume(L)*1000 = grams
    const massGrams = densityGperCm3 * volume * 1000;
    weightKg = parseFloat((massGrams / 1000).toFixed(1)); // convert g → kg
  } else {
    weightKg = randomFloat(0.05, 5.55, 3); // fallback
  }

  return {
    containerId: container.id,
    containerName: container.name,
    temperature: randomFloat(15, 25, 1),    // ✅ 15–25 °C
    pH: randomFloat(6.4, 6.8, 2),           // ✅ realistic milk pH
    weight: weightKg,                       // ✅ consistent with volume
    height,                                 // cm
    volume,                                 // L
    density: densityGperCm3,                // ✅ Use the SAME density used for weight calculation
    timestamp: new Date().toISOString(),
  };
};

// Send to backend
const sendDataToBackend = async (data) => {
  // sending a post request to create the measure
  try {
    const response = await fetch("http://localhost:5000/measurements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

// Start generation loop
const startDataGeneration = () => {
  console.log("🚀 Starting mock data generation...");
  console.log("📡 Sending data every 10 seconds for each container\n");

  const sendAllContainersData = async () => {
    for (const container of containers) {
      const mockData = await generateMockData(container);
      await sendDataToBackend(mockData);
    }
  };

  // Initial send
  sendAllContainersData();

  // Every 10 seconds
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
