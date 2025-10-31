// services/notificationService.js
const API_URL = "http://localhost:5000";

export const getNotifications = async (params = {}) => {
  try {
    const cleanParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanParams[key] = value;
      }
    });
    
    const queryString = new URLSearchParams(cleanParams).toString();
    const url = queryString ? `${API_URL}/notifications?${queryString}` : `${API_URL}/notifications`;
    
    console.log('Fetching notifications from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
    
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return [];
  }
};

// Real-time notification stream
export class NotificationStream {
  constructor(onNotification, onError) {
    this.onNotification = onNotification;
    this.onError = onError;
    this.eventSource = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  connect() {
    try {
      this.eventSource = new EventSource(`${API_URL}/notifications/stream`);
      
      this.eventSource.onopen = () => {
        console.log('Notification stream connected');
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000; // Reset delay on successful connection
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received SSE data:', data);
          
          // Your alert engine broadcasts with this structure:
          // { type: "alert", alertId, containerId, message, at }
          if (data.type === "alert") {
            this.onNotification(data);
          }
        } catch (err) {
          console.error('Error parsing notification:', err);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('Notification stream error:', error);
        this.eventSource.close();
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          
          setTimeout(() => {
            this.connect();
          }, this.reconnectDelay);
          
          // Exponential backoff
          this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
        } else {
          this.onError && this.onError('Failed to connect to notification stream after multiple attempts');
        }
      };
    } catch (err) {
      console.error('Error creating notification stream:', err);
      this.onError && this.onError(err.message);
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}