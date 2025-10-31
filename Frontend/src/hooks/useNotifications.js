// hooks/useNotifications.js
import { useState, useEffect, useCallback } from "react";
import { getNotifications, NotificationStream } from "../services/notificationService";
import Toast from "react-native-toast-message";

export const useNotifications = (containerId = null) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [isStreamConnected, setIsStreamConnected] = useState(false);

  // Fetch stored notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (containerId) params.containerId = containerId;

      const notificationData = await getNotifications(params);
      setNotifications(Array.isArray(notificationData) ? notificationData : []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [containerId]);

  // Handle new notification from stream
  const handleNewNotification = useCallback((alertData) => {
    // Your alert engine sends: { type: "alert", alertId, containerId, message, at }
    
    // Filter by container if specified
    if (containerId && alertData.containerId !== containerId) {
      return;
    }

    // Transform the SSE alert data to match notification format
    const notification = {
      _id: `sse_${Date.now()}_${Math.random()}`, // Temporary ID for SSE notifications
      alertId: alertData.alertId,
      containerId: alertData.containerId,
      message: alertData.message,
      at: alertData.at,
      read: false, // Mark as unread
      type: alertData.type,
    };

    // Add to notifications list
    setNotifications(prev => [notification, ...prev]);

    // Show toast notification
    Toast.show({
      type: "error", // Use error type for alerts since they indicate threshold breaches
      text1: "Alert Triggered!",
      text2: alertData.message,
      visibilityTime: 5000,
      topOffset: 60,
    });

    console.log("New alert notification received:", notification);
  }, [containerId]);

  // Handle stream errors
  const handleStreamError = useCallback((error) => {
    console.error("Notification stream error:", error);
    setIsStreamConnected(false);
    setError(error);
  }, []);

  // Start real-time notifications
  const startStream = useCallback(() => {
    if (stream) {
      stream.disconnect();
    }

    const newStream = new NotificationStream(
      handleNewNotification,
      handleStreamError
    );

    newStream.connect();
    setStream(newStream);
    setIsStreamConnected(true);

    return newStream;
  }, [handleNewNotification, handleStreamError]);

  // Stop real-time notifications
  const stopStream = useCallback(() => {
    if (stream) {
      stream.disconnect();
      setStream(null);
      setIsStreamConnected(false);
    }
  }, [stream]);

  // Mark notification as read (you can implement this if needed)
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get recent notifications (last 24 hours)
  const recentNotifications = notifications.filter(notification => {
    const notificationTime = new Date(notification.at);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notificationTime > dayAgo;
  });

  // Auto-fetch on mount and when containerId changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Auto-start stream on mount
  useEffect(() => {
    const streamInstance = startStream();

    return () => {
      streamInstance.disconnect();
    };
  }, [containerId]); // Restart stream when container changes

  return {
    notifications,
    recentNotifications,
    unreadCount,
    loading,
    error,
    isStreamConnected,
    fetchNotifications,
    startStream,
    stopStream,
    markAsRead,
  };
};