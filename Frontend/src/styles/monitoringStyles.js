// src/styles/SensorMonitoringStyles.js
import { StyleSheet } from 'react-native';

export const sensorStyles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerButton: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 12,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 16,
    paddingHorizontal: 6,
    paddingTop: 15,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  // Status Card Styles
  statusCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIconContainer: {
    backgroundColor: '#10b981',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
    flex: 1,
  },
  statusDetails: {
    gap: 12,
  },
  statusDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
  },
  statusDetailIcon: {
    marginRight: 12,
  },
  statusDetailText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
    fontWeight: '500',
  },
  intervalButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lastMeasurementItem: {
    backgroundColor: '#f0fdf4',
  },
  lastMeasurementText: {
    color: '#065f46',
  },
  nextMeasurementItem: {
    backgroundColor: '#fef3c7',
  },
  nextMeasurementText: {
    color: '#92400e',
  },

  // Sensor Grid Styles
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 20,
  },
  sensorGridItem: {
    width: '50%',
  },

  // Enhanced Sensor Card Styles
  sensorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  sensorCardActive: {
    borderWidth: 2,
  },
  sensorCardInactive: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  sensorCardBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    transform: [{ translateX: 20 }, { translateY: -20 }],
  },
  sensorCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sensorIconContainer: {
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
  },
  sensorCardTitleContainer: {
    flex: 1,
  },
  sensorCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  sensorStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sensorStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  sensorStatusDotActive: {
    backgroundColor: '#10b981',
  },
  sensorStatusDotInactive: {
    backgroundColor: '#6b7280',
  },
  sensorStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sensorStatusTextActive: {
    color: '#10b981',
  },
  sensorStatusTextInactive: {
    color: '#6b7280',
  },
  sensorValueContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sensorValue: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
  },
  sensorValueActive: {
    // dynamic color
  },
  sensorValueInactive: {
    color: '#1f2937',
  },
  sensorUnit: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  sensorUpdateContainer: {
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  sensorUpdateText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },

  // System Overview Styles
  systemOverview: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  systemOverviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  systemOverviewList: {
    gap: 12,
  },
  systemOverviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 12,
  },
  systemOverviewIcon: {
    marginRight: 12,
  },
  systemOverviewText: {
    fontSize: 14,
    color: '#065f46',
    fontWeight: '500',
  },
  systemOverviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 12,
  },
  systemOverviewButtonText: {
    fontSize: 14,
    color: '#1d4ed8',
    fontWeight: '500',
    flex: 1,
  },
  systemOverviewButtonIcon: {
    marginRight: 12,
  },

  // Error Display Styles
  errorContainer: {
    backgroundColor: "#fecaca",
    padding: 16,
    borderRadius: 8,
    margin: 24,
  },
  errorText: {
    color: "#7f1d1d",
    fontSize: 14,
    fontWeight: "600",
  },
  retryButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // Save Button Styles
  saveButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    margin: 24,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },

  // Animation Styles
  fadeIn: {},
  slideIn: {},
  pulse: {},

  // Color Variables
  colors: {
    primary: '#3b82f6',
    secondary: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#f8fafc',
    cardBackground: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    border: '#e5e7eb',
    borderLight: 'rgba(0,0,0,0.08)',
  },

  // Sensor Color Mappings
  sensorColors: {
    weight: '#3b82f6',
    volume: '#06b6d4',
    temperature: '#f59e0b',
    pH: '#10b981',
     density: '#ef4444', 
  },

densityCardContainer: {
  width: '100%',
  marginBottom: 5,
  alignItems: 'center',  
},

sensorCardFull: {
  width: '93%',     
},


regularSensorsGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},

// Density card styles
densityCard: {
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: 20,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 3.84,
  elevation: 5,
  borderWidth: 2,
  borderColor: 'transparent',
  minHeight: 120,
},

densityCardActive: {
  borderColor: '#ef4444',
  shadowOpacity: 0.15,
  shadowRadius: 5,
  elevation: 8,
},

densityCardInactive: {
  opacity: 0.7,
  backgroundColor: '#f8f9fa',
},

densityCardBackground: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 16,
  opacity: 0.1,
},

densityCardContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: 1,
},

densityCardLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},

densityCardRight: {
  alignItems: 'flex-end',
  justifyContent: 'center',
  marginLeft: 16,
},

densityIconContainer: {
  width: 56,
  height: 56,
  borderRadius: 28,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 16,
},

densityCardInfo: {
  flex: 1,
},

densityCardTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: 4,
},

densityValue: {
  fontSize: 36,
  fontWeight: '700',
  color: '#1f2937',
  textAlign: 'right',
},

densityUnit: {
  fontSize: 16,
  fontWeight: '500',
  color: '#6b7280',
  marginTop: 4,
  textAlign: 'right',
},

densityUpdateText: {
  fontSize: 12,
  color: '#9ca3af',
  marginTop: 4,
}
});
