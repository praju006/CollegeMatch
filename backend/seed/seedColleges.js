import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import College from "../models/College.js";
import colleges from "./collegesData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env safely
dotenv.config({ path: path.join(__dirname, "../.env") });

async function seedColleges() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for seeding 🚀");

    // Optional: clear old data
    await College.deleteMany();
    console.log("Old colleges removed");

    // Insert new data
    await College.insertMany(colleges);
    console.log("Colleges seeded successfully 🌱");

    process.exit();
  } catch (error) {
    console.error("Seeding failed ❌", error);
    process.exit(1);
  }
}

seedColleges();
