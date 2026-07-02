import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  duration:     { type: String, required: true, trim: true },
  fees:         { type: Number, required: true },
  seats:        { type: Number, required: true },
  cutoffMarks:  { type: Number, required: true },
  specializations: [{ type: String, trim: true }],
});

const placementSchema = new mongoose.Schema({
  averagePackage:  { type: Number, required: true },
  highestPackage:  { type: Number, required: true },
  placementRate:   { type: Number, required: true },
  topRecruiters:   [{ type: String, trim: true }],
});

const collegeSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  shortName:   { type: String, required: true, trim: true },
  city:        { type: String, required: true, trim: true },
  type:        { type: String, enum: ["Government", "Private", "Deemed"], required: true },
  ranking:     { type: Number, required: true },
  rating:      { type: Number, min: 0, max: 5, required: true },
  established: { type: Number, required: true },
  affiliation: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  imageUrl:    { type: String, trim: true, default: "" },
  website:     { type: String, trim: true, default: "" },
  applicationLink: { type: String, trim: true, default: "" },
  approvedBy:  [{ type: String, trim: true }],
  facilities:  [{ type: String, trim: true }],
  courses:     [courseSchema],
  placement:   { type: placementSchema, required: true },
  isActive:    { type: Boolean, default: true },
  addedBy:     { type: String, default: "admin" },
}, { timestamps: true });

export default mongoose.model("College", collegeSchema);