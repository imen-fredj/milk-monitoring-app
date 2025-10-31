import React from "react";
import { View, Text, StatusBar, SafeAreaView, ScrollView } from "react-native";
import { globalStyles } from "../../styles/globalStyles";

export const EmptyState = () => (
  <SafeAreaView style={globalStyles.analytics.screen}>
    <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
    <ScrollView style={globalStyles.analytics.scrollView}>
      <View style={globalStyles.header.container}>
        <View style={globalStyles.header.inner}>
          <View style={globalStyles.header.iconContainer}>
            <Text style={{ fontSize: 20, color: "#3b82f6" }}>📊</Text>
          </View>
          <Text style={globalStyles.header.title}>Analytiques</Text>
        </View>
        <Text style={globalStyles.header.subtitle}>
          Données et métriques de performance
        </Text>
      </View>

      <View style={globalStyles.analytics.emptyContainer}>
        <View style={globalStyles.analytics.emptyIconContainer}>
          <Text style={{ fontSize: 48, color: "#9ca3af" }}>📊</Text>
        </View>
        <Text style={globalStyles.analytics.emptyTitle}>
          Aucune Donnée Disponible
        </Text>
        <Text style={globalStyles.analytics.emptyText}>
          Commencez à surveiller vos conteneurs pour voir les analyses et
          insights ici. Les données apparaîtront une fois les mesures
          collectées.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);