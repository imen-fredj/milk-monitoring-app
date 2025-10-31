import React, { useState, useEffect } from "react";
import { View, Text, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { sensorStyles } from "../../styles/monitoringStyles";

export const SensorCard = ({ title, data={}, icon, color, index, pulseAnim }) => {
  const [cardFadeAnim] = useState(new Animated.Value(0));
  const [cardSlideAnim] = useState(new Animated.Value(50));
  const [cardScaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.spring(cardSlideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.spring(cardScaleAnim, {
        toValue: 0.98,
        tension: 60,
        friction: 8,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isRecentlyUpdated =
    data.lastUpdate && new Date() - data.lastUpdate < 5000;

  return (
    <Animated.View
      style={[
        sensorStyles.sensorCard,
        data.active
          ? [sensorStyles.sensorCardActive, { borderColor: color }]
          : sensorStyles.sensorCardInactive,
        {
          opacity: cardFadeAnim,
          transform: [
            { translateY: cardSlideAnim },
            { scale: cardScaleAnim },
            ...(data.active ? [{ scale: pulseAnim }] : []),
          ],
        },
      ]}
    >
      <View
        style={[
          sensorStyles.sensorCardBackground,
          { backgroundColor: color + "10" },
        ]}
      />

      <View style={sensorStyles.sensorCardHeader}>
        <View
          style={[
            sensorStyles.sensorIconContainer,
            { backgroundColor: color + "15" },
          ]}
        >
          <Icon name={icon} size={24} color={color} />
        </View>
        <View style={sensorStyles.sensorCardTitleContainer}>
          <Text style={sensorStyles.sensorCardTitle}>{title}</Text>
          <View style={sensorStyles.sensorStatusContainer}>
            <View
              style={[
                sensorStyles.sensorStatusDot,
                data.active
                  ? sensorStyles.sensorStatusDotActive
                  : sensorStyles.sensorStatusDotInactive,
              ]}
            />
            <Text
              style={[
                sensorStyles.sensorStatusText,
                data.active
                  ? sensorStyles.sensorStatusTextActive
                  : sensorStyles.sensorStatusTextInactive,
              ]}
            >
              {data.active ? "Connecté" : "Non connecté"}
            </Text>
          </View>
        </View>
      </View>

      <View style={sensorStyles.sensorValueContainer}>
        <Text
          style={[
            sensorStyles.sensorValue,
            {
              color:
                data.active && isRecentlyUpdated
                  ? color
                  : sensorStyles.colors.textPrimary,
            },
          ]}
        >
          {data.value}
        </Text>
        <Text style={sensorStyles.sensorUnit}>{data.unit}</Text>
      </View>

      {data.lastUpdate && (
        <View style={sensorStyles.sensorUpdateContainer}>
          <Text style={sensorStyles.sensorUpdateText}>
            Mis à jour : {new Date(data.lastUpdate).toLocaleTimeString()}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};