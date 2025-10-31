import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export const TrendChart = ({ 
  data, 
  title, 
  subtitle, 
  selectedMetric = "weight", 
  setSelectedMetric, 
  fadeAnim, 
  slideAnim, 
  globalStyles 
}) => {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 32;

  if (!data || !data.data || data.data.length === 0) {
    return (
      <View style={[globalStyles?.chart?.container || styles.container]}>
        <View style={[globalStyles?.chart?.header || styles.header]}>
          <View style={[globalStyles?.chart?.iconContainer || styles.iconContainer]}>
            <Text style={{ fontSize: 16, color: "#3b82f6" }}>📊</Text>
          </View>
          <View>
            <Text style={[globalStyles?.chart?.title || styles.title]}>{title}</Text>
            <Text style={[globalStyles?.chart?.subtitle || styles.subtitle]}>{subtitle}</Text>
          </View>
        </View>
        <View style={[styles.emptyChart, { height: 220 }]}>
          <Text style={{ color: "#6b7280", fontSize: 14 }}>
            Aucune donnée disponible
          </Text>
        </View>
      </View>
    );
  }

  const chartData = data.data.slice(-7);

  const getMetricValue = (item) =>
    selectedMetric === "weight" ? item.avgWeight || 0 : item.avgVolume || 0;

  const formatDateLabel = (dateString, index) => {
    if (!dateString) return `J${index + 1}`;
    
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Auj.";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const metricValues = chartData.map(getMetricValue);
  const maxValue = Math.max(...metricValues);
  const minValue = Math.min(...metricValues);
  const avgValue = metricValues.reduce((sum, val) => sum + val, 0) / metricValues.length;

  const metricConfig = {
    weight: { color: "#3b82f6", unit: "kg", icon: "⚖️", label: "Poids" },
    volume: { color: "#10b981", unit: "L", icon: "🧪", label: "Volume" },
  };
  const config = metricConfig[selectedMetric];

  const lineChartData = {
    labels: chartData.map((item, index) => formatDateLabel(item.date, index)),
    datasets: [
      {
        data: metricValues,
        color: (opacity = 1) => config.color.replace(')', `, ${opacity})`).replace('rgb', 'rgba'),
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#f8fafc",
    decimalPlaces: 1,
    color: (opacity = 1) => config.color.replace(')', `, ${opacity})`).replace('#', 'rgba(').replace(/^rgba\(([^,]+)/, (match, hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}`;
    }),
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: config.color,
      fill: "#ffffff",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#e5e7eb",
      strokeWidth: 1,
    },
    formatYLabel: (value) => `${parseFloat(value).toFixed(1)}${config.unit}`,
  };

  return (
    <View style={[globalStyles?.chart?.container || styles.container]}>
      <View style={[globalStyles?.chart?.header || styles.header]}>
        <View
          style={[
            globalStyles?.chart?.iconContainer || styles.iconContainer,
            { backgroundColor: `${config.color}15` },
          ]}
        >
          <Text style={{ fontSize: 16, color: config.color }}>
            {config.icon}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles?.chart?.title || styles.title]}>
            Tendances {config.label}
          </Text>
          <Text style={[globalStyles?.chart?.subtitle || styles.subtitle]}>
            {subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            {
              backgroundColor: selectedMetric === "weight" ? "#3b82f6" : "transparent",
            }
          ]}
          onPress={() => setSelectedMetric("weight")}
        >
          <Text
            style={[
              styles.toggleText,
              {
                color: selectedMetric === "weight" ? "#fff" : "#6b7280",
              }
            ]}
          >
            ⚖️ Poids
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            {
              backgroundColor: selectedMetric === "volume" ? "#10b981" : "transparent",
            }
          ]}
          onPress={() => setSelectedMetric("volume")}
        >
          <Text
            style={[
              styles.toggleText,
              {
                color: selectedMetric === "volume" ? "#fff" : "#6b7280",
              }
            ]}
          >
            🧪 Volume
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={lineChartData}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withHorizontalLines={true}
          withVerticalLines={false}
          withDots={true}
          withShadow={false}
          withScrollableDot={false}
          withInnerLines={true}
          withOuterLines={false}
          yAxisSuffix={config.unit}
          segments={4}
        />
      </View>

      <View style={[globalStyles?.chart?.summary || styles.summary]}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryBadge, { backgroundColor: "#d1fae5" }]}>
            <Text style={[styles.summaryValue, { color: "#059669" }]}>
              {maxValue.toFixed(1)}
            </Text>
          </View>
          <Text style={styles.summaryLabel}>Pic</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <View style={[styles.summaryBadge, { backgroundColor: "#dbeafe" }]}>
            <Text style={[styles.summaryValue, { color: "#2563eb" }]}>
              {avgValue.toFixed(1)}
            </Text>
          </View>
          <Text style={styles.summaryLabel}>Moyenne</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <View style={[styles.summaryBadge, { backgroundColor: "#fef3c7" }]}>
            <Text style={[styles.summaryValue, { color: "#d97706" }]}>
              {minValue.toFixed(1)}
            </Text>
          </View>
          <Text style={styles.summaryLabel}>Bas</Text>
        </View>
      </View>
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
    backgroundColor: "#f8fafc",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 13,
  },
  chartContainer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  chart: {
    borderRadius: 12,
  },
  emptyChart: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    paddingTop: 8,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
  },
};