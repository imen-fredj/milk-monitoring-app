// hooks/useScheduledSaves.js
import { useState, useEffect, useCallback } from "react";
import {
  fetchSchedules,
  createSchedule,
  disableSchedule,
} from "../../services/scheduledSaveService";

export const useScheduledSaves = (activeContainerId) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSchedules();
      setSchedules(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSchedule = async (payload) => {
    try {
      const newSchedule = await createSchedule(payload);
      setSchedules((prev) => [...prev, newSchedule]);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const removeSchedule = async (id) => {
    // Use the document _id
    try {
      await disableSchedule(id);
      setSchedules(
        (prev) => prev.map((s) => (s._id === id ? { ...s, active: false } : s)) // Use _id to match the document
      );
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Filter schedules for the active container
  const filteredSchedules = schedules.filter(
    (s) => s.containerId === activeContainerId && s.active
  );

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  return {
    schedules: filteredSchedules,
    allSchedules: schedules, // In case you need all schedules
    loading,
    error,
    addSchedule,
    removeSchedule,
    refresh: loadSchedules,
  };
};
