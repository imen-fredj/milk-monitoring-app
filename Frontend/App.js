import React, { useState, useEffect } from "react";
import { View, Animated } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import SensorMonitoringScreen from "./src/screens/SensorMonitoringScreen";
import AnalyticsScreen from "./src/screens/AnalyticsScreen";
import AlertScreen from "./src/screens/AlertScreen";
import SavedStatesScreen from "./src/screens/SavedStatesScreen";
import BottomNavigation from "./src/components/navigation/BottomNavigation";
import { globalStyles } from "./src/styles/globalStyles";
import { getAllMeasurements } from "./src/services/measurementService";
import Toast from "react-native-toast-message";
import toastConfig from "./src/config/toastConfig"; // Import your enhanced config

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [isLoading, setIsLoading] = useState(true);
  const [measurements, setMeasurements] = useState([]); // Start with empty array

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [splashOpacity] = useState(new Animated.Value(1));
  const [logoScale] = useState(new Animated.Value(0.5));
  const [logoRotate] = useState(new Animated.Value(0));
  const [loadingDots] = useState(new Animated.Value(0));

  // Fetch measurements from API
  const fetchMeasurements = async () => {
    try {
      const data = await getAllMeasurements();
      if (data && data.length > 0) {
        setMeasurements(data);
      } else {
        // Fallback to static data if API fails
        setMeasurements([
          {
            id: 1,
            cowId: "COW-001",
            weight: 5.2,
            volume: 4.8,
            temperature: 4.1,
            pH: 6.7,
            quality: "Excellent",
            timestamp: "2025-07-26 08:30:00",
          },
          // ... other static data
        ]);
      }
    } catch (error) {
      console.error("Error fetching measurements:", error);
      // Use static data as fallback
      setMeasurements([
        {
          id: 1,
          cowId: "COW-001",
          weight: 5.2,
          volume: 4.8,
          temperature: 4.1,
          pH: 6.7,
          quality: "Excellent",
          timestamp: "2025-07-26 08:30:00",
        },
      ]);
    }
  };

  useEffect(() => {
    if (currentScreen === "splash") {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(logoRotate, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentScreen("loading");
        setIsLoading(true);

        Animated.loop(
          Animated.timing(loadingDots, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          })
        ).start();

        // Fetch data during loading
        fetchMeasurements();

        setTimeout(() => {
          setIsLoading(false);
          setCurrentScreen("sensors");

          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ]).start();
        }, 3000);
      });
    }
  }, [currentScreen]);

  // Refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentScreen !== "splash" && currentScreen !== "loading") {
        fetchMeasurements();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentScreen]);

  const appProps = {
    currentScreen,
    setCurrentScreen,
    measurements,
    setMeasurements,
    fadeAnim,
    slideAnim,
    splashOpacity,
    logoScale,
    logoRotate,
    loadingDots,
    fetchMeasurements,
  };

  return (
    <View style={globalStyles.app}>
      {currentScreen === "splash" && <SplashScreen {...appProps} />}
      {currentScreen === "loading" && <LoadingScreen {...appProps} />}
      {currentScreen === "sensors" && <SensorMonitoringScreen {...appProps} />}
      {currentScreen === "analytics" && <AnalyticsScreen {...appProps} />}
      {currentScreen === "alerts" && <AlertScreen {...appProps} />}
      {currentScreen === "states" && <SavedStatesScreen {...appProps} />}

      {currentScreen !== "splash" && currentScreen !== "loading" && (
        <BottomNavigation {...appProps} />
      )}
      
      {/* Enhanced Toast with better design */}
      <Toast 
        config={toastConfig} 
        position="top" 
        topOffset={60}
        visibilityTime={4000}
        autoHide={true}
      />
    </View>
  );
};

export default App;