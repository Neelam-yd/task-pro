import express from "express";
import Task from "../models/Task.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

/* ── CREATE TASK (Admin only) ── */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "todo",
      priority: req.body.priority || "medium",
      dueDate: req.body.dueDate || null,
      projectId: req.body.projectId || null,
      assignedTo: req.body.assignedTo || null, // ✅ assign to member
      userId: req.user.id,
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET TASKS (Admin sees all, Member sees assigned) ── */
router.get("/", authMiddleware, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find().populate("projectId", "name").sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate("projectId", "name")
        .sort({ createdAt: -1 });
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── UPDATE TASK (Admin full update, Member only status) ── */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    let updateData = req.body;

    // member can only update status
    if (req.user.role === "member") {
      updateData = { status: req.body.status };
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id, updateData, { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── DELETE TASK (Admin only) ── */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;