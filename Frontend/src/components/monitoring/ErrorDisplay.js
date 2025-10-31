import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { sensorStyles } from "../../styles/monitoringStyles";

const ErrorDisplay = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <View style={sensorStyles.errorContainer}>
      <Text style={sensorStyles.errorText}>Erreur : {error}</Text>
      <TouchableOpacity onPress={onRetry} style={sensorStyles.retryButton}>
        <Text style={sensorStyles.retryButtonText}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorDisplay;
