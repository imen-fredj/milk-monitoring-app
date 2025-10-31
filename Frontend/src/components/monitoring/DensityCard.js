import React, { useState, useEffect } from "react";
import { View, Text, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { sensorStyles } from "../../styles/monitoringStyles";

export const DensityCard = ({ title, data={}, icon, color, pulseAnim }) => {
  const [cardFadeAnim] = useState(new Animated.Value(0));
  const [cardSlideAnim] = useState(new Animated.Value(50));
  const [cardScaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 0, // No delay for density card as it's most important
        useNativeDriver: true,
      }),
      Animated.spring(cardSlideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        delay: 0,
        useNativeDriver: true,
      }),
      Animated.spring(cardScaleAnim, {
        toValue: 0.98,
        tension: 60,
        friction: 8,
        delay: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isRecentlyUpdated =
    data.lastUpdate && new Date() - data.lastUpdate < 5000;

  return (
    <Animated.View
      style={[
        sensorStyles.densityCard,
        data.active
          ? [sensorStyles.densityCardActive, { borderColor: color }]
          : sensorStyles.densityCardInactive,
        {
          opacity: cardFadeAnim,
          transform: [
            { translateY: cardSlideAnim },
            { scale: cardScaleAnim },
            [{ scale: pulseAnim }],
          ],
        },
      ]}
    >
      <View
        style={[
          sensorStyles.densityCardBackground,
          { backgroundColor: color + "10" },
        ]}
      />

      <View style={sensorStyles.densityCardContent}>
        {/* Left side - Icon, Title, and Status */}
        <View style={sensorStyles.densityCardLeft}>
          <View
            style={[
              sensorStyles.densityIconContainer,
              { backgroundColor: color + "15" },
            ]}
          >
            <Icon name={icon} size={32} color={color} />
          </View>
          
          <View style={sensorStyles.densityCardInfo}>
            <Text style={sensorStyles.densityCardTitle}>{title}</Text>
            {data.lastUpdate && (
              <Text style={sensorStyles.densityUpdateText}>
                Mis à jour : {new Date(data.lastUpdate).toLocaleTimeString()}
              </Text>
            )}
          </View>
        </View>

        {/* Right side - Value and Unit */}
        <View style={sensorStyles.densityCardRight}>
          <Text
            style={[
              sensorStyles.densityValue,
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
          <Text style={sensorStyles.densityUnit}>{data.unit}</Text>
        </View>
      </View>
    </Animated.View>
  );
};