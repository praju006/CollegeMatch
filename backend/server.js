import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes    from "./routes/auth.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes   from "./routes/adminRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:8080",
    "https://collegematch.zestsketchpad.in",
  ],
  credentials: true,
}));
app.use(express.json());

// ── health check ──
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "CollegeMatch backend is running", timestamp: new Date().toISOString() });
});

// ── routes ──
app.use("/api/auth",    authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin",   adminRoutes);
app.use("/api/colleges", collegeRoutes);

// ── MongoDB ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));