import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { alertManagementStyles as styles } from "../../styles/alertManagementStyles";

export const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3b82f6" />
    <Text style={styles.loadingText}>Chargement des alertes...</Text>
  </View>
);

export const ErrorState = ({ error, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
      <Text style={styles.retryText}>Réessayer</Text>
    </TouchableOpacity>
  </View>
);

export const EmptyState = ({ loading }) => (
  !loading && (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Aucune alerte trouvée</Text>
    </View>
  )
);