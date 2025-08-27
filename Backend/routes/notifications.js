import { Router } from "express";
import Notification from "../models/Notification.js";

const router = Router();

// List stored notifications
router.get("/", async (req, res) => {
  const { limit = 50, containerId } = req.query;
  const q = {};
  if (containerId) q.containerId = containerId;
  const items = await Notification.find(q).sort({ at: -1 }).limit(parseInt(limit));
  res.json({ success: true, data: items });
});

// Server-Sent Events stream
router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  // store broadcaster globally
  global.__SSE_CLIENTS__ ||= new Set();
  global.__SSE_BROADCAST__ = (msg) => {
    for (const s of global.__SSE_CLIENTS__) s(msg);
  };
  global.__SSE_CLIENTS__.add(send);

  // heartbeat to keep connection alive (every 25s)
  const hb = setInterval(() => res.write(": keep-alive\n\n"), 25000);

  req.on("close", () => {
    clearInterval(hb);
    global.__SSE_CLIENTS__.delete(send);
  });
});

export default router;
