import React from "react";
import { TouchableOpacity, View, Text, Animated } from "react-native";
import SensorDataPreview from "./SensorDataPreview";

const StateCard = ({
  state,
  isSelectionMode,
  isSelected,
  onPress,
  onExport,
  onDelete,
  fadeAnim,
  slideAnim,
}) => (
  <Animated.View
    style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
    }}
  >
    <TouchableOpacity
      onPress={() => onPress(state._id)}
      activeOpacity={isSelectionMode ? 0.7 : 1}
      style={{
        backgroundColor: "#ffffff",
        marginHorizontal: 24,
        marginBottom: 16,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
        overflow: "hidden",
        borderWidth: isSelectionMode && isSelected ? 3 : 0,
        borderColor: isSelectionMode && isSelected ? "#3b82f6" : "transparent",
      }}
    >
      {/* Checkbox de sélection */}
      {isSelectionMode && (
        <View
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: isSelected ? "#3b82f6" : "#ffffff",
              borderWidth: 2,
              borderColor: isSelected ? "#3b82f6" : "#d1d5db",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isSelected && (
              <Text
                style={{ color: "#ffffff", fontSize: 14, fontWeight: "bold" }}
              >
                ✓
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Élément décoratif */}
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 80,
          height: 80,
          backgroundColor: "rgba(59, 130, 246, 0.05)",
          borderRadius: 40,
          transform: [{ translateX: 20 }, { translateY: -20 }],
        }}
      />

      {/* En-tête */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          paddingRight: isSelectionMode ? 40 : 0,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: 4,
            }}
          >
            {state.stateName}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.08)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#3b82f6",
                  fontWeight: "600",
                }}
              >
                {state.containerName}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: "#6b7280",
                fontWeight: "500",
              }}
            >
              {new Date(state.createdAt).toLocaleString("fr-FR", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          {state.description && (
            <Text
              style={{
                fontSize: 13,
                color: "#6b7280",
                lineHeight: 18,
              }}
            >
              {state.description}
            </Text>
          )}
        </View>
      </View>

      <SensorDataPreview sensorData={state.sensorData} />

      {/* Actions - cachées en mode sélection */}
      {!isSelectionMode && (
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => onExport(state._id)}
            style={{
              flex: 1,
              backgroundColor: "#10b981",
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              alignItems: "center",
              shadowColor: "#10b981",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Exporter PDF
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(state._id)}
            style={{
              backgroundColor: "#ffffff",
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#ef4444",
            }}
          >
            <Text
              style={{
                color: "#ef4444",
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Supprimer
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  </Animated.View>
);

export default StateCard;
