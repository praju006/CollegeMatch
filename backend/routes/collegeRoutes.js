import express from "express";
import College from "../models/College.js";

const router = express.Router();

// GET all colleges
router.get("/", async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single college by ID 🔥
router.get("/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });
    res.json(college);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
