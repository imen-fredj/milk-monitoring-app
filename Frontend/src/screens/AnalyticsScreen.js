import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import {
  useAllContainersAnalytics,
  useContainerAnalytics,
  useTrendData,
  useTimePeriod,
} from "../hooks/analytics/useAnalyticsData";

import { ContainerSelector } from "../components/selectors/ContainerSelector";
import { StatCard } from "../components/analytics/StatCard";
import { TrendChart } from "../components/analytics/TrendChart";
import { TimePeriodFilter } from "../components/analytics/TimePeriodFilter";
import { AnalyticsHeader } from "../components/analytics/AnalyticsHeader";
import { LoadingState } from "../components/analytics/LoadingState";
import { EmptyState } from "../components/analytics/EmptyState";

const AnalyticsScreen = ({ setCurrentScreen, measurements }) => {
  const [containers, setContainers] = useState([
    { id: "milk1", name: "Conteneur de Lait 1" },
    { id: "milk2", name: "Conteneur de Lait 2" },
  ]);
  const [activeContainerId, setActiveContainerId] = useState("milk1");
  const [selectedMetric, setSelectedMetric] = useState("weight");
  const { days, setDays, presets } = useTimePeriod(7);

  // Animations
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  // Data hooks
  const {
    data: allAnalytics,
    loading: allLoading,
    error: allError,
  } = useAllContainersAnalytics(days);
  const { data: containerAnalytics, loading: containerLoading } =
    useContainerAnalytics(activeContainerId, days);
  const { data: trendData, loading: trendLoading } = useTrendData(
    activeContainerId,
    days
  );

  // Animation Effects
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Loading state
  if (allLoading || containerLoading) {
    return <LoadingState />;
  }

  // Empty state
  if (!measurements || measurements.length === 0) {
    return <EmptyState />;
  }

  return (
    <SafeAreaView style={globalStyles.analytics.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />

      <ScrollView
        style={globalStyles.analytics.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <AnalyticsHeader days={days} />
        
        <TimePeriodFilter 
          days={days} 
          setDays={setDays} 
          presets={presets} 
          fadeAnim={fadeAnim} 
          slideAnim={slideAnim} 
        />

        <ContainerSelector
          containers={containers}
          activeContainerId={activeContainerId}
          onContainerSelect={setActiveContainerId}
        />

        {/* Enhanced Stats Grid with Volume */}
        {containerAnalytics && (
          <View style={{ paddingHorizontal: 12, marginBottom: 24 }}>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <StatCard
                title="Poids Moyen"
                value={containerAnalytics.weight?.average?.toFixed(1) || "0"}
                unit="kg"
                icon="⚖️"
                color="#3b82f6"
                scaleAnim={scaleAnim}
                fadeAnim={fadeAnim}
              />
              <StatCard
                title="Volume Moyen"
                value={containerAnalytics.volume?.average?.toFixed(1) || "0"}
                unit="L"
                icon="🧪"
                color="#10b981"
                scaleAnim={scaleAnim}
                fadeAnim={fadeAnim}
              />
            </View>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <StatCard
                title="Poids Max"
                value={containerAnalytics.weight?.max?.toFixed(1) || "0"}
                unit="kg"
                icon="📈"
                color="#f59e0b"
                scaleAnim={scaleAnim}
                fadeAnim={fadeAnim}
              />
              <StatCard
                title="Volume Max"
                value={containerAnalytics.volume?.max?.toFixed(1) || "0"}
                unit="L"
                icon="📊"
                color="#ef4444"
                scaleAnim={scaleAnim}
                fadeAnim={fadeAnim}
              />
            </View>
            <View>
              <StatCard
                title="Mesures"
                value={containerAnalytics.totalMeasurements?.toString() || "0"}
                unit="total"
                icon="📋"
                color="#8b5cf6"
                scaleAnim={scaleAnim}
                fadeAnim={fadeAnim}
              />
            </View>
          </View>
        )}

        <TrendChart
          data={trendData}
          title="Tendances"
          subtitle={`${activeContainerId} - Derniers ${days} jours`}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          globalStyles={globalStyles}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;