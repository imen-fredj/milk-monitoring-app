// hooks/useAlerts.js
import { useState, useEffect, useCallback } from "react";
import {
  listAlerts,
  createAlert as createAlertAPI,
  updateAlert as updateAlertAPI,
  deleteAlert as deleteAlertAPI,
  toggleAlert as toggleAlertAPI,
} from "../../services/alertService";

export const useAlerts = (filters = {}) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Créer une dépendance stable pour les filtres
  const filtersString = JSON.stringify(filters);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Nettoyer les filtres undefined
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );

      const alertsData = await listAlerts(cleanFilters);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError(err.message);
      setAlerts([]); // Assurer qu'on a toujours un tableau
    } finally {
      setLoading(false);
    }
  }, [filtersString]);

  const createAlert = useCallback(async (alertData) => {
    try {
      setError(null);

      // Validation des données avant envoi
      if (!alertData.name || !alertData.name.trim()) {
        throw new Error("Alert name is required");
      }
      if (!alertData.threshold || isNaN(alertData.threshold)) {
        throw new Error("Valid threshold is required");
      }

      const newAlert = await createAlertAPI(alertData);
      setAlerts((prev) => [newAlert, ...prev]);
      return newAlert;
    } catch (err) {
      console.error("Error creating alert:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  const updateAlert = useCallback(async (id, alertData) => {
    try {
      setError(null);

      if (!id) {
        throw new Error("Alert ID is required");
      }

      // Validation des données avant envoi
      if (!alertData.name || !alertData.name.trim()) {
        throw new Error("Alert name is required");
      }
      if (!alertData.threshold || isNaN(alertData.threshold)) {
        throw new Error("Valid threshold is required");
      }

      const updatedAlert = await updateAlertAPI(id, alertData);
      setAlerts((prev) =>
        prev.map((alert) => (alert._id === id ? updatedAlert : alert))
      );
      return updatedAlert;
    } catch (err) {
      console.error("Error updating alert:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteAlert = useCallback(async (id) => {
    console.log("🪝 useAlerts deleteAlert called with ID:", id);

    try {
      setError(null);

      if (!id) {
        throw new Error("Alert ID is required");
      }

      console.log("📞 Calling deleteAlertAPI service...");
      const result = await deleteAlertAPI(id);
      console.log("✅ deleteAlertAPI returned:", result);

      // Update the local state immediately
      console.log("🔄 Updating local alerts state...");
      setAlerts((prev) => {
        const filtered = prev.filter((alert) => alert._id !== id);
        console.log("📊 Alerts before filter:", prev.length);
        console.log("📊 Alerts after filter:", filtered.length);
        return filtered;
      });

      console.log("✅ Local state updated successfully");
      return result;
    } catch (err) {
      console.error("💥 Error in useAlerts deleteAlert:", err);
      console.error("💥 Error stack:", err.stack);
      setError(err.message);
      throw err;
    }
  }, []);

  const toggleAlert = useCallback(async (id) => {
    try {
      setError(null);

      if (!id) {
        throw new Error("Alert ID is required");
      }

      const updatedAlert = await toggleAlertAPI(id);
      setAlerts((prev) =>
        prev.map((alert) => (alert._id === id ? updatedAlert : alert))
      );
      return updatedAlert;
    } catch (err) {
      console.error("Error toggling alert:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    loading,
    error,
    refreshAlerts: fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
  };
};
