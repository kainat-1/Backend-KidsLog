import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { kidName, age, email, password } = req.body;

  if (!kidName || !age || !email || !password) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({ kidName, age, email, password });
    await user.save(); // triggers password hashing

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

 
    res.json({
      token,
      user: {
        id: user._id,
        kidName: user.kidName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current user
router.get("/users/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

// Update user profile
router.put("/users/me", authMiddleware, async (req, res) => {
  try {
    const updates = {
      kidName: req.body.kidName,
      age: req.body.age,
      photo: req.body.photo,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
