import express from "express";
import Activity from "../models/Activity.js";

const router = express.Router();

// Create a new activity (POST /api/activities)
router.post("/", async (req, res) => {
  try {
    const activity = new Activity(req.body);
    const savedActivity = await activity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error("Error adding activity:", error);
    res.status(500).json({ error: "Server error adding activity" });
  }
});

// Get all activities (GET /api/activities)
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Server error fetching activities" });
  }
});

// Delete an activity (DELETE /api/activities/:id)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Activity.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.json({ message: "Activity deleted" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ error: "Server error deleting activity" });
  }
});

export default router;
