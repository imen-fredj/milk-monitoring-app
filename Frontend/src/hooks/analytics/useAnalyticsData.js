// useAnalytics.js - React hooks for analytics data

import { useState, useEffect, useCallback } from "react";
import analyticsService from "../../services/analyticsService";

/**
 * Hook for container analytics data
 * @param {string} containerId - Container ID
 * @param {number} days - Number of days to analyze
 * @returns {Object} { data, loading, error, refetch }
 */
export const useContainerAnalytics = (containerId, days = 7) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!containerId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getContainerAnalytics(
        containerId,
        days
      );
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [containerId, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for all containers analytics
 * @param {number} days - Number of days to analyze
 * @returns {Object} { data, loading, error, refetch }
 */
export const useAllContainersAnalytics = (days = 7) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getAllContainersAnalytics(days);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for trend data (charts)
 * @param {string} containerId - Container ID
 * @param {number} days - Number of days
 * @param {string} interval - 'daily' or 'hourly'
 * @returns {Object} { data, loading, error, refetch }
 */
export const useTrendData = (containerId, days = 7, interval = "daily") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // calls the backend
  const fetchData = useCallback(async () => {
    if (!containerId) return; // If no containerId, do nothing

    try {
      setLoading(true); // mark loading = true (the fetch is still in progress)
      setError(null);

      // call backend controller
      const result = await analyticsService.getTrendData(
        containerId,
        days,
        interval
      );
      setData(result); //Save result into data
    } catch (err) {
      setError(err.message); //If there’s an error, save it in error
    } finally {
      setLoading(false); // Finally, set loading=false (fetch is done)
    }
  }, [containerId, days, interval]);

  // When the component using this hook mounts or when containerId, days, or interval changes → run fetchData automatically
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for quality insights
 * @param {string} containerId - Container ID
 * @param {number} days - Number of days to analyze
 * @returns {Object} { data, loading, error, refetch }
 */
export const useQualityInsights = (containerId, days = 7) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!containerId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getQualityInsights(
        containerId,
        days
      );
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [containerId, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for dashboard summary
 * @param {Array} containerIds - Array of container IDs (optional)
 * @param {number} refreshInterval - Auto refresh interval in ms (optional)
 * @returns {Object} { data, loading, error, refetch }
 */
export const useDashboardSummary = (
  containerIds = [],
  refreshInterval = null
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getDashboardSummary(containerIds);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [containerIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh if interval is provided
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for containers comparison
 * @param {Array} containerIds - Array of container IDs to compare
 * @param {number} days - Number of days to analyze
 * @returns {Object} { data, loading, error, refetch }
 */
export const useContainersComparison = (containerIds, days = 7) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!containerIds || containerIds.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getContainersComparison(
        containerIds,
        days
      );
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [containerIds, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for time period management
 * @param {number} defaultDays - Default number of days
 * @returns {Object} { days, setDays, presets }
 */
export const useTimePeriod = (defaultDays = 7) => {
  const [days, setDays] = useState(defaultDays);

  const presets = [
    { label: "24 Heures", value: 1 },
    { label: "7 Jours", value: 7 },
    { label: "30 Jours", value: 30 },
  ];

  return { days, setDays, presets };
};
