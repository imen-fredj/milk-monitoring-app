import React from "react";
import { View, Text } from "react-native";
import NotificationBell from "./NotificationBell";
import { sensorStyles } from "../../styles/monitoringStyles";

const Header = ({ notifications, unreadCount, onMarkAsRead, isStreamConnected }) => (
  <View style={{ 
    paddingHorizontal: 24, 
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <Text style={sensorStyles.headerTitle}>Surveillance en direct</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: isStreamConnected ? '#4CAF50' : '#F44336',
        marginRight: 12
      }} />
      <NotificationBell 
        notifications={notifications} 
        unreadCount={unreadCount}
        onMarkAsRead={onMarkAsRead}
      />
    </View>
  </View>
);

export default Header;
