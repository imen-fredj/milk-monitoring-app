import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { alertManagementStyles as styles } from "../../styles/alertManagementStyles";

const AlertFilters = ({ filters, onFiltersChange }) => {
  return (
    <View style={styles.filtersContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            !filters.status && styles.filterButtonActive,
          ]}
          onPress={() =>
            onFiltersChange((prev) => ({ ...prev, status: undefined }))
          }
        >
          <Text
            style={[
              styles.filterButtonText,
              !filters.status && styles.filterButtonTextActive,
            ]}
          >
            Tous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.status === "active" && styles.filterButtonActive,
          ]}
          onPress={() =>
            onFiltersChange((prev) => ({ ...prev, status: "active" }))
          }
        >
          <Text
            style={[
              styles.filterButtonText,
              filters.status === "active" && styles.filterButtonTextActive,
            ]}
          >
            Actifs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.status === "paused" && styles.filterButtonActive,
          ]}
          onPress={() =>
            onFiltersChange((prev) => ({ ...prev, status: "paused" }))
          }
        >
          <Text
            style={[
              styles.filterButtonText,
              filters.status === "paused" && styles.filterButtonTextActive,
            ]}
          >
            En pause
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AlertFilters;