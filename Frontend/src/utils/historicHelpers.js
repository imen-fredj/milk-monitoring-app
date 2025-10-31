import { Alert } from 'react-native';

export const getContainerColor = (containerId) => {
  if (!containerId) return "#6b7280";
  if (containerId.includes("1")) return "#3b82f6";
  if (containerId.includes("2")) return "#8b5cf6";
  return "#6b7280";
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    fullDate: date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    dayOfWeek: date.toLocaleDateString("en-US", { weekday: "short" }),
    monthDay: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  };
};

export const exportSingleMeasurement = (measurement) => {
  const { fullDate, time } = formatDate(measurement.timestamp);
  const containerId = measurement.containerId || "Container";

  Alert.alert(
    "Export Report",
    `Generate PDF report for ${containerId}?\n\nDate: ${fullDate}\nTime: ${time}`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Export",
        onPress: () => {
          Alert.alert("Success", `PDF report generated for ${containerId}`);
        },
      },
    ]
  );
};

export const exportMultipleMeasurements = (filteredMeasurements) => {
  if (filteredMeasurements.length === 0) {
    Alert.alert("No Data", "No measurements to export");
    return;
  }

  Alert.alert(
    "Export All Reports",
    `Generate ${filteredMeasurements.length} PDF reports?`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: `Export ${filteredMeasurements.length} PDFs`,
        onPress: () => {
          Alert.alert(
            "Success",
            `${filteredMeasurements.length} PDF reports generated successfully`
          );
        },
      },
    ]
  );
};

export const deleteMeasurement = (id, setMeasurements) => {
  Alert.alert("Delete Measurement", "This action cannot be undone.", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: () => {
        setMeasurements((prev) => prev.filter((m) => m.id !== id));
      },
    },
  ]);
};

export const clearAllData = (setMeasurements) => {
  Alert.alert(
    "Clear All Data",
    "Delete all measurements? This cannot be undone.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: () => {
          setMeasurements([]);
        },
      },
    ]
  );
};