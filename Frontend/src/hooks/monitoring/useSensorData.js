// src/hooks/useSensorData.js
import { useState, useEffect } from "react";
import {
  getLatestMeasurement,
  getContainerSystemStatus,
} from "../../services/measurementService";

export const useSensorData = (containerId) => {
  const [sensorData, setSensorData] = useState({
    // Physical sensors only
    sensors: [
      {
        id: "weight",
        name: "Weight Sensor",
        value: null,
        unit: "kg",
        status: "disconnected",
        lastUpdated: null,
        icon: "⚖️",
        color: "#3b82f6",
      },
      {
        id: "volume",
        name: "Volume Sensor",
        value: null,
        unit: "L",
        status: "disconnected",
        lastUpdated: null,
        icon: "🥛",
        color: "#10b981",
      },
      {
        id: "temperature",
        name: "Temperature Sensor",
        value: null,
        unit: "°C",
        status: "disconnected",
        lastUpdated: null,
        icon: "🌡️",
        color: "#f59e0b",
      },
      {
        id: "pH",
        name: "pH Sensor",
        value: null,
        unit: "pH",
        status: "disconnected",
        lastUpdated: null,
        icon: "⚗️",
        color: "#8b5cf6",
      },
    ],
    // Calculated measurements
    measurements: [
      {
        id: "density",
        name: "Density",
        value: null,
        unit: "g/cm³",
        isCalculated: true,
        lastUpdated: null,
        icon: "🔬",
        color: "#ef4444",
      },
    ],
    systemStatus: {
      network: {
        online: false,
        latencyMs: null,
      },
      measurementsStored: 0,
      containerId: null,
      dataQuality: null,
      lastUpdate: null,
    },
    isLoading: true,
    lastFetch: null,
    error: null,
  });

  const fetchSensorData = async (targetContainerId) => {
    try {
      setSensorData((prev) => ({ ...prev, isLoading: true, error: null }));

      // Fetch both measurement data and container-specific system status in parallel
      const [latestMeasurement, containerSystemStatus] = await Promise.all([
        getLatestMeasurement(targetContainerId),
        getContainerSystemStatus(targetContainerId),
      ]);

      const now = new Date().toISOString();

      setSensorData((prev) => {
        let updatedSensors = [...prev.sensors];
        let updatedMeasurements = [...prev.measurements];

        // Update physical sensor values with measurement data
        if (latestMeasurement) {
          updatedSensors = prev.sensors.map((sensor) => {
            let value = null;
            let status = "disconnected";

            // Map the measurement data to sensor values
            switch (sensor.id) {
              case "weight":
                value = latestMeasurement.weight;
                break;
              case "volume":
                value = latestMeasurement.volume;
                break;
              case "temperature":
                value = latestMeasurement.temperature;
                break;
              case "pH":
                value = latestMeasurement.pH;
                break;
            }

            // Determine status based on measurement data
            if (value !== null && value !== undefined) {
              status = "connected";
            }

            return {
              ...sensor,
              value,
              status,
              lastUpdated:
                status === "connected"
                  ? latestMeasurement.timestamp || now
                  : null,
            };
          });

          // Update calculated measurements
          updatedMeasurements = prev.measurements.map((measurement) => {
            if (measurement.id === "density") {
              const densityValue = latestMeasurement.density;
              const hasValidData = densityValue !== null && densityValue !== undefined;
              
              return {
                ...measurement,
                value: densityValue,
                unit: measurement.unit,
                lastUpdated: hasValidData ? latestMeasurement.timestamp || now : null,
              };
            }
            return measurement;
          });
        } else {
          // No measurement data - all sensors disconnected, measurements inactive
          updatedSensors = prev.sensors.map((sensor) => ({
            ...sensor,
            status: "disconnected",
            value: null,
            lastUpdated: null,
          }));

          updatedMeasurements = prev.measurements.map((measurement) => ({
            ...measurement,
            value: null,
            unit: null,
            lastUpdated: null,
          }));
        }

        return {
          ...prev,
          sensors: updatedSensors,
          measurements: updatedMeasurements,
          systemStatus: {
            network:
              containerSystemStatus?.network || prev.systemStatus.network,
            measurementsStored: containerSystemStatus?.measurementsStored || 0,
            containerId:
              containerSystemStatus?.containerId || targetContainerId,
            dataQuality: containerSystemStatus?.dataQuality || null,
            lastUpdate: containerSystemStatus?.lastUpdate || null,
          },
          isLoading: false,
          lastFetch: now,
          error: null,
        };
      });
    } catch (error) {
      console.error(
        `Error fetching sensor data for container ${targetContainerId}:`,
        error
      );
      setSensorData((prev) => ({
        ...prev,
        sensors: prev.sensors.map((sensor) => ({
          ...sensor,
          status: "error",
          value: null,
          lastUpdated: null,
        })),
        measurements: prev.measurements.map((measurement) => ({
          ...measurement,
          status: "inactive",
          value: null,
          lastUpdated: null,
        })),
        systemStatus: {
          ...prev.systemStatus,
        },
        isLoading: false,
        error:
          error.message ||
          `Failed to fetch sensor data for container ${targetContainerId}`,
      }));
    }
  };

  // Fetch data when containerId changes or on mount
  useEffect(() => {
    if (containerId) {
      fetchSensorData(containerId);
    }
  }, [containerId]);

  // Set up polling for real-time updates for the current container
  useEffect(() => {
    if (!containerId) return;

    const interval = setInterval(() => {
      fetchSensorData(containerId);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [containerId]);

  // Helper function to get all sensor values for save state
  const getAllSensorValues = () => {
    const sensorValues = {};
    const statusValues = {};
    
    // Get sensor data
    sensorData.sensors.forEach(sensor => {
      sensorValues[sensor.id] = sensor.value;
      statusValues[sensor.id] = sensor.status;
    });
    
    // Get measurement data
    sensorData.measurements.forEach(measurement => {
      sensorValues[measurement.id] = measurement.value;
      statusValues[measurement.id] = measurement.status;
    });
    
    return { sensorValues, statusValues };
  };

  // Return sensor data and utility functions
  return {
    ...sensorData,
    refresh: () => containerId && fetchSensorData(containerId),
    getAllSensorValues,
  };
};