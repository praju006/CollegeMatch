import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import College from "../models/College.js";
import Admin from "../models/Admin.js";
import { adminAuth, requireSuperAdmin, scopeToOwnCollege } from "../middleware/adminAuth.js";

const router = express.Router();

// ── ADMIN SETUP ──────────────────────────────────────────────────
// tells the frontend whether a super admin already exists (locks /admin/setup once true)
router.get("/setup/status", async (req, res) => {
  try {
    const exists = await Admin.exists({ role: "super" });
    res.json({ setupComplete: !!exists });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// one-time creation of the super admin account — refuses once one already exists
router.post("/setup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    if (await Admin.exists({ role: "super" })) {
      return res.status(409).json({ message: "Setup already completed" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username: username.toLowerCase().trim(), password: hashed, role: "super" });

    const token = jwt.sign(
      { username: admin.username, isAdmin: true, role: "super" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.status(201).json({ token, role: "super", message: "Super admin created" });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Username already taken" });
    res.status(400).json({ message: err.message });
  }
});

// ── ADMIN LOGIN ──────────────────────────────────────────────────
// both super admin and college admins are stored (hashed) in the Admin collection
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username?.toLowerCase().trim() });
    if (!admin || !(await bcrypt.compare(password || "", admin.password))) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const payload = { username: admin.username, isAdmin: true, role: admin.role };
    if (admin.role === "college") payload.collegeId = admin.college.toString();

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, role: admin.role, collegeId: payload.collegeId, message: "Admin login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET all colleges (super admin — includes inactive) ───────────
router.get("/colleges", adminAuth, requireSuperAdmin, async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET single college (super, or the college's own admin) ───────
router.get("/colleges/:id", adminAuth, scopeToOwnCollege, async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });
    res.json(college);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── CREATE college (super admin only) ────────────────────────────
router.post("/colleges", adminAuth, requireSuperAdmin, async (req, res) => {
  try {
    const college = new College(req.body);
    await college.save();
    res.status(201).json({ message: "College created successfully", college });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── UPDATE college (super, or the college's own admin) ───────────
router.put("/colleges/:id", adminAuth, scopeToOwnCollege, async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!college) return res.status(404).json({ message: "College not found" });
    res.json({ message: "College updated successfully", college });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE college (super admin only) ─────────────────────────────
router.delete("/colleges/:id", adminAuth, requireSuperAdmin, async (req, res) => {
  try {
    await College.findByIdAndDelete(req.params.id);
    await Admin.deleteMany({ college: req.params.id });
    res.json({ message: "College deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── TOGGLE college active/inactive (super admin only) ─────────────
router.patch("/colleges/:id/toggle", adminAuth, requireSuperAdmin, async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });
    college.isActive = !college.isActive;
    await college.save();
    res.json({ message: `College ${college.isActive ? "activated" : "deactivated"}`, college });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADD course to college (super, or the college's own admin) ─────
router.post("/colleges/:id/courses", adminAuth, scopeToOwnCollege, async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });
    college.courses.push(req.body);
    await college.save();
    res.status(201).json({ message: "Course added", college });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── UPDATE course (super, or the college's own admin) ─────────────
router.put("/colleges/:id/courses/:courseId", adminAuth, scopeToOwnCollege, async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });
    const course = college.courses.id(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    Object.assign(course, req.body);
    await college.save();
    res.json({ message: "Course updated", college });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE course (super, or the college's own admin) ─────────────
router.delete("/colleges/:id/courses/:courseId", adminAuth, scopeToOwnCollege, async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });
    college.courses.pull(req.params.courseId);
    await college.save();
    res.json({ message: "Course deleted", college });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── STATS for dashboard (super admin only) ─────────────────────────
router.get("/stats", adminAuth, requireSuperAdmin, async (req, res) => {
  try {
    const total    = await College.countDocuments();
    const active   = await College.countDocuments({ isActive: true });
    const govt     = await College.countDocuments({ type: "Government" });
    const private_ = await College.countDocuments({ type: "Private" });
    const deemed   = await College.countDocuments({ type: "Deemed" });
    const recent   = await College.find().sort({ createdAt: -1 }).limit(5).select("name city type createdAt");
    res.json({ total, active, inactive: total - active, govt, private: private_, deemed, recent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── COLLEGE ADMIN ACCOUNTS (super admin only) ──────────────────────
// list all college-admin accounts, with their college's name
router.get("/college-admins", adminAuth, requireSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.find({ role: "college" }).populate("college", "name shortName").sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create a login for a college (one admin account per college)
router.post("/college-admins", adminAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { username, password, collegeId } = req.body;
    if (!username || !password || !collegeId) {
      return res.status(400).json({ message: "username, password and collegeId are required" });
    }
    const college = await College.findById(collegeId);
    if (!college) return res.status(404).json({ message: "College not found" });

    const existing = await Admin.findOne({ college: collegeId });
    if (existing) return res.status(409).json({ message: "This college already has an admin account" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username: username.toLowerCase().trim(), password: hashed, role: "college", college: collegeId });
    res.status(201).json({ message: "College admin created", admin: { _id: admin._id, username: admin.username, college: { _id: college._id, name: college.name } } });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Username already taken" });
    res.status(400).json({ message: err.message });
  }
});

// reset a college admin's password
router.put("/college-admins/:id/password", adminAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "New password is required" });
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.findByIdAndUpdate(req.params.id, { password: hashed }, { new: true });
    if (!admin) return res.status(404).json({ message: "Admin account not found" });
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// remove a college admin's login
router.delete("/college-admins/:id", adminAuth, requireSuperAdmin, async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "College admin removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;