// components/notifications/NotificationBell.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

const NotificationBell = ({ notifications, unreadCount, onMarkAsRead }) => {
  const [showModal, setShowModal] = useState(false);

  const formatTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l’instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
  };

  const getAlertColor = (metric) => {
    const colors = {
      temperature: '#f59e0b',
      pH: '#10b981',
      weight: '#3b82f6',
      volume: '#06b6d4',
      qualityScore: '#8b5cf6',
    };
    return colors[metric] || '#9ca3af';
  };

  const renderNotificationItem = ({ item }) => {
    if (!item) return null;
    
    const metric = item.metric || 'inconnu';
    const message = item.message || 'Pas de message';
    const value = item.value || 'N/A';
    const operator = item.operator || '';
    const threshold = item.threshold || 'N/A';
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.read && styles.unreadNotification
        ]}
        onPress={() => onMarkAsRead && onMarkAsRead(item._id)}
      >
        <View style={styles.notificationHeader}>
          <View style={styles.metricContainer}>
            <View style={[
              styles.metricDot,
              { backgroundColor: getAlertColor(metric) }
            ]} />
            <Text style={styles.metricText}>
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </Text>
          </View>
          <Text style={styles.timeText}>
            {item.at ? formatTime(item.at) : 'Heure inconnue'}
          </Text>
        </View>
        
        <Text style={styles.messageText}>{message}</Text>
        
        {item.containerId && (
          <Text style={styles.containerText}>Conteneur : {item.containerId}</Text>
        )}
        
        <View style={styles.alertDetails}>
          <Text style={styles.detailText}>
            Valeur : {value} {operator} {threshold}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.bellButton}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.bellIconContainer}>
          <Text style={styles.bellIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <Text style={styles.modalSubtitle}>
                {notifications?.length || 0} au total
                {unreadCount > 0 ? ` • ${unreadCount} non lues` : ''}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={notifications || []}
            renderItem={renderNotificationItem}
            keyExtractor={(item, index) => item._id || index.toString()}
            contentContainerStyle={styles.notificationsList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <Text style={styles.emptyIcon}>🔔</Text>
                </View>
                <Text style={styles.emptyTitle}>Aucune notification</Text>
                <Text style={styles.emptyText}>
                  Vous verrez vos alertes ici lorsque vos seuils de surveillance seront dépassés
                </Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = {
  bellButton: {
    position: 'relative',
    padding: 8,
  },
  bellIconContainer: {
    position: 'relative',
  },
  bellIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationsList: {
    padding: 24,
    paddingTop: 16,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  metricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  metricText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  timeText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 22,
    fontWeight: '500',
  },
  containerText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    fontWeight: '500',
  },
  alertDetails: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
};

export default NotificationBell;