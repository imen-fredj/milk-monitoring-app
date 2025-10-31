import React from "react";
import { View, Text } from "react-native";

export const NetworkStatus = ({ systemStatus }) => {
  const isOnline = Boolean(systemStatus?.network?.online);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isOnline ? "#d1fae5" : "#fecaca",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 16,
        marginHorizontal: 24,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: isOnline ? "#10b981" : "#ef4444",
          marginRight: 6,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          color: isOnline ? "#065f46" : "#7f1d1d",
          fontWeight: "600",
        }}
      >
        {isOnline ? "En ligne" : "Hors ligne"}
        {systemStatus?.network?.latencyMs &&
          ` • ${systemStatus.network.latencyMs}ms`}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: "#6b7280",
          marginLeft: 8,
        }}
      >
        {systemStatus?.measurementsStored || 0} mesures stockées
      </Text>
    </View>
  );
};