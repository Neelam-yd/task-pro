import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes      from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import projectRoutes   from "./routes/project.js";
import taskRoutes      from "./routes/task.js";

dotenv.config();

const app = express();

// ── Middlewares ────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// ── Connect Database ───────────────────────────────────
connectDB();

// ── Routes ─────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects",  projectRoutes);
app.use("/api/tasks",     taskRoutes);
app.get("/api/debug/tasks", async (req, res) => {
  const Task = (await import("./models/Task.js")).default;
  const tasks = await Task.find();
  res.json(tasks);
});
app.get("/", (req, res) => {
  res.send("TaskPro Backend is running 🚀");
});

// ── Start Server ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});