const express = require("express");
const Member = require("../models/Member");

const router = express.Router();

// Get all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().populate("projects");
    console.log('members',members);
    
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// Add a new member
router.post("/", async (req, res) => {
  try {
    const { name, avatar,role, projects, timeToday, timeThisWeek } = req.body;
    const newMember = new Member({ name,avatar, role, projects, timeToday, timeThisWeek });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: "Failed to add member" });
  }
});

module.exports = router;
