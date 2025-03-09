const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projects: { type: String, required: true },
  status: { type: String, default: "Pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  startDate: { type: String },
  dueDate: { type: String },
  assignedUser: { type: String },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);