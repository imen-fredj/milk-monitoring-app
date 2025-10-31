import React from "react";
import { View, Text } from "react-native";
import { SensorCard } from "./SensorCard";
import { DensityCard } from "./DensityCard"; // ✅ Import missing
import { sensorStyles } from "../../styles/monitoringStyles";

export const SensorGrid = ({ sensorData, pulseAnim }) => {
  const sensorConfigs = [
    {
      key: "weight",
      title: "Poids",
      icon: "scale",
      color: sensorStyles.sensorColors.weight,
    },
    {
      key: "volume",
      title: "Volume",
      icon: "straighten",
      color: sensorStyles.sensorColors.volume,
    },
    {
      key: "temperature",
      title: "Température",
      icon: "thermostat",
      color: sensorStyles.sensorColors.temperature,
    },
    {
      key: "pH",
      title: "Niveau de pH",
      icon: "science",
      color: sensorStyles.sensorColors.pH,
    },
  ];

  console.log("SensorGrid a reçu sensorData:", sensorData);

  if (sensorData.isLoading) {
    return (
      <View style={sensorStyles.sensorGrid}>
        <Text>Chargement des capteurs...</Text>
      </View>
    );
  }

  if (sensorData.error) {
    return (
      <View style={sensorStyles.sensorGrid}>
        <Text>Erreur : {sensorData.error}</Text>
      </View>
    );
  }

  if (!sensorData.sensors || !Array.isArray(sensorData.sensors)) {
    console.error("sensorData.sensors n'est pas un tableau:", sensorData);
    return (
      <View style={sensorStyles.sensorGrid}>
        <Text>Aucune donnée de capteur disponible</Text>
      </View>
    );
  }

  // ✅ Get density data safely
  const densityMeasurement = sensorData.measurements.find(
    (m) => m.id === "density"
  );
  const densityCardData = densityMeasurement
    ? {
        value: densityMeasurement.value ?? "--",
        unit: densityMeasurement.unit ?? "g/cm³",
        lastUpdate: densityMeasurement.lastUpdated,
      }
    : { value: "--", unit: "g/cm³", lastUpdate: null };

  return (
    <View style={sensorStyles.sensorGrid}>
      {/* Density Card centered */}
      <View style={sensorStyles.densityCardContainer}>
        <View style={sensorStyles.sensorCardFull}>
          <DensityCard
            title="Densité"
            data={densityCardData}
            icon="analytics"
            color={sensorStyles.sensorColors.density}
          />
        </View>
      </View>

      {/* Regular sensor cards in 2x2 grid */}
      {sensorConfigs.map((config, index) => {
        const sensor = sensorData.sensors.find((s) => s.id === config.key);

        console.log(`Capteur ${config.key}:`, sensor);

        const sensorCardData = sensor
          ? {
              active: sensor.active || sensor.status === "connected",
              value: sensor.value || "--",
              unit: sensor.unit || "",
              lastUpdate: sensor.lastUpdate || sensor.lastUpdated,
            }
          : {
              active: false,
              value: "--",
              unit: "",
              lastUpdate: null,
            };

        return (
          <View key={config.key} style={sensorStyles.sensorGridItem}>
            <SensorCard
              title={config.title}
              data={sensorCardData}
              icon={config.icon}
              color={config.color}
              index={index}
              pulseAnim={pulseAnim}
            />
          </View>
        );
      })}
    </View>
  );
};
