import Toast from "react-native-toast-message";

export const formatLastTriggered = (date) => {
  if (!date) return "Jamais";
  try {
    return new Date(date).toLocaleDateString("fr-FR");
  } catch {
    return "Date invalide";
  }
};

export const showAlertMessage = (type, text) => {
  Toast.show({
    type,
    text1: text,
  });
};

export const filterAlerts = (alerts, filters) => {
  if (!Array.isArray(alerts)) return [];

  return alerts.filter((alert) => {
    if (filters.status && alert.status !== filters.status) return false;
    if (filters.metric && alert.metric !== filters.metric) return false;
    return true;
  });
};