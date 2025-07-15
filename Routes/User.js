// routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import protect from "../middleware/authMiddleware.js"; // middleware for protected routes

const router = express.Router();

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private (user must be logged in)
router.put(
  "/change-password",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id; // user from token middleware
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check current password is correct
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    // Update to new password and save
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  })
);

export default router;
