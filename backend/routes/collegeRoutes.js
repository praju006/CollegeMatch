import express from "express";
import College from "../models/College.js";

const router = express.Router();

// GET all active colleges
router.get("/", async (req, res) => {
  try {
    const colleges = await College.find({ isActive: true }).sort({ ranking: 1 });
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single active college by ID
router.get("/:id", async (req, res) => {
  try {
    const college = await College.findOne({ _id: req.params.id, isActive: true });
    if (!college) return res.status(404).json({ message: "College not found" });
    res.json(college);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
