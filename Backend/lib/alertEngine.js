import Alert from "../models/Alert.js";
import Notification from "../models/Notification.js";
import axios from "axios";

const cmp = (value, operator, threshold) => {
  switch (operator) {
    case ">":  return value > threshold;
    case ">=": return value >= threshold;
    case "<":  return value < threshold;
    case "<=": return value <= threshold;
    default:   return false;
  }
};

// Check that the violation has held continuously for durationSec
// Simple approach: ensure there is NO counter-example measurement within window.
export const violationHeldForDuration = async ({ Measurement }, alert, measurement) => {
  const durationMs = (alert.durationSec || 0) * 1000;
  if (durationMs === 0) return true;

  const since = new Date(measurement.timestamp.getTime() - durationMs);

  const q = {
    timestamp: { $gte: since, $lte: measurement.timestamp },
  };
  if (alert.containerId) q.containerId = alert.containerId;

  // any measurement in window that breaks the condition?
  const breaker = await Measurement.findOne(q).sort({ timestamp: -1 }).lean();
  if (!breaker) return false; // no data in window → treat as not held (you can flip to true if you prefer)
  const ok = cmp(breaker[alert.metric], alert.operator, alert.threshold);
  return ok; // last sample inside window also violates → assume continuous
};

const withinCooldown = (alert) => {
  if (!alert.lastTriggeredAt) return false;
  const coolMs = (alert.cooldownSec || 0) * 1000;
  return Date.now() - new Date(alert.lastTriggeredAt).getTime() < coolMs;
};

const buildMessage = (alert, measurement) =>
  `ALERT ${alert.name}: ${alert.metric} ${alert.operator} ${alert.threshold} ` +
  `(value=${measurement[alert.metric]} at ${measurement.timestamp.toISOString()})`;

/**
 * Evaluate active alerts against a just-saved measurement.
 * - pass Measurement model to avoid circular imports
 */
export const evaluateAlertsForMeasurement = async ({ Measurement }, measurement) => {
  // Fetch active alerts that target this metric and (optionally) this container
  const q = { status: "active", metric: { $in: Object.keys(measurement.toObject()) } };
  const candidates = await Alert.find({
    status: "active",
    $and: [
      { $or: [{ containerId: measurement.containerId }, { containerId: { $exists: false } }, { containerId: null }] },
      { metric: { $in: ["temperature", "pH", "weight", "volume", "qualityScore"] } }
    ]
  }).lean();

  const triggered = [];
  for (const alert of candidates) {
    const value = measurement[alert.metric];
    if (typeof value !== "number") continue;
    if (!cmp(value, alert.operator, alert.threshold)) continue;

    // Respect duration and cooldown
    const held = await violationHeldForDuration({ Measurement }, alert, measurement);
    if (!held) continue;
    if (withinCooldown(alert)) continue;

    const message = buildMessage(alert, measurement);

    // Persist notification
    const notif = await Notification.create({
      alertId: alert._id,
      containerId: measurement.containerId,
      metric: alert.metric,
      value,
      operator: alert.operator,
      threshold: alert.threshold,
      message
    });

    // Update alert's lastTriggeredAt
    await Alert.updateOne({ _id: alert._id }, { $set: { lastTriggeredAt: new Date() } });

    // Fan out to channels
    if (alert.channels?.includes("webhook") && alert.webhookUrl) {
      // Best-effort; don't block on errors
      axios.post(alert.webhookUrl, {
        alertId: alert._id,
        message,
        measurementId: measurement._id,
        containerId: measurement.containerId,
        at: notif.at
      }).catch(() => {});
    }

    // Push to SSE clients (if you enable SSE below)
    global.__SSE_BROADCAST__?.({
      type: "alert",
      alertId: String(alert._id),
      containerId: measurement.containerId,
      message,
      at: new Date().toISOString()
    });

    triggered.push({ alertId: alert._id, message });
  }

  return triggered;
};
