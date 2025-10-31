
const API_BASE_URL = 'http://localhost:5000'; 


class AnalyticsService {
  async getContainerAnalytics(containerId, days = 7) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/${containerId}?days=${days}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching container analytics:', error);
      throw error;
    }
  }

  async getAllContainersAnalytics(days = 7) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/?days=${days}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching all containers analytics:', error);
      throw error;
    }
  }


  // Get trend data for charts
  async getTrendData(containerId, days = 7, interval = 'daily') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/trends/${containerId}/?days=${days}&interval=${interval}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching trend data:', error);
      throw error;
    }
  }

  /**
   * Get quality insights for a container
   * @param {string} containerId - Container ID
   * @param {number} days - Number of days to analyze (default: 7)
   * @returns {Promise} Quality insights
   */
  async getQualityInsights(containerId, days = 7) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/insights/${containerId}/?days=${days}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching quality insights:', error);
      throw error;
    }
  }

  /**
   * Get multiple containers trend data for comparison
   * @param {Array} containerIds - Array of container IDs
   * @param {number} days - Number of days (default: 7)
   * @param {string} interval - 'daily' or 'hourly' (default: 'daily')
   * @returns {Promise} Trend data for multiple containers
   */
  async getMultipleContainersTrends(containerIds, days = 7, interval = 'daily') {
    try {
      const promises = containerIds.map(id => 
        this.getTrendData(id, days, interval)
      );
      
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('Error fetching multiple containers trends:', error);
      throw error;
    }
  }

  /**
   * Get dashboard summary (recent data for multiple containers)
   * @param {Array} containerIds - Array of container IDs
   * @returns {Promise} Dashboard summary data
   */
  async getDashboardSummary(containerIds = []) {
    try {
      // If no specific containers, get all
      if (containerIds.length === 0) {
        return await this.getAllContainersAnalytics(1); // Last 24 hours
      }

      // Get analytics for specific containers
      const promises = containerIds.map(id => 
        this.getContainerAnalytics(id, 1)
      );
      
      const results = await Promise.all(promises);
      return {
        totalContainers: results.length,
        containers: results
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  /**
   * Get comparison data between containers
   * @param {Array} containerIds - Array of container IDs to compare
   * @param {number} days - Number of days to analyze
   * @returns {Promise} Comparison data
   */
  async getContainersComparison(containerIds, days = 7) {
    try {
      const promises = containerIds.map(id => 
        this.getContainerAnalytics(id, days)
      );
      
      const results = await Promise.all(promises);
      
      // Format for easy comparison
      return {
        period: `${days} days`,
        comparison: results.map(result => ({
          containerId: result.containerId,
          containerName: result.containerName,
          weight: result.weight,
          volume: result.volume,
          efficiency: result.efficiency,
          totalMeasurements: result.totalMeasurements
        }))
      };
    } catch (error) {
      console.error('Error fetching containers comparison:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;

// Named exports for individual methods if needed
export const {
  getContainerAnalytics,
  getAllContainersAnalytics,
  getTrendData,
  getQualityInsights,
  getMultipleContainersTrends,
  getDashboardSummary,
  getContainersComparison
} = analyticsService;