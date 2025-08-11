// dataGenerator.js - Run this as a separate Node.js script
import fetch from 'node-fetch'; // You'll need to install: npm install node-fetch

const generateMockData = () => {
  return {
    temperature: parseFloat((Math.random() * 10 + 30).toFixed(1)), // 30–40°C
    ph: parseFloat((Math.random() * 2 + 6).toFixed(2)), // 6–8
    weight: parseFloat((Math.random() * 5 + 1).toFixed(2)), // 1–6kg
    freshness: Math.random() > 0.7 ? "Fresh" : (Math.random() > 0.3 ? "Unknown" : "Spoiled"),
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
      console.log(`✅ Data sent successfully at ${new Date().toLocaleTimeString()}:`, data);
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
  console.log("📡 Sending data to http://localhost:5000/measurements every 5 seconds");
  console.log("Press Ctrl+C to stop\n");

  // Send initial data
  sendDataToBackend(generateMockData());

  // Set up interval to send data every 5 seconds
  const interval = setInterval(() => {
    const mockData = generateMockData();
    sendDataToBackend(mockData);
  }, 5000);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping data generation...');
    clearInterval(interval);
    process.exit(0);
  });
};

// Start the data generation
startDataGeneration();