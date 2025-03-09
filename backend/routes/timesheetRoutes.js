const express = require("express");
const TimesheetEntry = require("../models/TimesheetEntry");

const router = express.Router();

// ✅ Create a new timesheet entry (User ID from req.user.id)
router.post("/", async (req, res) => {
  try {
    const { project, task, date, startTime, endTime, duration } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newEntry = new TimesheetEntry({
      userId: req.user.id, // ✅ Authenticated User ID
      project,
      task,
      date,
      startTime,
      endTime,
      duration,
    });

    await newEntry.save();
    res.status(201).json({ message: "Timesheet entry added successfully", newEntry });
  } catch (error) {
    console.error("Error adding timesheet entry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all timesheet entries for logged-in user
router.get("/", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const entries = await TimesheetEntry.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching timesheet entries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
