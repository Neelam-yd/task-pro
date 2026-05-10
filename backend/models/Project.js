import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  role:    { type: String, default: "Member" },
  initial: { type: String },   // e.g. "A" for Aman
  color:   { type: String },   // e.g. "bg-green-500"
});

const projectSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },

  status: {
    type: String,
    enum: ["active", "completed", "on-hold"],
    default: "active"
  },

  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  dueDate: { type: Date },

  members: [memberSchema],   // 4 members per project

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);