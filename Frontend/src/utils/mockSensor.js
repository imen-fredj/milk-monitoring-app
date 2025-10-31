export const generateMockSensorData = () => {
  return {
    weight: (Math.random() * 20).toFixed(2),       // 0–20 kg
    volume: (Math.random() * 10).toFixed(2),       // 0–10 L
    temperature: (Math.random() * 15 + 15).toFixed(1), // 15–30°C
    timestamp: new Date().toISOString()
  };
};
