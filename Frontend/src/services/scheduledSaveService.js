// services/scheduledSaveService.js
const API_URL = "http://localhost:5000/scheduled"; // Match your app.js route mounting

export const fetchSchedules = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch schedules");
  const data = await res.json();
  return data.data;
};

export const createSchedule = async (payload) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create schedule");
  const data = await res.json();
  return data.data;
};

export const disableSchedule = async (id) => { // Use id to match your route
  const res = await fetch(`${API_URL}/disable/${id}`, { // Match your route pattern
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to disable schedule");
  const data = await res.json();
  return data.data;
};