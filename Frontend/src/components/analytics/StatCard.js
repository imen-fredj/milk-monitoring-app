import React from "react";
import { View, Text, Animated } from "react-native";
import { globalStyles } from "../../styles/globalStyles";

export const StatCard = ({ title, value, unit, icon, trend, color = "#3b82f6", scaleAnim, fadeAnim }) => (
  <Animated.View
    style={[
      globalStyles.statCard.container,
      {
        transform: [{ scale: scaleAnim }],
        opacity: fadeAnim,
      },
    ]}
  >
    <View style={globalStyles.statCard.accent} />
    <View style={globalStyles.statCard.header}>
      <View
        style={[
          globalStyles.statCard.iconContainer,
          { backgroundColor: `${color}15` },
        ]}
      >
        <Text style={{ fontSize: 16, color }}>{icon}</Text>
      </View>
      <Text style={globalStyles.statCard.title}>{title}</Text>
    </View>
    <Text style={[globalStyles.statCard.value, { color }]}>{value}</Text>
    <Text style={globalStyles.statCard.unit}>{unit}</Text>
    {trend && (
      <View style={globalStyles.statCard.trendContainer}>
        <Text style={globalStyles.statCard.trendText}>{trend}</Text>
      </View>
    )}
  </Animated.View>
);