import React from "react";
import { View, Text, StatusBar, SafeAreaView } from "react-native";
import { globalStyles } from "../../styles/globalStyles";

export const LoadingState = () => (
  <SafeAreaView style={globalStyles.analytics.screen}>
    <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ fontSize: 16, color: "#6b7280" }}>
        Chargement des analyses...
      </Text>
    </View>
  </SafeAreaView>
);