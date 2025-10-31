import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

// Styles
import { sensorStyles } from "../styles/monitoringStyles.js";

// Components
import { SensorGrid } from "../components/monitoring/SensorGrid.js";
import { NetworkStatus } from "../components/monitoring/NetworkStatus.js";
import { ContainerSelector } from "../components/selectors/ContainerSelector";
import { ScheduledSavesSection } from "../components/monitoring/ScheduledSavesSection.js";
import { AddScheduleModal } from "../components/monitoring/AddScheduleModal.js";
import NotificationBell from "../components/monitoring/NotificationBell.js";
import Header from "../components/monitoring/Header.js";
import ErrorDisplay from "../components/monitoring/ErrorDisplay.js";
import NotificationStatus from "../components/monitoring/NotificationStatus.js";
import SaveStateButton from "../components/monitoring/SaveStateButton.js";

// Hooks
import { useSensorData } from "../hooks/monitoring/useSensorData";
import { useScheduledSaves } from "../hooks/monitoring/useScheduledSaves";
import { useAnimations } from "../hooks/useAnimations";
import { useNotifications } from "../hooks/useNotifications";

// Services
import { createSavedState } from "../services/savedStateService";

// Constants
const INITIAL_CONTAINERS = [
  { id: "milk1", name: "Conteneur de lait 1" },
  { id: "milk2", name: "Conteneur de lait 2" },
];

const SensorMonitoringScreen = ({
  setCurrentScreen,
  measurements,
  setMeasurements,
}) => {
  // Container management
  const [containers, setContainers] = useState(INITIAL_CONTAINERS);
  const [activeContainerId, setActiveContainerId] = useState(
    INITIAL_CONTAINERS[0].id
  );
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Hooks
  const sensorData = useSensorData(activeContainerId);
  const scheduledSaves = useScheduledSaves(activeContainerId);
  const animations = useAnimations();
  const notifications = useNotifications(activeContainerId);

  // Filter measurements for active container
  const activeMeasurements = measurements.filter(
    (m) => m.containerId === activeContainerId
  );

  // Handlers
  const handleSaveState = async () => {
    try {
      // Show loading toast
      Toast.show({
        type: "loading",
        text1: "Sauvegarde en cours...",
        text2: "Veuillez patienter pendant la sauvegarde des données",
        autoHide: false,
      });

      const payload = createSaveStatePayload();
      const saved = await createSavedState(payload);

      const activeContainer = containers.find(
        (c) => c.id === activeContainerId
      );

      // Hide loading toast and show success
      Toast.hide();

      Toast.show({
        type: "success",
        text1: "État sauvegardé avec succès !",
        text2: `Instantané créé pour ${activeContainer?.name}`,
        visibilityTime: 3000,
      });

      console.log("État sauvegardé:", saved);
    } catch (err) {
      Toast.hide();

      Toast.show({
        type: "error",
        text1: "Échec de la sauvegarde !",
        text2: "Vérifiez votre connexion et réessayez",
        visibilityTime: 4000,
      });

      console.error("Erreur de sauvegarde:", err);
    }
  };

  // Payload Function
  const createSaveStatePayload = () => {
    const activeContainer = containers.find((c) => c.id === activeContainerId);

    return {
      containerId: activeContainerId,
      containerName: activeContainer?.name,
      stateName: `Instantané ${new Date().toLocaleString()}`,
      description: "Sauvegarde manuelle depuis l'écran de surveillance",
      sensorData: {
        weight: sensorData.sensors.find((s) => s.id === "weight")?.value,
        volume: sensorData.sensors.find((s) => s.id === "volume")?.value,
        temperature: sensorData.sensors.find((s) => s.id === "temperature")
          ?.value,
        pH: sensorData.sensors.find((s) => s.id === "pH")?.value,
        density: sensorData.sensors.find((s) => s.id === "density")?.value,
        status: sensorData.sensors.reduce((acc, s) => {
          acc[s.id] = s.status;
          return acc;
        }, {}),
        timestamp: new Date().toISOString(),
      },
      systemSnapshot: sensorData.systemStatus,
    };
  };

  return (
    <SafeAreaView style={sensorStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <ScrollView
        style={sensorStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <Header
          notifications={notifications.notifications}
          unreadCount={notifications.unreadCount}
          onMarkAsRead={notifications.markAsRead}
          isStreamConnected={notifications.isStreamConnected}
        />

        <NetworkStatus systemStatus={sensorData.systemStatus} />

        <ContainerSelector
          containers={containers}
          activeContainerId={activeContainerId}
          onContainerSelect={setActiveContainerId}
        />

        <SensorGrid sensorData={sensorData} pulseAnim={animations.pulseAnim} />

        <ErrorDisplay error={sensorData.error} onRetry={sensorData.refresh} />

        <NotificationStatus
          notifications={notifications}
          activeContainerId={activeContainerId}
        />

        <SaveStateButton onSave={handleSaveState} />

        <ScheduledSavesSection
          scheduledSaves={scheduledSaves}
          onAddSchedule={() => setShowScheduleModal(true)}
        />

        <AddScheduleModal
          visible={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          containers={containers}
          activeContainerId={activeContainerId}
          onAdd={scheduledSaves.addSchedule}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SensorMonitoringScreen;
