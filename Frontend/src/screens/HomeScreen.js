import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { globalStyles } from "../styles/globalStyles";

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ setCurrentScreen, measurements }) => {
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);
  const [activeContainer, setActiveContainer] = useState("all");

  // Entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculate summary statistics
  const calculateSummary = () => {
    if (measurements.length === 0) {
      return {
        totalMeasurements: 0,
        container1Count: 0,
        container2Count: 0,
        latestDensity: "0.00",
        latestQuality: "No data",
      };
    }

    const container1Count = measurements.filter((m) =>
      (m.containerId || "").includes("1")
    ).length;
    const container2Count = measurements.filter((m) =>
      (m.containerId || "").includes("2")
    ).length;
    const latestMeasurement = measurements[0];
    const latestDensity = (
      latestMeasurement.weight / latestMeasurement.volume
    ).toFixed(2);

    let latestQuality = "Fair";
    if (latestMeasurement.pH > 6.8 && latestMeasurement.temperature < 5) {
      latestQuality = "Excellent";
    } else if (
      latestMeasurement.pH > 6.5 &&
      latestMeasurement.temperature < 6
    ) {
      latestQuality = "Good";
    }

    return {
      totalMeasurements: measurements.length,
      container1Count,
      container2Count,
      latestDensity,
      latestQuality,
    };
  };

  const summary = calculateSummary();

  // Filter measurements by container
  const filteredMeasurements =
    activeContainer === "all"
      ? measurements
      : measurements.filter((m) =>
          (m.containerId || "").includes(activeContainer.split("-")[1])
        );

  // Get latest 3 measurements
  const recentMeasurements = filteredMeasurements.slice(0, 3);

  // Container selector button
  const ContainerButton = ({ label, value, icon, color }) => {
    const isActive = activeContainer === value;
    const buttonAnim = new Animated.Value(isActive ? 1.05 : 1);

    useEffect(() => {
      Animated.spring(buttonAnim, {
        toValue: isActive ? 1.05 : 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }, [isActive]);

    return (
      <Animated.View style={{ transform: [{ scale: buttonAnim }], flex: 1 }}>
        <TouchableOpacity
          style={[
            globalStyles.filter.button,
            isActive && globalStyles.filter.buttonSelected,
            isActive && { backgroundColor: color },
          ]}
          onPress={() => setActiveContainer(value)}
        >
          <Icon
            name={icon}
            size={20}
            color={isActive ? "#ffffff" : "#64748b"}
          />
          <Text
            style={[
              globalStyles.filter.buttonText,
              isActive && globalStyles.filter.buttonTextSelected,
              { marginLeft: 8 },
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Summary card component
  const SummaryCard = ({ title, value, subtitle, icon, color, index }) => {
    const cardAnim = new Animated.Value(0);

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          globalStyles.statCard.container,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
            borderColor: `${color}20`,
          },
        ]}
      >
        <View
          style={[
            globalStyles.statCard.accent,
            { backgroundColor: `${color}08` },
          ]}
        />

        <View style={globalStyles.statCard.header}>
          <View
            style={[
              globalStyles.statCard.iconContainer,
              { backgroundColor: `${color}15` },
            ]}
          >
            <Icon name={icon} size={20} color={color} />
          </View>
          <Text style={globalStyles.statCard.title}>{title}</Text>
        </View>

        <Text style={[globalStyles.statCard.value, { color: color }]}>
          {value}
        </Text>

        <Text style={[globalStyles.statCard.unit, { color }]}>{subtitle}</Text>
      </Animated.View>
    );
  };

  // Recent measurement card
  const RecentMeasurementCard = ({ measurement, index }) => {
    const cardAnim = new Animated.Value(0);

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    const containerNumber = measurement.containerId?.split("-")[1] || "?";
    const color = containerNumber === "1" ? "#3b82f6" : "#8b5cf6";
    const date = new Date(measurement.timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <Animated.View
        style={[
          {
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            opacity: cardAnim,
            transform: [
              {
                translateX: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                {
                  backgroundColor: `${color}15`,
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                },
              ]}
            >
              <Icon name="inventory" size={20} color={color} />
            </View>
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}
              >
                {measurement.containerId || "Container"}
              </Text>
              <Text style={{ fontSize: 12, color: "#64748b" }}>
                {formattedDate} • {formattedTime}
              </Text>
            </View>
          </View>
          <View
            style={[
              globalStyles.qualityBadge,
              measurement.quality === "Excellent"
                ? globalStyles.excellentBadge
                : measurement.quality === "Good"
                ? globalStyles.goodBadge
                : globalStyles.fairBadge,
            ]}
          >
            <Text
              style={[
                globalStyles.qualityText,
                measurement.quality === "Excellent"
                  ? globalStyles.excellentText
                  : measurement.quality === "Good"
                  ? globalStyles.goodText
                  : globalStyles.fairText,
              ]}
            >
              {measurement.quality}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: "#64748b" }}>Weight</Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}>
              {measurement.weight} kg
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: "#64748b" }}>Volume</Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}>
              {measurement.volume} L
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: "#64748b" }}>Density</Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}>
              {(measurement.weight / measurement.volume).toFixed(2)} kg/L
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <ScrollView
        style={globalStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {/* Summary Cards */}
        <Animated.View
          style={[
            {
              paddingHorizontal: 18,
              paddingVertical: 25,
              marginBottom: 20,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#1f2937",
              marginBottom: 16,
              paddingHorizontal: 6,
            }}
          >
            📊 Quick Stats
          </Text>
          <View style={{ flexDirection: "row" }}>
            <SummaryCard
              title="Total Records"
              value={summary.totalMeasurements}
              subtitle="measurements"
              icon="storage"
              color="#6366f1"
              index={0}
            />
            <SummaryCard
              title="Latest Density"
              value={summary.latestDensity}
              subtitle="kg/L"
              icon="speed"
              color="#10b981"
              index={1}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <SummaryCard
              title="Container-1"
              value={summary.container1Count}
              subtitle="records"
              icon="looks-one"
              color="#3b82f6"
              index={2}
            />
            <SummaryCard
              title="Container-2"
              value={summary.container2Count}
              subtitle="records"
              icon="looks-two"
              color="#8b5cf6"
              index={3}
            />
          </View>
        </Animated.View>

        {/* Recent Measurements */}
        <Animated.View
          style={[
            {
              paddingHorizontal: 24,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#1f2937",
              }}
            >
              ⏱ Recent Data
            </Text>
            <TouchableOpacity
              onPress={() => setCurrentScreen("states")}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#3b82f6",
                  fontWeight: "600",
                  marginRight: 4,
                }}
              >
                View All
              </Text>
              <Icon name="arrow-forward" size={18} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {recentMeasurements.length > 0 ? (
            recentMeasurements.map((measurement, index) => (
              <RecentMeasurementCard
                key={`${measurement.id}-${index}`}
                measurement={measurement}
                index={index}
              />
            ))
          ) : (
            <View
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 16,
                padding: 24,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Icon
                name="inbox"
                size={48}
                color="#9ca3af"
                style={{ marginBottom: 16 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                No measurements found
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  textAlign: "center",
                }}
              >
                {activeContainer === "all"
                  ? "Start monitoring to collect data"
                  : `No data available for ${activeContainer}`}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[
            {
              paddingHorizontal: 24,
              marginTop: 24,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#1f2937",
              marginBottom: 16,
            }}
          >
            ⚡ Quick Actions
          </Text>

          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <TouchableOpacity
              style={[globalStyles.primaryButton, { flex: 1, marginRight: 6 }]}
              onPress={() => setCurrentScreen("monitor")}
            >
              <View style={globalStyles.buttonContent}>
                <Icon name="sensors" size={24} color="#ffffff" />
                <Text style={globalStyles.primaryButtonText}>Live Monitor</Text>
              </View>
              <Icon name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.secondaryButton, { flex: 1, marginLeft: 6 }]}
              onPress={() => setCurrentScreen("analytics")}
            >
              <View style={globalStyles.buttonContent}>
                <Icon name="analytics" size={24} color="#3b82f6" />
                <Text
                  style={[
                    globalStyles.secondaryButtonText,
                    { color: "#3b82f6" },
                  ]}
                >
                  Analytics
                </Text>
              </View>
              <Icon name="arrow-forward" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[globalStyles.secondaryButton, { marginBottom: 12 }]}
            onPress={() => setCurrentScreen("states")}
          >
            <View style={globalStyles.buttonContent}>
              <Icon name="states" size={24} color="#8b5cf6" />
              <Text
                style={[globalStyles.secondaryButtonText, { color: "#8b5cf6" }]}
              >
                Measurement states
              </Text>
            </View>
            <Icon name="arrow-forward" size={20} color="#8b5cf6" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
