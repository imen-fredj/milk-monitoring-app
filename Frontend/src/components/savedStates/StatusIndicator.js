import React from 'react';
import { View, Text } from 'react-native';

const StatusIndicator = ({ totalStates, recentStates }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: totalStates > 0 ? "#d1fae5" : "#fef3c7",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginBottom: 16,
    }}
  >
    <View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: totalStates > 0 ? "#10b981" : "#f59e0b",
        marginRight: 6,
      }}
    />
    <Text
      style={{
        fontSize: 12,
        color: totalStates > 0 ? "#065f46" : "#92400e",
        fontWeight: "600",
      }}
    >
      {totalStates > 0
        ? `${totalStates} état${totalStates > 1 ? 's' : ''} disponible${totalStates > 1 ? 's' : ''}`
        : "Aucun état sauvegardé"}
      {recentStates > 0 &&
        ` • ${recentStates} récent${recentStates > 1 ? 's' : ''}`}
    </Text>
  </View>
);

export default StatusIndicator;
