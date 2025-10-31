import React from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";


export const ContainerSelector = ({
  containers,
  activeContainerId,
  onContainerSelect,
  showAddButton = false,
  onAddContainer,
  withCounts = false,
  counts = {},
}) => {
  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {containers.map((container) => (
          <TouchableOpacity
            key={container.id}
            style={{
              backgroundColor:
                activeContainerId === container.id ? "#2563eb" : "#e5e7eb",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              marginRight: 8,
            }}
            onPress={() => onContainerSelect(container.id)}
          >
            <Text
              style={{
                color:
                  activeContainerId === container.id ? "#fff" : "#444547ff",
                fontWeight: "600",
              }}
            >
              {container.name}
              {withCounts && counts[container.id] !== undefined
                ? ` (${counts[container.id]})`
                : ""}
            </Text>
          </TouchableOpacity>
        ))}

        {showAddButton && (
          <TouchableOpacity
            style={{
              backgroundColor: "#10b981",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
            }}
            onPress={onAddContainer}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              + Ajouter
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};
