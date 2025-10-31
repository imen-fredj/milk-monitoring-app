// hooks/useSavedStates.js
import { useState, useEffect, useCallback } from "react";
import {
  getAllSavedstates,
  deleteSavedState,
  exportSavedStatePdf,
} from "../../services/savedStateService";

export const useSavedStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllSavedstates();
      if (response?.success) {
        setStates(response.data);
      } else {
        setError("Failed to load saved states");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeState = async (id) => {
    try {
      const res = await deleteSavedState(id);

      if (res?.success) {
        setStates((prev) => prev.filter((s) => s._id !== id));
      } else if (res?.success === false) {
        window.alert(`Delete failed: ${res.message || "Unknown error"}`);
      } else {
        // Handle cases where response doesn't have success field
        setStates((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      window.alert(`Error deleting state: ${err.message}`);
    }
  };

  const exportPdf = async (id) => {
    try {
      const blob = await exportSavedStatePdf(id);

      if (blob && blob.size > 0) {
        return blob;
      } else {
        window.alert("Export failed: No PDF data received");
        return null;
      }
    } catch (err) {
      window.alert(`Error exporting PDF: ${err.message}`);
      return null;
    }
  };

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  return {
    states,
    loading,
    error,
    fetchStates,
    removeState,
    exportPdf,
  };
};
