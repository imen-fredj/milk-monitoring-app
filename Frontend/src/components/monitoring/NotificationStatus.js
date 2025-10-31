import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const notificationStatusStyles = {
  container: {
    marginHorizontal: 24,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  text: {
    fontSize: 14,
    color: '#0c4a6e',
  },
  error: {
    backgroundColor: '#fef2f2',
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
  },
  warning: {
    backgroundColor: '#fffbeb',
    borderLeftColor: '#f59e0b',
  },
  warningText: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '500',
  },
  success: {
    backgroundColor: '#f0fdf4',
    borderLeftColor: '#22c55e',
  },
  successText: {
    color: '#166534',
    fontSize: 14,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ef4444',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
};

const NotificationStatus = ({ notifications, activeContainerId }) => {
  if (notifications.loading) {
    return (
      <View style={notificationStatusStyles.container}>
        <Text style={notificationStatusStyles.text}>
          Chargement des notifications...
        </Text>
      </View>
    );
  }

  if (notifications.error && !notifications.isStreamConnected) {
    return (
      <View style={[notificationStatusStyles.container, notificationStatusStyles.error]}>
        <Text style={notificationStatusStyles.errorText}>
          Alertes hors ligne - Reconnexion en cours...
        </Text>
        <TouchableOpacity 
          onPress={notifications.startStream}
          style={notificationStatusStyles.retryButton}
        >
          <Text style={notificationStatusStyles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const recentCount = notifications.recentNotifications.length;
  
  if (recentCount > 0) {
    return (
      <View style={[notificationStatusStyles.container, notificationStatusStyles.warning]}>
        <Text style={notificationStatusStyles.warningText}>
          {recentCount} alerte{recentCount > 1 ? 's' : ''} dans les dernières 24h
        </Text>
      </View>
    );
  }

  return (
    <View style={[notificationStatusStyles.container, notificationStatusStyles.success]}>
      <Text style={notificationStatusStyles.successText}>
        Aucune alerte récente - Système stable
      </Text>
    </View>
  );
};

export default NotificationStatus;
