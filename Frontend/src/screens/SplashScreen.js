import React from 'react';
import { View, Text, StatusBar, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { globalStyles } from '../styles/globalStyles';

const SplashScreen = ({ splashOpacity, logoScale, logoRotate }) => {
  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[globalStyles.splashContainer, { opacity: splashOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
      <Animated.View 
        style={[
          globalStyles.logoContainer,
          {
            transform: [
              { scale: logoScale },
              { rotate: rotateInterpolate }
            ]
          }
        ]}
      >
        <View style={globalStyles.logo}>
          <Icon name="opacity" size={60} color="#ffffff" />
        </View>
      </Animated.View>
      <Text style={globalStyles.splashTitle}>MilkQuality Pro</Text>
      <Text style={globalStyles.splashSubtitle}>Gestion intelligente de la laiterie</Text>
    </Animated.View>
  );
};

export default SplashScreen;
