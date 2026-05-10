import express from "express";
import Task from "../models/Task.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/* ───────────── CREATE TASK ───────────── */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "todo",
      priority: req.body.priority || "medium",
      dueDate: req.body.dueDate || null,
      projectId: req.body.projectId || null,
      userId, // ✅ FIXED
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────── GET TASKS ───────────── */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({ userId })
      .populate("projectId", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────── UPDATE TASK ───────────── */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────── DELETE TASK ───────────── */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;