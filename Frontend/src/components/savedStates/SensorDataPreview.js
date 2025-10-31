import React from 'react';
import { View, Text } from 'react-native';

const SensorDataPreview = ({ sensorData }) => {
  if (!sensorData) return null;

  const firstRowItems = [
    { key: 'weight', label: 'Weight', color: '#3b82f6', unit: 'Kg', backgroundColor: '#eff6ff' },
    { key: 'temperature', label: 'Temp', color: '#f59e0b', unit: '°C', backgroundColor: '#fffbeb' },
    { key: 'pH', label: 'pH', color: '#10b981', unit: '', backgroundColor: '#f0fdf4' },
  ];

  const secondRowItems = [
    { key: 'volume', label: 'Volume', color: '#06b6d4', unit: 'L', backgroundColor: '#f0f9ff' },
    { key: 'density', label: 'Density', color: '#dc2626', unit: 'g/cm³', backgroundColor: '#fef2f2' }
  ];

  const renderRow = (items, isSecondRow = false) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: isSecondRow ? "center" : "space-around",
        gap: isSecondRow ? 24 : 0,
      }}
    >
      {items.map(item => {
        if (!sensorData[item.key]) return null;
        
        return (
          <View key={item.key} style={{ alignItems: "center", minWidth: isSecondRow ? 100 : 'auto' }}>
            <View
              style={{
                backgroundColor: item.backgroundColor,
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginBottom: 6,
                shadowColor: item.color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
                borderWidth: 1,
                borderColor: `${item.color}20`,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: item.color,
                  textAlign: "center",
                }}
              >
                {sensorData[item.key]}{item.unit}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 11,
                color: "#6b7280",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f1f5f9",
      }}
    >
      {renderRow(firstRowItems)}
      <View style={{ height: 12 }} />
      {renderRow(secondRowItems, true)}
    </View>
  );
};

export default SensorDataPreview;