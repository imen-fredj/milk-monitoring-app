import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { sensorStyles } from "../../styles/monitoringStyles";

const SaveStateButton = ({ onSave }) => (
  <TouchableOpacity onPress={onSave} style={sensorStyles.saveButton}>
    <Text style={sensorStyles.saveButtonText}>Sauvegarder l'état actuel</Text>
  </TouchableOpacity>
);

export default SaveStateButton;
