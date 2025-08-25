import cron from "node-cron";
import ScheduledSave from "../models/ScheduledSave.js";
import { saveMeasurementState } from "../controllers/savedStateController.js";

// Run every minute
export const startScheduledSavesCron = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, "0");
    const currentMinute = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${currentHour}:${currentMinute}`;

    const schedules = await ScheduledSave.find({ active: true });

    for (const schedule of schedules) {
      if (schedule.hour === currentTime) {
        console.log(
          `⏰ Running scheduled save for ${schedule.containerName} at ${schedule.hour}`
        );

        const req = {
          body: {
            containerId: schedule.containerId,
            containerName: schedule.containerName,
            stateName: `AutoSave ${new Date().toLocaleString()}`,
            description: schedule.description,
          },
        };

        const res = {
          status: (code) => ({
            json: (data) => console.log("Scheduled Save Result:", code, data),
          }),
        };

        await saveMeasurementState(req, res);

        schedule.lastRun = new Date();
        await schedule.save();
      }
    }
  });
};
