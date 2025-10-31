import React from "react";
import { View, Text } from "react-native";

export const AnalyticsHeader = ({ days }) => (
  <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
    <Text
      style={{
        fontSize: 30,
        fontWeight: "800",
        color: "#1f2937",
        marginBottom: 16,
        paddingHorizontal: 6,
        paddingTop: 15,
      }}
    >
      Analytiques
    </Text>
    <Text
      style={{
        fontSize: 15,
        fontWeight: "600",
        color: "#434952ff",
        marginBottom: 16,
        paddingHorizontal: 6,
      }}
    >
      Données des derniers {days} jours
    </Text>
  </View>
);