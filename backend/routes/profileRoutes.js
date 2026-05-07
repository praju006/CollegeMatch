import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

// ── GET profile ──────────────────────────────────────────────────
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password -resetPasswordToken -resetPasswordExpires");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── SAVE college ─────────────────────────────────────────────────
router.post("/save", async (req, res) => {
  try {
    const { userId, collegeName } = req.body;
    if (!userId || !collegeName) return res.status(400).json({ message: "userId and collegeName required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // avoid duplicates
    if (!user.savedColleges.includes(collegeName)) {
      user.savedColleges.push(collegeName);
      await user.save();
    }

    res.json({ message: "College saved", savedColleges: user.savedColleges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── UNSAVE college ───────────────────────────────────────────────
router.post("/unsave", async (req, res) => {
  try {
    const { userId, collegeName } = req.body;
    if (!userId || !collegeName) return res.status(400).json({ message: "userId and collegeName required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedColleges = user.savedColleges.filter(name => name !== collegeName);
    await user.save();

    res.json({ message: "College removed", savedColleges: user.savedColleges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── SAVE preferences ─────────────────────────────────────────────
router.post("/preferences", async (req, res) => {
  try {
    const { userId, preferredCity, preferredCourse, budgetRange } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const user = await User.findByIdAndUpdate(
      userId,
      { preferredCity, preferredCourse, budgetRange },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;