// For Expo web (running in browser)
const API_URL = "http://localhost:5000";

export const getLatestMeasurement = async (containerId) => {
  try {
    const response = await fetch(`${API_URL}/measurements/latest?containerId=${containerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Latest measurement data:', data);
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || "Failed to fetch latest measurement");
    }
  } catch (err) {
    console.error("Error fetching latest measurement:", err);
    return null;
  }
};

export const getAllMeasurements = async () => {
  try {
    console.log('Fetching all measurements from:', `${API_URL}/measurements`);
    const response = await fetch(`${API_URL}/measurements`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('All measurements data:', data);
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || "Failed to fetch measurements");
    }
  } catch (err) {
    console.error("Error fetching measurements:", err);
    return [];
  }
};

// EXISTING: Global system status
export const getSystemStatus = async () => {
  try {
    console.log('Fetching system status from:', `${API_URL}/measurements/system-status`);
    const response = await fetch(`${API_URL}/measurements/system-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('System status response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('System status data:', data);
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || "Failed to fetch system status");
    }
  } catch (err) {
    console.error("Error fetching system status:", err);
    return null;
  }
};

// NEW: Container-specific system status
export const getContainerSystemStatus = async (containerId) => {
  try {
    console.log('Fetching container system status from:', `${API_URL}/measurements/containers/${containerId}/status`);
    const response = await fetch(`${API_URL}/measurements/containers/${containerId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('Container system status response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Container system status data:', data);
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || "Failed to fetch container system status");
    }
  } catch (err) {
    console.error("Error fetching container system status:", err);
    return null;
  }
};
