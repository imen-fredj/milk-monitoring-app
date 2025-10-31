import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { alertManagementStyles as styles } from "../../styles/alertManagementStyles";

// Constants for metrics configuration
export const METRICS = [
  { label: "Température", value: "temperature", color: "#f59e0b" },
  { label: "Niveau de pH", value: "pH", color: "#10b981" },
  { label: "Poids", value: "weight", color: "#3b82f6" },
  { label: "Volume", value: "volume", color: "#06b6d4" },
  { label: "Score de qualité", value: "qualityScore", color: "#8b5cf6" },
];

export const getMetricColor = (metricValue) => {
  const metric = METRICS.find((m) => m.value === metricValue);
  return metric ? metric.color : "#3b82f6";
};

export const getMetricLabel = (metricValue) => {
  const metric = METRICS.find((m) => m.value === metricValue);
  return metric ? metric.label : metricValue;
};
const formatLastTriggered = (date) => {
  if (!date) return "Jamais";
  try {
    return new Date(date).toLocaleDateString("fr-FR");
  } catch {
    return "Date invalide";
  }
};

const AlertItem = ({ 
  item, 
  index, 
  fadeAnim, 
  cardsAnim, 
  onToggle, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: cardsAnim }],
      }}
    >
      <View style={styles.alertItem}>
        {/* Decorative element */}
        <View
          style={[
            styles.alertDecor,
            { backgroundColor: `${getMetricColor(item.metric)}15` },
          ]}
        />

        <View style={styles.alertHeader}>
          <View style={styles.alertTitleContainer}>
            <Text style={styles.alertName}>{item.name}</Text>
            <View
              style={[
                styles.statusBadge,
                item.status === "active"
                  ? styles.statusActive
                  : styles.statusPaused,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      item.status === "active" ? "#10b981" : "#9ca3af",
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {item.status === "active" ? "Actif" : "En pause"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.alertConditionContainer}>
          <View style={styles.metricBadge}>
            <Text
              style={[
                styles.metricText,
                { color: getMetricColor(item.metric) },
              ]}
            >
              {METRICS.find((m) => m.value === item.metric)?.label ||
                item.metric}
            </Text>
          </View>
          <Text style={styles.alertCondition}>
            {item.operator} {item.threshold}
          </Text>
        </View>

        {item.containerId && (
          <View style={styles.alertContainerContainer}>
            <Text style={styles.alertContainer}>
              Conteneur: {item.containerId}
            </Text>
          </View>
        )}

        <View style={styles.alertFooter}>
          <Text style={styles.alertLastTriggered}>
            Dernière activation: {formatLastTriggered(item.lastTriggeredAt)}
          </Text>

          <View style={styles.alertActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                item.status === "active"
                  ? styles.pauseButton
                  : styles.activateButton,
              ]}
              onPress={() => onToggle(item._id)}
            >
              <Text style={styles.actionButtonText}>
                {item.status === "active" ? "Pause" : "Activer"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit(item)}
            >
              <Text style={styles.editButtonText}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(item._id)}
            >
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default AlertItem;