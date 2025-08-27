import Alert from "../models/Alert.js";


export const createAlert = async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json({ success: true, data: alert });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

export const listAlerts = async (req, res) => {
  try {
    const { containerId, status } = req.query;
    const q = {};
    if (containerId) q.containerId = containerId;
    if (status) q.status = status;
    const alerts = await Alert.find(q).sort({ updatedAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

export const getAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, data: alert });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

export const updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alert) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, data: alert });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

export const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, data: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

export const toggleAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, error: "Not found" });
    alert.status = alert.status === "active" ? "paused" : "active";
    await alert.save();
    res.json({ success: true, data: alert });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};
