import React from "react";
import { ScrollView, TouchableOpacity, Text, Animated } from "react-native";

export const TimePeriodFilter = ({ days, setDays, presets, fadeAnim, slideAnim }) => (
  <Animated.View
    style={{
      marginHorizontal: 24,
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
      marginBottom: 16,
    }}
  >
    <Text
      style={{
        fontSize: 16,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 12,
        paddingHorizontal: 6,
      }}
    >
      Période
    </Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {presets.map((preset) => (
        <TouchableOpacity
          key={preset.value}
          style={{
            backgroundColor: days === preset.value ? "#2563eb" : "#e5e7eb",
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            marginRight: 8,
          }}
          onPress={() => setDays(preset.value)}
        >
          <Text
            style={{
              color: days === preset.value ? "#fff" : "#1f2937",
              fontWeight: "600",
            }}
          >
            {preset.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </Animated.View>
);