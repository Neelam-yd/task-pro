import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },

  status: {
    type: String,
    enum: ["todo", "in-progress", "completed", "pending"],
    default: "todo"
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },

  dueDate: { type: Date },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);