const express = require("express");
const auth = require("../middleware/auth");
const Activity = require("../models/Activity").default;
const Kid = require("../models/kid");

const router = express.Router();

router.use(auth); // Protect all routes below

// Create Activity
router.post("/", async (req, res) => {
  const { title, description, date, kid } = req.body;
  if (!title || !kid)
    return res.status(400).json({ message: "Title and kid ID required" });

  try {
    // Check if kid belongs to user
    const foundKid = await Kid.findOne({ _id: kid, user: req.user._id });
    if (!foundKid) return res.status(400).json({ message: "Invalid kid" });

    const activity = new Activity({ title, description, date, kid });
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all activities for logged-in user's kids
router.get("/", async (req, res) => {
  try {
    const kids = await Kid.find({ user: req.user._id }).select("_id");
    const kidIds = kids.map((k) => k._id);

    const activities = await Activity.find({ kid: { $in: kidIds } });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get one activity by id
router.get("/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate("kid");
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    if (String(activity.kid.user) !== String(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Activity
router.put("/:id", async (req, res) => {
  const { title, description, date } = req.body;
  try {
    const activity = await Activity.findById(req.params.id).populate("kid");
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    if (String(activity.kid.user) !== String(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });

    activity.title = title || activity.title;
    activity.description = description || activity.description;
    activity.date = date || activity.date;

    await activity.save();
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Activity
router.delete("/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate("kid");
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    if (String(activity.kid.user) !== String(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });

    await activity.remove();
    res.json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
