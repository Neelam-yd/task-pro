import express from "express";
import Project from "../models/Project.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/* ───────────── CREATE PROJECT ───────────── */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status || "active",
      progress: req.body.progress || 0,
      dueDate: req.body.dueDate || null,
      members: req.body.members || [],
      userId, // ✅ FIXED
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────── GET ALL PROJECTS ───────────── */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({ userId }).sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────── GET SINGLE PROJECT ───────────── */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────── UPDATE PROJECT ───────────── */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────── DELETE PROJECT ───────────── */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;