// controllers/scheduledSaveController.js
import ScheduledSave from "../models/ScheduledSave.js";

export const setScheduledSave = async (req, res) => {
  try {
    const { containerId, containerName, hour, description } = req.body;

    if (!containerId || !hour || !containerName) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const schedule = new ScheduledSave({
      containerId,
      containerName,
      hour,
      description,
      active: true,
    });

    await schedule.save();

    res.json({ success: true, data: schedule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Disable a schedule - Updated to match your route parameter
export const disableSchedule = async (req, res) => {
  try {
    const { id } = req.params; // Changed from containerId to id to match your route
    const schedule = await ScheduledSave.findByIdAndUpdate(
      id, // Find by document _id
      { active: false },
      { new: true }
    );
    
    if (!schedule) {
      return res.status(404).json({ success: false, error: "Schedule not found" });
    }
    
    res.json({ success: true, data: schedule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all schedules for a user
export const getSchedules = async (req, res) => {
  try {
    const schedules = await ScheduledSave.find();
    res.json({ success: true, data: schedules });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};