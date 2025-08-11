import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import measurements from "./routes/measurements.js";

// Get current filename and directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MAIN URLs
app.use("/measurements", measurements);

mongoose
  .connect("mongodb://localhost/laitDB")
  .then(() => {
    console.log("Connected to database laitDB");
  })
  .catch((err) => {
    console.error("Won't connect to database laitDB", err);
  });

export default app;