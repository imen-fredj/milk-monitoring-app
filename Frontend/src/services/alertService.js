// services/alertService.js
const API_URL = "http://localhost:5000";

// Helper function to handle API responses
const handleResponse = async (response, operation) => {
  console.log(`${operation} response status:`, response.status);
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (parseError) {
      console.warn('Could not parse error response:', parseError);
    }
    
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  console.log(`${operation} result:`, data);
  
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.error || `Failed to ${operation.toLowerCase()}`);
  }
};

export const createAlert = async (alertData) => {
  try {
    console.log('Creating alert:', alertData);
    
    // Validate data before sending
    if (!alertData.name || !alertData.name.trim()) {
      throw new Error('Alert name is required');
    }
    
    if (!alertData.metric) {
      throw new Error('Metric is required');
    }
    
    if (!alertData.operator) {
      throw new Error('Operator is required');
    }
    
    if (alertData.threshold === undefined || alertData.threshold === null || isNaN(Number(alertData.threshold))) {
      throw new Error('Valid threshold is required');
    }

    // Prepare the payload
    const payload = {
      name: alertData.name.trim(),
      metric: alertData.metric,
      operator: alertData.operator,
      threshold: Number(alertData.threshold)
    };

    // Add containerId if provided and not empty
    if (alertData.containerId && alertData.containerId.trim()) {
      payload.containerId = alertData.containerId.trim();
    }
    
    console.log('Sending payload:', payload);
    
    const response = await fetch(`${API_URL}/alerts`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    return await handleResponse(response, 'Create alert');
    
  } catch (err) {
    console.error("Error creating alert:", err);
    throw err;
  }
};

export const listAlerts = async (params = {}) => {
  try {
    // Clean up params - remove undefined/null values
    const cleanParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanParams[key] = value;
      }
    });
    
    const queryString = new URLSearchParams(cleanParams).toString();
    const url = queryString ? `${API_URL}/alerts?${queryString}` : `${API_URL}/alerts`;
    
    console.log('Fetching alerts from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    return await handleResponse(response, 'List alerts');
    
  } catch (err) {
    console.error("Error fetching alerts:", err);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

export const getAlert = async (id) => {
  try {
    if (!id) {
      throw new Error('Alert ID is required');
    }
    
    console.log('Fetching alert:', id);
    
    const response = await fetch(`${API_URL}/alerts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    return await handleResponse(response, 'Get alert');
    
  } catch (err) {
    console.error("Error fetching alert:", err);
    throw err;
  }
};

export const updateAlert = async (id, alertData) => {
  try {
    if (!id) {
      throw new Error('Alert ID is required');
    }
    
    console.log('Updating alert:', id, alertData);
    
    // Validate data before sending
    if (alertData.name !== undefined && (!alertData.name || !alertData.name.trim())) {
      throw new Error('Alert name cannot be empty');
    }
    
    if (alertData.threshold !== undefined && isNaN(Number(alertData.threshold))) {
      throw new Error('Threshold must be a valid number');
    }

    // Prepare the payload
    const payload = { ...alertData };
    
    if (payload.name) {
      payload.name = payload.name.trim();
    }
    
    if (payload.threshold !== undefined) {
      payload.threshold = Number(payload.threshold);
    }
    
    if (payload.containerId !== undefined) {
      payload.containerId = payload.containerId.trim();
    }
    
    console.log('Sending update payload:', payload);
    
    const response = await fetch(`${API_URL}/alerts/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    return await handleResponse(response, 'Update alert');
    
  } catch (err) {
    console.error("Error updating alert:", err);
    throw err;
  }
};

export const deleteAlert = async (id) => {
  try {
    if (!id) {
      throw new Error('Alert ID is required');
    }
    
    console.log('Deleting alert:', id);
    
    const response = await fetch(`${API_URL}/alerts/${id}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    
    return await handleResponse(response, 'Delete alert');
    
  } catch (err) {
    console.error("Error deleting alert:", err);
    throw err;
  }
};

export const toggleAlert = async (id) => {
  try {
    if (!id) {
      throw new Error('Alert ID is required');
    }
    
    console.log('Toggling alert:', id);
    
    const response = await fetch(`${API_URL}/alerts/toggle/${id}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    
    return await handleResponse(response, 'Toggle alert');
    
  } catch (err) {
    console.error("Error toggling alert:", err);
    throw err;
  }
};