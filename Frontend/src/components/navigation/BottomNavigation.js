import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { globalStyles } from "../../styles/globalStyles";

const BottomNavigation = ({ currentScreen, setCurrentScreen }) => {
  const navItems = [
    {
      id: "sensors",
      icon: "sensors",
      label: "Monitoring",
    },
    {
      id: "analytics",
      icon: "bar-chart",
      label: "Analyses",
    },
    {
      id: "alerts",
      icon: "warning",
      label: "Alertes",
    },
    {
      id: "states",
      icon: "description",
      label: "États",
    },
  ];

  return (
    <View style={styles.floatingContainer}>
      <View style={[globalStyles.bottomNav, styles.container]}>
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[globalStyles.navItem, styles.navItem]}
              onPress={() => setCurrentScreen(item.id)}
              activeOpacity={0.7}
            >
              {/* Active indicator background */}
              {isActive && <View style={styles.activeBackground} />}

              {/* Icon container with enhanced styling */}
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.activeIconContainer,
                ]}
              >
                {/* Special handling for different icons */}
                {item.id === "sensors" ? (
                  <View style={styles.sensorsIconContainer}>
                    <Icon
                      name={item.icon}
                      size={24}
                      color={isActive ? "#ffffff" : "#6b7280"}
                    />
                    {/* Add a small indicator dot for sensors */}
                    <View
                      style={[
                        styles.sensorIndicator,
                        { backgroundColor: isActive ? "#ffffff" : "#10b981" },
                      ]}
                    />
                  </View>
                ) : item.id === "alerts" ? (
                  // Special styling for alerts icon with notification badge
                  <View style={styles.alertsIconContainer}>
                    <Icon
                      name={item.icon}
                      size={24}
                      color={isActive ? "#ffffff" : "#6b7280"}
                    />
                  </View>
                ) : item.id === "states" ? (
                  // Special styling for states icon
                  <View style={styles.statesIconContainer}>
                    <Icon
                      name={item.icon}
                      size={24}
                      color={isActive ? "#ffffff" : "#6b7280"}
                    />
                    {/* Add a small document indicator for states */}
                    <View
                      style={[
                        styles.statesIndicator,
                        { backgroundColor: isActive ? "#ffffff" : "#3b82f6" },
                      ]}
                    />
                  </View>
                ) : (
                  <Icon
                    name={item.icon}
                    size={24}
                    color={isActive ? "#ffffff" : "#6b7280"}
                  />
                )}
              </View>

              {/* Label with better typography */}
              <Text
                style={[
                  globalStyles.navLabel,
                  styles.navLabel,
                  { color: isActive ? "#3b82f6" : "#6b7280" },
                  isActive && styles.activeNavLabel,
                ]}
              >
                {item.label}
              </Text>

              {/* Active dot indicator */}
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // New floating container wrapper
  floatingContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24, // Safe area padding
    paddingTop: 0,
    pointerEvents: "box-none", // Allow touches to pass through transparent areas
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 24, // Rounded corners for floating effect
    borderTopWidth: 0, // Remove top border since it's floating
    borderWidth: 1,
    borderColor: "#f1f5f9",
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 12, // Reduced padding to accommodate 5 items
    marginHorizontal: 0,
    // Enhanced shadow for floating effect
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 16,
    // Subtle backdrop blur effect (iOS)
    backdropFilter: "blur(20px)",
    // Additional floating visual enhancements
    borderTopColor: "transparent",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 8, // Reduced padding
    minHeight: 64,
    position: "relative",
    borderRadius: 18,
    flex: 1, // Make items flexible to fit 5 items
    // Smooth transitions
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  activeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#eff6ff",
    borderRadius: 18,
    opacity: 0.9,
    // Subtle inner glow
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 38, // Slightly smaller to fit 5 items
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    marginBottom: 4,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  activeIconContainer: {
    backgroundColor: "#3b82f6",
    transform: [{ scale: 1.1 }], // Slightly smaller scale
    shadowColor: "#3b82f6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    // Subtle glow effect
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  sensorsIconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  sensorIndicator: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 2,
    borderColor: "#ffffff",
    // Subtle pulse animation
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  alertsIconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  alertsBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  alertsBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 12,
  },
  statesIconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  statesIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1.5,
    borderColor: "#ffffff",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  navLabel: {
    fontSize: 10, // Smaller font to fit 5 items
    fontWeight: "600",
    textAlign: "center",
    marginTop: 2,
    letterSpacing: 0.2,
    // Better text rendering
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },
  activeNavLabel: {
    fontWeight: "700",
    fontSize: 10,
    color: "#3b82f6",
    // Enhanced text shadow for active state
    textShadowColor: "rgba(59, 130, 246, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  activeDot: {
    position: "absolute",
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#3b82f6",
    // Enhanced glow for the active dot
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

export default BottomNavigation;
