const mongoose = require("mongoose");

const TimesheetEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  project: { type: String, required: true },
  task: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  duration: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("TimesheetEntry", TimesheetEntrySchema);
