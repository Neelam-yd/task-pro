import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Activity from "../models/Activity.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {

    // ✅ FIXED HERE
    const userId = req.user.id;

    const tasks = await Task.find({ userId }).populate("projectId", "name");
    const projects = await Project.find({ userId });

    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const completedTasks = tasks.filter(t =>
      ["done", "completed"].includes((t.status || "").toLowerCase())
    ).length;

    const pendingTasks = tasks.filter(t =>
      ["todo", "to do", "in progress", "pending"].includes(
        (t.status || "").toLowerCase()
      )
    ).length;

    const overdueTasks = tasks.filter(t =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      (t.status || "").toLowerCase() !== "done"
    ).length;

    res.json({
      stats: {
        totalProjects: projects.length,
        tasksCompleted: completedTasks,
        pendingTasks,
        overdueTasks,
      },
      tasks,
      projects,
      activities,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;