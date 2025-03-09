const express = require("express");
const Member = require("../models/Member");
const router = express.Router();

// GET all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching members" });
  }
});

// GET a specific member by ID
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching member" });
  }
});

// POST a new member
router.post("/", async (req, res) => {
  try {
    const { name, email, role, timeToday, timeThisWeek } = req.body;
    const newMember = new Member({
      name,
      email,
      role,
      // projects,
      timeToday,
      timeThisWeek,
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating member" });
  }
});

// PUT (update) an existing member
router.put("/:id", async (req, res) => {
  try {
    const { name, email, role, timeToday, timeThisWeek } = req.body;
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true } // Return the updated member
    );
    
    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    res.status(200).json(updatedMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating member" });
  }
});

// DELETE a member
router.delete("/:id", async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting member" });
  }
});

module.exports = router;
