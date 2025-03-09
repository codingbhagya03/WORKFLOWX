const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Get All Tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// Create New Task
router.post("/", async (req, res) => {
  try {
    console.log(req.body,"reqqqqqqq");
    
    const newTask = new Task(req.body);
    console.log('newTask',newTask);
    
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error,'error');
    
    res.status(500).json({ error: "Error saving task" });
  }
});

// Update Task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
});

// Delete Task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;