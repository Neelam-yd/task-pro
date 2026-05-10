import express from "express";
import Project from "../models/Project.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

/* ── CREATE PROJECT (Admin only) ── */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status || "active",
      progress: req.body.progress || 0,
      dueDate: req.body.dueDate || null,
      members: req.body.members || [],
      userId: req.user.id,
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET ALL PROJECTS (Admin sees all, Member sees own) ── */
router.get("/", authMiddleware, async (req, res) => {
  try {
    let projects;
    if (req.user.role === "admin") {
      projects = await Project.find().sort({ createdAt: -1 }); // admin sees all
    } else {
      projects = await Project.find({ members: req.user.id }).sort({ createdAt: -1 }); // member sees assigned
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET SINGLE PROJECT ── */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── UPDATE PROJECT (Admin only) ── */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── DELETE PROJECT (Admin only) ── */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;