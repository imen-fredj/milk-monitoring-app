import React from 'react';
import { View, Text, Animated } from 'react-native';

const StatsCards = ({ totalStates, recentStates, fadeAnim, slideAnim }) => (
  <Animated.View
    style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
    }}
  >
    <View
      style={{
        flexDirection: "row",
        marginBottom: 20,
        gap: 12,
      }}
    >
      {/* Carte : Total */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          padding: 16,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: "#3b82f6",
            marginBottom: 4,
          }}
        >
          {totalStates}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#6b7280",
            fontWeight: "600",
          }}
        >
          États totaux
        </Text>
      </View>

      {/* Carte : Cette semaine */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          padding: 16,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: "#10b981",
            marginBottom: 4,
          }}
        >
          {recentStates}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#6b7280",
            fontWeight: "600",
          }}
        >
          Cette semaine
        </Text>
      </View>
    </View>
  </Animated.View>
);

export default StatsCards;
