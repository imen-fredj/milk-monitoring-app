// services/savedStateService.js
const API_URL = "http://localhost:5000";

// ✅ Create a new saved state
export const createSavedState = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/states`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error creating saved state:", err);
    throw err;
  }
};

// ✅ Get all saved states
export const getAllSavedstates = async () => {
  try {
    const response = await fetch(`${API_URL}/states`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching saved states:", err);
    throw err;
  }
};

// ✅ Get a saved state by ID
export const getSavedStateById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/states/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching saved state by id:", err);
    throw err;
  }
};

// ✅ Delete a saved state
export const deleteSavedState = async (id) => {
  try {
    const response = await fetch(`${API_URL}/states/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle empty response body for successful deletes
    const responseText = await response.text();
    
    if (responseText) {
      const data = JSON.parse(responseText);
      return data;
    } else {
      return { success: true };
    }
  } catch (err) {
    console.error("Error deleting saved state:", err);
    throw err;
  }
};

// ✅ Export saved state as PDF
export const exportSavedStatePdf = async (id) => {
  try {
    const response = await fetch(`${API_URL}/states/pdf/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (err) {
    console.error("Error exporting saved state PDF:", err);
    throw err;
  }
};