import React from "react";
import { View, Text, StatusBar, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { globalStyles } from "../styles/globalStyles";

const LoadingScreen = ({ loadingDots }) => {
  const dot1Opacity = loadingDots.interpolate({
    inputRange: [0, 0.2, 0.4, 1],
    outputRange: [0.3, 1, 0.3, 0.3],
  });

  const dot2Opacity = loadingDots.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 1],
    outputRange: [0.3, 0.3, 1, 0.3, 0.3],
  });

  const dot3Opacity = loadingDots.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8, 1],
    outputRange: [0.3, 0.3, 0.3, 1, 0.3],
  });

  return (
    <View style={globalStyles.loadingContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
      <View style={globalStyles.loadingContent}>
        <View style={globalStyles.loadingLogo}>
          <Icon name="opacity" size={50} color="#ffffff" />
        </View>
        <Text style={globalStyles.loadingTitle}>
          Initialisation du système...
        </Text>
        <Text style={globalStyles.loadingSubtitle}>
          Configuration de vos outils de gestion laitière
        </Text>

        <View style={globalStyles.loadingDotsContainer}>
          <Animated.View
            style={[globalStyles.loadingDot, { opacity: dot1Opacity }]}
          />
          <Animated.View
            style={[globalStyles.loadingDot, { opacity: dot2Opacity }]}
          />
          <Animated.View
            style={[globalStyles.loadingDot, { opacity: dot3Opacity }]}
          />
        </View>

        <View style={globalStyles.loadingSteps}>
          <View style={globalStyles.loadingStep}>
            <Icon name="check-circle" size={16} color="#10b981" />
            <Text style={globalStyles.loadingStepText}>
              Connexion aux capteurs
            </Text>
          </View>
          <View style={globalStyles.loadingStep}>
            <Icon name="hourglass-empty" size={16} color="#f59e0b" />
            <Text style={globalStyles.loadingStepText}>
              Étalonnage des outils de mesure
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoadingScreen;
