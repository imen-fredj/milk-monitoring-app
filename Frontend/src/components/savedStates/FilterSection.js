import React from "react";
import { View, Text, ScrollView } from "react-native";
import FilterChip from "./FilterChip";

const FilterSection = ({
  selectedContainer,
  setSelectedContainer,
  selectedDateFilter,
  setSelectedDateFilter,
  availableContainers,
  dateFilters,
  states,
}) => (
  <View
    style={{
      backgroundColor: "#ffffff",
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    }}
  >
    <Text
      style={{
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 12,
      }}
    >
      Filtrer par conteneur
    </Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 16 }}
    >
      <FilterChip
        label="Tous"
        count={states.length}
        isSelected={selectedContainer === "all"}
        onPress={() => setSelectedContainer("all")}
      />

      {availableContainers.map((container) => {
        const count = states.filter(
          (s) => s.containerName === container
        ).length;
        return (
          <FilterChip
            key={container}
            label={container}
            count={count}
            isSelected={selectedContainer === container}
            onPress={() => setSelectedContainer(container)}
          />
        );
      })}
    </ScrollView>

    <Text
      style={{
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 12,
      }}
    >
      Filtrer par date
    </Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {dateFilters.map((filter) => (
        <FilterChip
          key={filter.key}
          label={filter.label}
          isSelected={selectedDateFilter === filter.key}
          onPress={() => setSelectedDateFilter(filter.key)}
          selectedColor="#10b981"
        />
      ))}
    </ScrollView>
  </View>
);

export default FilterSection;
